// Read-only public endpoint for other POETIKS interfaces.
import catalogue from '../hub/ask/catalogue.json' with { type: 'json' };
import {lookup} from '../hub/ask/lookup.mjs';

import {reserve} from '../lib/quota.mjs';
import {aiAnswer} from '../lib/answer.mjs';

export default async function ask(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({error:'Send a POST with a JSON question.'});
  }
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { return res.status(400).json({error:'Invalid JSON.'}); }
  }
  const question = body?.question;
  if (typeof question !== 'string' || !question.trim() || question.length > 1200) {
    return res.status(400).json({error:'Enter a question between 1 and 1,200 characters.'});
  }
  const query = question.trim();
  const notes = reason => ({...lookup(query,catalogue),reason});
  if (!process.env.OPENAI_API_KEY || !process.env.BLOB_READ_WRITE_TOKEN) return res.status(200).json(notes('lookup-only'));
  if (/experiment|ניסוי|ניסויים/i.test(query)) return res.status(200).json(notes('outside-catalogue'));
  let slot;
  try { slot = await reserve(); }
  catch { return res.status(200).json(notes('counter-unavailable')); }
  if (!slot.admitted) return res.status(200).json({...notes('daily-limit'),usage:slot.usage});
  try { return res.status(200).json({...await aiAnswer(query,catalogue),usage:slot.usage}); }
  catch { return res.status(200).json({...notes('ai-unavailable'),usage:slot.usage}); }
}
