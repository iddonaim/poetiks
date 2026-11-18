import {lookup} from './lookup.mjs';

const dialog = document.querySelector('#ask-poetiks');
const field = document.querySelector('#ask-question');
const result = document.querySelector('#ask-result');
const form = document.querySelector('#ask-form');
let catalogue;
let generation = 0;
let pending;
let opener;

function element(tag, text) {
  const node = document.createElement(tag);
  node.textContent = text;
  return node;
}
function openPanel(trigger) {
  if (dialog.open) return;
  opener = trigger;
  dialog.showModal();
  field.focus({preventScroll:true});
}
document.querySelectorAll('a[href="#ask"]').forEach(link => link.addEventListener('click', e => {
  e.preventDefault();
  openPanel(link);
}));
if (location.hash === '#ask') openPanel();
window.addEventListener('hashchange', () => {
  if (location.hash === '#ask') openPanel();
});
dialog.querySelector('.ask-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => {
  generation++;
  pending?.abort();
  if (location.hash === '#ask') history.replaceState(null, '', location.pathname + location.search);
  (opener || document.querySelector('a[href="#ask"]')).focus({preventScroll:true});
});
function showPoints(points, he) {
  result.replaceChildren();
  for (const point of points) {
    const article = document.createElement('article');
    article.append(element('p',point.text));
    for (const source of point.sources) {
      const details = document.createElement('details');
      const summary = document.createElement('summary');
      const link = element('a', source.label);
      link.dir = 'ltr';
      link.lang = 'en';
      link.href = source.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      article.append(link, details);
      summary.textContent = he ? 'קטע מהמקור' : 'Source excerpt';
      details.append(summary, element('pre',source.text));
    }
    result.append(article);
  }
}
form.addEventListener('submit',async e => {
  e.preventDefault();
  const question = field.value.trim();
  if (!question) {field.focus(); return;}
  if (form.querySelector('button').disabled) return;
  const sendButton = form.querySelector('button');
  sendButton.disabled = true;
  const run = ++generation;
  pending?.abort();
  const he = /[א-ת]/.test(question);
  result.lang = he ? 'he' : 'en';
  result.dir = he ? 'rtl' : 'ltr';
  result.textContent = he ? 'מחפש במקורות…' : 'Checking the sources…';
  try {
    const controller = new AbortController();
    pending = controller;
    let answer;
    try {
      const response = await fetch('/api/ask',{method:'POST',signal:controller.signal,
        headers:{'Content-Type':'application/json'},body:JSON.stringify({question})});
      if (!response.ok) throw Error();
      answer = await response.json();
    } catch (error) {
      if (controller.signal.aborted) return;
      if (!catalogue) {
        const response = await fetch('/ask/catalogue.json',{signal:controller.signal});
        if (!response.ok) throw Error();
        catalogue = await response.json();
      }
      answer = {...lookup(question,catalogue),reason:'lookup-only'};
    }
    if (run !== generation) return;
    const {points} = answer;
    if (!points.length) {
      result.textContent = he ? 'לא נמצאה תשובה במקורות שנבחרו. אפשר לשאול על מצב עבודה, מאגר או תוצר מסוים.' :
        'I couldn’t find an answer in the selected sources. Try naming a mode, repository or output.';
    } else {
      showPoints(points,he);
      result.prepend(element('small',answer.mode === 'ai' ? (he ? 'תשובת AI עם מקורות' : 'AI answer with sources') :
        (he ? 'הערות מהמקורות שנבחרו' : 'Notes from the project sources')));
    }
    if (answer.reason === 'daily-limit') result.prepend(element('p',he ?
      'הגענו למכסת 50 שאלות ה־AI להיום. החיפוש במקורות ממשיך לפעול.' :
      'All 50 AI questions have been used today. Source lookup is still available.'));
  } catch {
    if (run === generation) result.textContent = he ? 'לא ניתן לטעון את המקורות. נסו שוב.' : 'The sources could not load. Please try again.';
  } finally { sendButton.disabled = false; }
});
dialog.querySelectorAll('.ask-samples button').forEach(button => button.addEventListener('click', () => {
  field.value = button.textContent;
  form.requestSubmit();
}));
