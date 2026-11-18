// Each question has an answer in the public catalogue. "after" lists passages
// from which that question is a natural next step in the project.
const questions = [
  {source:'S26', after:[], en:'What are the four modes in POETIKS?', he:'אילו מצבים יש במערכת POETIKS?'},
  {source:'S10', after:['S26', 'S01', 'S06', 'S07', 'S21'], en:'How does Map pass site context to Encode?', he:'איך הקונטקסט של האתר עובר מ־Map ל־Encode?'},
  {source:'S11', after:['S08', 'S09', 'S10'], en:'How does Encode turn a photo into a cube assembly?', he:'איך Encode הופך תצלום להרכבה של קוביות?'},
  {source:'S13', after:['S23', 'S11', 'S12', 'S15'], en:'Why are there exactly 70 cube variations?', he:'למה יש בדיוק 70 וריאציות של הקובייה?'},
  {source:'S23', after:['S13', 'S22', 'S25'], en:'Which four cutters are on card V-35?', he:'אילו ארבעה חותכים מופיעים בקלף V-35?'},
  {source:'S27', after:['S19', 'S20', 'S30', 'S23'], en:'How does Decode place notation on a floor plan?', he:'איך מציבים את הנוטציה של Decode על תכנית קומה?'},
  {source:'S30', after:['S27', 'S21', 'S18'], en:'Which Decode exports keep the underlay?', he:'אילו פורמטים של ייצוא מ־Decode שומרים את שכבת הרקע?'},
  {source:'S03', after:['S24', 'S01', 'S04', 'S05'], en:'Where is a published meme image stored?', he:'איפה נשמרת התמונה כשמפרסמים מם?'},
  {source:'S05', after:['S02', 'S03'], en:'How does Cuboid search the meme gallery?', he:'איך עובד חיפוש הממים בגלריה?'},
  {source:'S15', after:['S04', 'S05', 'S13', 'S24'], en:'How do the two translation passes turn a meme into a cutter?', he:'איך מודל התרגום הופך מם לאופרטור גאומטרי?'},
  {source:'S16', after:['S14', 'S15', 'S11', 'S12'], en:'When does an Evolution candidate become stale?', he:'מתי מועמד של Evolution כבר לא מתאים להרכבה?'},
  {source:'S18', after:['S16', 'S17', 'S19', 'S20', 'S30'], en:'How does Cuboid restore a saved composition?', he:'איך Cuboid משחזר קומפוזיציה אחרי שמירה?'},
  {source:'S21', after:['S06', 'S07', 'S08', 'S09', 'S10'], en:'What does Context Mapper export as an OBJ?', he:'מה כולל קובץ OBJ שמייצאים מ־Context Mapper?'}
];

function normalize(question) {
  return question.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
}

export function suggestFollowUp(points, recentQuestions, language) {
  const cited = new Set(points.flatMap(point => point.sources.map(source => source.id)));
  const recent = new Set(recentQuestions.slice(-6).map(normalize));
  const available = questions.filter(q => !recent.has(normalize(q[language])));
  const next = available.find(q => !cited.has(q.source) && q.after.some(id => cited.has(id)))
    ?? available.find(q => !cited.has(q.source))
    ?? available[0];
  return next[language];
}
