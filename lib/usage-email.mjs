import {get, put} from '@vercel/blob';

const receipts = {
  async has(path) {
    const result = await get(path, {access:'private', useCache:false});
    if (result === null) return false;
    if (result.statusCode !== 200) throw Error('Could not read the email receipt');
    await result.stream.cancel();
    return true;
  },
  async save(path, messageId) {
    await put(path, JSON.stringify({messageId}), {
      access:'private', addRandomSuffix:false, allowOverwrite:true, contentType:'application/json',
    });
  },
};

async function sendWarning({date, alertAt, limit}, env) {
  const headers = {Authorization:'Bearer ' + env.AGENTMAIL_API_KEY, 'Content-Type':'application/json'};
  const api = 'https://api.agentmail.to/v0/inboxes';
  const inbox = await fetch(api, {
    method:'POST', headers, signal:AbortSignal.timeout(4000),
    body:JSON.stringify({client_id:'poetiks-usage-alerts', display_name:'Ask POETIKS'}),
  });
  if (!inbox.ok) throw Error('Email sender returned HTTP ' + inbox.status);
  const {inbox_id} = await inbox.json();
  if (!inbox_id) throw Error('Email sender is unavailable');

  // Keep the key and the body identical if concurrent questions or a timeout trigger a retry.
  const response = await fetch(api + '/' + encodeURIComponent(inbox_id) + '/messages/send', {
    method:'POST', signal:AbortSignal.timeout(5000),
    headers:{...headers, 'Idempotency-Key':'poetiks-usage-' + date},
    body:JSON.stringify({
      to:[env.POETIKS_ALERT_TO],
      subject:`Ask POETIKS reached ${alertAt} of ${limit} questions on ${date}`,
      text:`Ask POETIKS reached ${alertAt} AI questions on ${date}, leaving ${limit-alertAt} daily slots at that point. The daily limit resets at midnight in Jerusalem.`,
    }),
  });
  if (!response.ok) throw Error('Email delivery returned HTTP ' + response.status);
  const {message_id} = await response.json();
  if (!message_id) throw Error('Email delivery returned no receipt');
  return message_id;
}

export async function notifyUsage(usage, store = receipts, env = process.env) {
  if (usage.used < usage.alertAt || env.VERCEL_ENV !== 'production') return;
  if (!env.AGENTMAIL_API_KEY || !env.POETIKS_ALERT_TO) {
    console.error('POETIKS usage email is unconfigured for', usage.date);
    return;
  }
  const path = 'poetiks-ask/alerts/' + usage.date + '.json';
  // Retry once during this request. Later admissions can recover a failed delivery.
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      if (await store.has(path)) return;
      const messageId = await sendWarning(usage, env);
      await store.save(path, messageId);
      return;
    } catch (error) {
      if (attempt === 1) console.error('POETIKS usage email failed for', usage.date, error.message);
    }
  }
}
