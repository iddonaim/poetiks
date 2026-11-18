// Read-only public endpoint for other POETIKS interfaces.
import catalogue from '../hub/ask/catalogue.json' with { type: 'json' };
import {lookup} from '../hub/ask/lookup.mjs';

export default function ask(req, res) {
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
  return res.status(200).json(lookup(question.trim(), catalogue));
}
