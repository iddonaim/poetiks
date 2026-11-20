import test from 'node:test';
import assert from 'node:assert/strict';
import {usage} from '../lib/quota.mjs';
import {notifyUsage} from '../lib/usage-email.mjs';

test('email only on reaching the daily threshold, even across simultaneous admissions and a lost response', async t => {
  const env = {VERCEL_ENV:'production', AGENTMAIL_API_KEY:'test', POETIKS_ALERT_TO:'owner@example.test'};
  const receipts = new Map();
  const store = {
    async has(path) { return receipts.has(path); },
    async save(path, id) { receipts.set(path, id); },
  };
  const accepted = new Map();
  let requests = 0;
  let loseFirstResponse = true;
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    requests++;
    const data = JSON.parse(options.body);
    if (url === 'https://api.agentmail.to/v0/inboxes') {
      assert.equal(data.client_id, 'poetiks-usage-alerts');
      return Response.json({inbox_id:'sender@example.test'});
    }
    assert.equal(url, 'https://api.agentmail.to/v0/inboxes/sender%40example.test/messages/send');
    assert.deepEqual(data.to, [env.POETIKS_ALERT_TO]);
    assert.match(data.text, /10 daily slots.*midnight in Jerusalem/);
    const key = options.headers['Idempotency-Key'];
    if (accepted.has(key)) assert.deepEqual(data, accepted.get(key));
    accepted.set(key, data);
    if (loseFirstResponse) {
      loseFirstResponse = false;
      throw Error('response lost after send');
    }
    return Response.json({message_id:key});
  });

  const today = '2026-11-20';
  await notifyUsage(usage(today,39),store,env);
  await notifyUsage(usage(today,40),store,{...env,VERCEL_ENV:'preview'});
  assert.equal(requests,0);
  await Promise.all([40,41].map(n => notifyUsage(usage(today,n),store,env)));
  assert.equal(receipts.size,1);
  const requestsAfterDelivery = requests;
  await notifyUsage(usage(today,50),store,env);
  assert.equal(requests,requestsAfterDelivery);
  await notifyUsage(usage('2026-11-21',40),store,env);
  assert.deepEqual([...accepted.keys()], ['poetiks-usage-2026-11-20','poetiks-usage-2026-11-21']);
  assert.equal(receipts.size,2);
});
