import {blobCounter, localDay, usage} from '../lib/quota.mjs';

export default async function handler(req,res) {
  res.setHeader('Cache-Control','private, no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow','GET');
    return res.status(405).json({error:'Use GET.'});
  }
  const today = localDay();
  const day = req.query?.date ?? today;
  const oldest = localDay(new Date(Date.now()-7*86400000));
  if (typeof day !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(day) || day < oldest || day > today) return res.status(400).json({error:'Choose a date in the past seven days.'});
  if (!process.env.OPENAI_API_KEY || !process.env.BLOB_READ_WRITE_TOKEN) return res.status(503).json({enabled:false});
  try {
    const row = await blobCounter.read(day);
    return res.status(200).json({enabled:true,...usage(day,row?.used ?? 0)});
  } catch { return res.status(503).json({enabled:false}); }
}
