import test from 'node:test';
import assert from 'node:assert/strict';
import catalogue from '../hub/ask/catalogue.json' with {type:'json'};
import {lookup} from '../hub/ask/lookup.mjs';
import ask from '../api/ask.mjs';

test('public answers cite versioned project sources, in the question language', () => {
  for (const [q, lang, expected] of [
    ['Which Decode exports include a plan underlay?', 'en', 'S30'],
    ['איך המערכת עובדת?', 'he', 'S26'],
    ['What are the four cutters on V-35?', 'en', 'S23'],
    ['איך עוברת המפה ל-Encode?', 'he', 'S10'],
    ['How is the site dashboard relayed to the studio?', 'en', 'S08'],
  ]) {
    const answer = lookup(q,catalogue);
    assert.equal(answer.language,lang);
    assert.ok(answer.points.flatMap(p => p.sources).some(s => s.id === expected), q);
  }
  for (const [id, source] of Object.entries(catalogue.sources)) {
    assert.ok(!['S28','S29'].includes(id));
    assert.match(source.url,/^https:\/\/github\.com\/iddonaim\/(archthesis|map-context|poetiks|cuboid-studio)\/blob\/[a-f0-9]{40}\/.+#L\d+-L\d+$/);
    assert.ok(source.text.trim());
  }
});
test('unsupported questions, ongoing experiments and uninspected cards do not produce claims', () => {
  for (const q of ['Unicorn biology?', 'Results of ongoing Encode experiments?', 'איזה ניסויים הצליחו?', 'What are the cutters on V-36?']) {
    assert.deepEqual(lookup(q,catalogue).points, [], q);
  }
});
test('HTTP interface accepts only a bounded question and shares the browser answer', async () => {
  delete process.env.OPENAI_API_KEY;
  delete process.env.BLOB_READ_WRITE_TOKEN;
  const response = () => ({setHeader(){},status(code){this.code=code;return this;},json(value){this.value=value;return this;}});
  for (const [method, body, code] of [['GET',{},405], ['POST','{',400], ['POST',{question:' '},400], ['POST',{question:'a'.repeat(1201)},400]]) {
    assert.equal((await ask({method,body},response())).code,code);
  }
  const q = 'Which exports keep the underlay?';
  const result = await ask({method:'POST',body:{question:q}},response());
  assert.equal(result.code,200);
  assert.deepEqual(result.value,{...lookup(q,catalogue),reason:'lookup-only'});
});

import {reserve,localDay,limit} from '../lib/quota.mjs';
import {aiAnswer} from '../lib/answer.mjs';

test('concurrent admissions stop at 50 and local midnight gets a separate counter', async () => {
  const rows = new Map();
  const store = {
    async read(day){return rows.get(day);},
    async advance(day,old,used){
      if (rows.get(day)?.etag !== old?.etag) return false;
      rows.set(day,{used,etag:String(used)});
      return true;
    }
  };
  const t = new Date('2026-11-18T21:59:59Z');
  assert.equal(localDay(t),'2026-11-18');
  rows.set(localDay(t),{used:39,etag:'start'});
  const calls=await Promise.all(Array.from({length:55},()=>reserve(store,t)));
  assert.equal(calls.filter(r=>r.admitted).length,11);
  assert.ok(calls.some(r=>r.admitted && r.usage.used === r.usage.alertAt));
  assert.equal((await reserve(store,t)).usage.used,limit);
  const next=await reserve(store,new Date('2026-11-18T22:00:01Z'));
  assert.equal(next.usage.used,1);
  assert.equal(next.usage.date,'2026-11-19');
});

test('generated answers require a quote from every cited passage',async t=>{
  let call=0;
  const results=[{ids:['S30']},{points:[{text:'Visible underlays are included in SVG and PNG.',refs:['S30.1']}]},
    {ids:['S30']},{points:[{text:'unsupported',refs:['S99.1']}]}];
  t.mock.method(globalThis,'fetch',async(url,options)=>{
    assert.equal(url,'https://api.openai.com/v1/responses');
    assert.equal(JSON.parse(options.body).store,false);
    return Response.json({status:'completed',output:[{content:[{type:'output_text',text:JSON.stringify(results[call++])}]}]});
  });
  const answer = await aiAnswer('Decode export?',catalogue);
  assert.equal(answer.points[0].sources[0].url,catalogue.sources.S30.url);
  assert.ok(catalogue.sources.S30.text.includes(answer.points[0].sources[0].text));
  await assert.rejects(aiAnswer('Decode export?',catalogue),/Unverified citation/);
});

import {suggestFollowUp} from '../hub/ask/follow-up.mjs';

test('follow-ups relate to the cited source and skip recently asked questions', () => {
  const points = [{sources:[{id:'S23'}]}];
  const next = suggestFollowUp(points,[],'en');
  assert.match(next,/70 cube variations/);
  assert.notEqual(suggestFollowUp(points,[next.toUpperCase().replace('?', '')],'en'),next);
});

test('every source and the no-evidence state offer answerable follow-ups in both languages', () => {
  for (const language of ['en','he']) {
    for (const id of [null,...Object.keys(catalogue.sources)]) {
      const points = id ? [{sources:[{id}]}] : [];
      const asked = [];
      for (let i = 0; i < 8; i++) {
        const next = suggestFollowUp(points,asked,language);
        assert.ok(!asked.slice(-6).includes(next));
        assert.equal(/[א-ת]/.test(next),language === 'he');
        assert.ok(lookup(next,catalogue).points.length,next);
        asked.push(next);
      }
    }
  }
});
