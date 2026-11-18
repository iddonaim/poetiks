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
test('HTTP interface accepts only a bounded question and shares the browser answer', () => {
  const response = () => ({setHeader(){},status(code){this.code=code;return this;},json(value){this.value=value;return this;}});
  for (const [method, body, code] of [['GET',{},405], ['POST','{',400], ['POST',{question:' '},400], ['POST',{question:'a'.repeat(1201)},400]]) {
    assert.equal(ask({method,body},response()).code,code);
  }
  const q = 'Which exports keep the underlay?';
  const result = ask({method:'POST',body:{question:q}},response());
  assert.equal(result.code,200);
  assert.deepEqual(result.value,lookup(q,catalogue));
});
