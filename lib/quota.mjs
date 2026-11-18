import {get, put, BlobPreconditionFailedError} from '@vercel/blob';

export const limit = 50;
export const alertAt = 40;
export const timezone = 'Asia/Jerusalem';
const dateFormat = new Intl.DateTimeFormat('en-CA',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit'});
export const localDay = (now = new Date()) => dateFormat.format(now);
export function usage(date, used) { return {date,timezone,used,limit,alertAt,remaining:limit-used}; }

export const blobCounter = {
  async read(day) {
    const result = await get('poetiks-ask/'+day+'.json',{access:'private',useCache:false});
    if (result === null) return null;
    if (result.statusCode !== 200 || !result.blob.etag) throw Error('Counter unavailable');
    const {used} = await new Response(result.stream).json();
    if (!Number.isInteger(used) || used < 1 || used > limit) throw Error('Invalid counter');
    return {used,etag:result.blob.etag};
  },
  async advance(day, previous, used) {
    try {
      await put('poetiks-ask/'+day+'.json',JSON.stringify({used}),{
        access:'private',addRandomSuffix:false,contentType:'application/json',
        ...(previous ? {allowOverwrite:true,ifMatch:previous.etag} : {allowOverwrite:false})
      });
      return true;
    } catch (error) {
      if (error instanceof BlobPreconditionFailedError || (!previous && /already exists/i.test(error.message))) return false;
      throw error;
    }
  }
};
// Charge one admission before any OpenAI request. Concurrent writers must win the
// ETag check. Unknown storage or provider outcomes never free a possibly spent slot.
export async function reserve(counter = blobCounter, now = new Date()) {
  const date = localDay(now);
  for (let attempt = 0; attempt < 8; attempt++) {
    const previous = await counter.read(date);
    const used = previous?.used ?? 0;
    if (used >= limit) return {admitted:false,usage:usage(date,used)};
    if (await counter.advance(date,previous,used+1)) return {admitted:true,usage:usage(date,used+1)};
    await new Promise(resolve => setTimeout(resolve,15 + Math.random()*65));
  }
  throw Error('Counter busy');
}
