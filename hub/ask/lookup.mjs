// Each entry links a reviewed reading of the project to revision-pinned evidence.
// Terms in either language can retrieve the same reading.
const topics = [
  {
    terms: 'poetiks overview system works workflow four modes stages thesis project about מהי פה אתיקה הפרויקט מערכת עובדת שלבים מצבים תזה',
    en: 'POETIKS starts with a site. Map selects its context, Encode reads a photo and proposes a cube assembly, Evolution brings a meme into that assembly, and Decode places the result as two-dimensional notation on a plan or photograph.',
    he: 'פה־אתיקה מתחילה באתר. ב־Map בוחרים את הקונטקסט שלו, ב־Encode קוראים תצלום ומציעים הרכבה של קוביות, ב־Evolution מכניסים מם להרכבה וב־Decode מציבים אותה כנוטציה דו־ממדית על תכנית או תצלום.',
    ids: ['S26', 'S27']
  },
  {
    terms: 'repos repositories architecture applications apps connect connected components handoff archthesis studio database services מאגרים יישומים מתחברים רכיבים ארכיטקטורה',
    en: 'Three applications share the work. Archthesis publishes memes in Firestore, Cuboid Studio reads them there, and Context Mapper sends site analysis to Cuboid through an embedded map.',
    he: 'שלושה יישומים משתתפים בתהליך. Archthesis מפרסם ממים ב־Firestore, סטודיו Cuboid קורא אותם משם, ו־Context Mapper מעביר לסטודיו ניתוח אתר דרך מפה מוטמעת.',
    ids: ['S01', 'S05', 'S08']
  },
  {
    terms: 'publish published meme create image upload meme record storage fields firebase firestore פרסום מפרסמים מם תמונה אחסון שדות',
    en: 'Publishing uploads the meme as a JPEG to Firebase Storage. Archthesis then saves the image URL, meme text and other metadata in a Firestore document in the memes collection.',
    he: 'בפרסום מם, Archthesis מעלה קובץ JPEG ל־Firebase Storage ושומר את כתובת התמונה, הטקסט ושאר פרטי המם במסמך באוסף memes של Firestore.',
    ids: ['S02', 'S03']
  },
  {
    terms: 'meme gallery search filters hidden likes sort engagement inputs גלריה חיפוש סינון מוסתרים לייקים',
    en: 'Cuboid queries the memes collection, removes hidden entries and applies text search. A selected meme supplies a description, a location tag and an engagement level derived from likes.',
    he: 'Cuboid קורא את אוסף הממים, מסנן רשומות מוסתרות ומחפש בטקסט. מהמם הנבחר הוא לוקח תיאור, תג מיקום ורמת מעורבות המחושבת מלייקים.',
    ids: ['S04', 'S05']
  },
  {
    terms: 'context mapper address maps site dashboard atlas gis city urban analysis layers analyze buildings streets demographics address כתובת מפה אתר אטלס שכבות ניתוח בניינים רחובות נתונים',
    en: 'Context Mapper takes a street address and builds an HTML dashboard and a 3D city atlas. The analysis includes streets, buildings, trees, transit, elevation and plans. The response contains both the rendered dashboard and structured site data.',
    he: 'Context Mapper מקבל כתובת ומפיק לוח נתונים ב־HTML ואטלס עירוני תלת־ממדי. הניתוח כולל רחובות, מבנים, עצים, תחבורה, גבהים ותכניות. התשובה מכילה גם את התצוגה וגם את נתוני האתר.',
    ids: ['S06', 'S07']
  },
  {
    terms: 'map encode handoff mapper cuboid sends passes receives active site context reach reaches relay relayed forwarded studio dashboard iframe postmessage analysis-complete sitecontext location selected map-to-encode העברה מעביר מגיע נבחר הקשר קונטקסט בחירת מפה קידוד',
    en: 'The mapper relays analysis-complete from its embedded dashboard. Cuboid checks the sender’s origin, adapts the payload and saves the active site context. Encode and Translate then include that context in their requests.',
    he: 'המפה מעבירה הודעת analysis-complete מלוח הנתונים המוטמע. Cuboid בודק את מקור ההודעה, ממיר את הנתונים ושומר את הקונטקסט הפעיל של האתר. Encode ו־Translate מצרפים אותו לבקשות שלהם.',
    ids: ['S08', 'S09', 'S10']
  },
  {
    terms: 'encode photo photograph spatial reading assembly atmosphere light rhythm placement merge remix apply encoding five axes seed צילום תצלום קידוד מערך הרכבה מקצב מיזוג רמיקס צירים',
    en: 'Encode combines images with site context and can take a seed assembly. It proposes cubes and an editable reading of atmosphere, light, emotion, rhythm and placement. The architect can apply the proposal, merge it or remix an existing assembly.',
    he: 'Encode משלב תצלומים עם קונטקסט האתר ויכול לקבל הרכבה קיימת כנקודת מוצא. הוא מציע קוביות וקריאה הניתנת לעריכה בחמישה צירים — אווירה, אור, רגש, מקצב והצבה. אפשר להחיל את ההצעה, למזג או לערוך רמיקס.',
    ids: ['S11', 'S12']
  },
  {
    terms: 'cube geometry variations variation cutters cuts combinations seventy 70 eight four 42mm cards deck catalogue numbering grasshopper וריאציות וריאציה חותכים חתכים קובייה קלפים חפיסה שבעים',
    en: 'Each card chooses four of eight master cutters for a 42 mm cube. That gives 70 combinations. The catalogue numbers them V-00 through V-69.',
    he: 'כל קלף בוחר ארבעה מתוך שמונה חותכים לקובייה בגודל 42 מ״מ. כך מתקבלים 70 צירופים. הקטלוג ממספר אותם מ־V-00 עד V-69.',
    ids: ['S13', 'S22', 'S25']
  },
  {
    terms: 'v-35 v35 35',
    en: 'The V-35 card lists four cutters: S-02, S-03, S-04 and C-01.',
    he: 'בקלף V-35 מופיעים החותכים S-02, S-03, S-04 ו־C-01.',
    ids: ['S23']
  },
  {
    terms: 'translate translation passes model call cultural operator cutter meme rhetoric meaning geometry translation translate-meme תרגום מתורגמן מודל משמעות גאומטריה אופרטור',
    en: 'One model call returns two translation passes. The first reads the meme’s rhetoric and cultural tensions in context. The second proposes an operator and a cutter. The cutter parameters determine the geometry.',
    he: 'קריאה אחת למודל מחזירה שני מעברי תרגום. הראשון קורא את הרטוריקה והמתחים התרבותיים של המם בהקשרו. השני מציע אופרטור וחותך. פרמטרי החותך קובעים את הגאומטריה.',
    ids: ['S14', 'S15']
  },
  {
    terms: 'evolution generation candidate candidates stale target undo preview apply evolution אבולוציה מועמד מועמדים דור ביטול יעד',
    en: 'Evolution candidates refer to specific cube IDs. A proposal can be applied while its target exists. If the assembly changes and the target disappears, the proposal becomes stale. The interface also lets the architect undo the last generation.',
    he: 'מועמדים ב־Evolution מפנים למזהים של קוביות מסוימות. אפשר להחיל הצעה כל עוד קוביית היעד קיימת. אם ההרכבה משתנה וקוביית היעד נעלמת, ההצעה מסומנת כלא עדכנית. אפשר גם לבטל את הדור האחרון.',
    ids: ['S16', 'S17']
  },
  {
    terms: 'save restore composition persist saved loading rebuild serialization stored geometry history שמירה שחזור קומפוזיציה טעינה נשמר',
    en: 'Saving captures the working state across modes, including placed cubes and recorded operators. On restore, Cuboid reconstructs the geometry by applying the saved operator records.',
    he: 'שמירה מתעדת את מצב העבודה במצבים השונים, כולל הקוביות שהוצבו והאופרטורים שנרשמו. בטעינה Cuboid בונה מחדש את הגאומטריה באמצעות רשומות האופרטורים.',
    ids: ['S18']
  },
  {
    terms: 'decode export exports include formats underlays underlay png dxf svg raster floor plan tiles sheets transparent underlays editable vectors keep background architectural cad ייצוא יצוא פורמטים רקע שכבת שכבות אריחים וקטורי גיליון',
    en: 'Decode exports visible underlays in SVG and PNG. SVG keeps the tiles as editable vectors and each underlay as a separate image layer. PNG captures the visible sheet. DXF contains tile geometry only.',
    he: 'בייצוא מ־Decode שכבות הרקע הגלויות נכללות ב־SVG וב־PNG. ב־SVG האריחים נשארים וקטוריים וכל רקע נשמר כשכבת תמונה נפרדת. PNG מציג את הגיליון כפי שהוא נראה. DXF מכיל את גאומטריית האריחים בלבד.',
    ids: ['S19', 'S20', 'S30']
  },
  {
    terms: 'mapper exports obj mesh svg map atlas meters metres coordinates buildings downloads gis אטלס מטרים קואורדינטות הורדה מפה מבנים',
    en: 'Context Mapper generates SVG and OBJ downloads in the browser. They share a coordinate frame measured in metres around the site centre. The OBJ includes building geometry.',
    he: 'Context Mapper מפיק בדפדפן קובצי SVG ו־OBJ להורדה. שניהם משתמשים במערכת צירים במטרים סביב מרכז האתר. קובץ ה־OBJ כולל גאומטריה של מבנים.',
    ids: ['S21']
  },
  {
    terms: 'participatory participation platform flyers examples city public memes gallery memescape contribute השתתפות פלטפורמה גיחוך מגחכים פליירים עיר משתתפים',
    en: 'The participatory platform invites people to turn something they see in the built environment into a meme. The project hub shows examples and flyers and links to the creation tool and gallery.',
    he: 'הפלטפורמה „מגחכים על העיר” מזמינה אנשים ליצור מם על משהו שראו במרחב הבנוי. באתר הפרויקט מופיעים דוגמאות ופליירים לצד קישורים ליצירת מם ולגלריה.',
    ids: ['S24']
  },
  {
    terms: 'notation decode example drawing glyph aerial image floor plan sheet placement site nachalat yitzhak tel aviv גליף נוטציה פענוח תצלום אוויר תכנית תוכנית נחלת יצחק ייצוג',
    en: 'Decode gives each unit of the active assembly a two-dimensional glyph. The presentation shows the same assembly on an aerial image of Nachalat Yitzhak in Tel Aviv and on a floor plan.',
    he: 'ב־Decode כל יחידה בהרכבה הפעילה מקבלת גליף דו־ממדי. במצגת אותה הרכבה מופיעה על תצלום אוויר של נחלת יצחק בתל אביב ועל תכנית קומה.',
    ids: ['S27', 'S19']
  }
];
const stop = new Set('a an any are as at be by can could do does for from how i in is it me my of on or s the their them there these they this to what which who why with would you about get tell and has have all use used using its actually work please זה את של מה איך האם עם על או לי אני יש הן הם בין'.split(' '));
function tokens(value) {
  const words = value.toLowerCase().normalize('NFKC').replace(/v[\s‐‑–-]?(\d\d)/g, 'v$1').match(/[\p{L}\p{N}]+/gu) || [];
  return [...new Set(words.filter(w => !stop.has(w) && w.length > 1))];
}
const entries = topics.map(topic => ({ ...topic, keys: new Set(tokens(topic.terms)) }));
const freq = new Map();
for (const { keys } of entries) for (const key of keys) freq.set(key, (freq.get(key) || 0) + 1);
function normalizeWord(word) {
  if (freq.has(word)) return word;
  for (const prefix of ['שה', 'וה', 'מה', 'לה', 'בה', 'ה', 'ב', 'ל', 'מ', 'ו', 'ש']) {
    if (word.startsWith(prefix) && word.length > prefix.length + 2 && freq.has(word.slice(prefix.length))) return word.slice(prefix.length);
  }
  return word.endsWith('s') && freq.has(word.slice(0,-1)) ? word.slice(0,-1) : word;
}
export function lookup(question, catalogue) {
  const lang = /[א-ת]/.test(question) ? 'he' : 'en';
  const words = [...new Set(tokens(question).map(normalizeWord))];
  const result = { mode:'source-lookup', language:lang, snapshot:catalogue.snapshot, points:[] };
  if (!words.length || /experiment|unpublished|ongoing|usage stats|visitor count|ניסוי|ניסויים|משתמשים פעילים/i.test(question)) return result;
  const card = words.find(word => /^v\d{2}$/.test(word));
  const candidates = card ? entries.filter(entry => entry.keys.has(card)) : entries;
  const ranked = candidates.map(entry => {
    const matched = words.filter(word => entry.keys.has(word));
    const score = matched.reduce((sum, word) => sum + Math.log(1 + entries.length / freq.get(word)), 0);
    return { entry, score, matches:matched.length };
  }).filter(r => r.matches > 0).sort((a,b) => b.score - a.score);
  const best = ranked[0];
  if (!best || best.score < 1.6 || (!card && best.matches === 1 && words.length > 2 && best.matches / words.length < 0.34)) return result;
  // Present closely matching readings with their own evidence, including ties across different exporters.
  for (const { entry, score } of ranked.slice(0, 2)) {
    if (score < best.score * 0.8) break;
    result.points.push({ text:entry[lang], sources:entry.ids.map(id => ({ id, ...catalogue.sources[id] })) });
  }
  return result;
}
