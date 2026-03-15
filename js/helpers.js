// ============================================================
// APEX.AI — Helper Functions
// ============================================================

/** Escape HTML special characters to prevent XSS */
const esc = s => (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

/** Build the profile context string injected into each AI request */
function buildCtx(p) {
  if (!p) return '';
  const L = [];
  const a = (label, key) => { if (p[key]) L.push(label + ': ' + p[key]); };
  a('Name','fullName');        a('Email','email');        a('Phone','phone');
  a('Location','location');   a('LinkedIn','linkedin');  a('Portfolio','portfolio');
  a('Target Role','targetRole');  a('Industry','targetIndustry');
  a('Experience Level','yearsExp'); a('Work Preference','workType');
  if (p.jobDescription) L.push('Job Description to tailor for:\n' + p.jobDescription);
  a('Current Title','currentTitle');    a('Current Company','currentCompany');
  a('Duration','currentDuration');
  if (p.currentBullets) L.push('Day-to-day responsibilities:\n' + p.currentBullets);
  if (p.pastJobs)       L.push('Previous jobs:\n' + p.pastJobs);
  if (p.biggestWin)     L.push('Biggest achievement: ' + p.biggestWin);
  if (p.techSkills)     L.push('Technical skills: ' + p.techSkills);
  if (p.tools)          L.push('Tools & platforms: ' + p.tools);
  if (p.education)      L.push('Education:\n' + p.education);
  a('Certifications','certifications'); a('Languages','languages');
  if (p.projects)       L.push('Projects:\n' + p.projects);
  a('Awards','awards');
  if (p.extraNotes)     L.push('Additional notes: ' + p.extraNotes);
  return '\n\n[CANDIDATE FULL PROFILE:\n' + L.join('\n') + ']';
}

/** Parse the ---RESUME_START--- block from the AI response */
function parseResume(text) {
  const m = text.match(/---RESUME_START---([\s\S]*?)---RESUME_END---/);
  if (!m) return null;
  const c = m[1];
  const getMeta = k => { const r = c.match(new RegExp(k + ':\\s*(.+)')); return r ? r[1].trim() : ''; };
  const getSec  = n => { const r = c.match(new RegExp('## ' + n + '\\n([\\s\\S]*?)(?=\\n## |$)')); return r ? r[1].trim() : ''; };
  return {
    name:       getMeta('FULL_NAME'),
    role:       getMeta('ROLE'),
    email:      getMeta('EMAIL'),
    phone:      getMeta('PHONE'),
    location:   getMeta('LOCATION'),
    linkedin:   getMeta('LINKEDIN'),
    summary:    getSec('PROFESSIONAL SUMMARY'),
    experience: getSec('EXPERIENCE'),
    skills:     getSec('SKILLS'),
    education:  getSec('EDUCATION'),
    certs:      getSec('CERTIFICATIONS'),
    projects:   getSec('PROJECTS'),
  };
}

/** Format an AI message for safe HTML display in the chat bubble */
function formatMsg(t) {
  // Hide the raw resume block — show a friendly card instead
  t = t.replace(/---RESUME_START---[\s\S]*?---RESUME_END---/g,
    '<strong>Resume generated!</strong> Switch to the Preview tab to see and export it.');
  t = t.replace(/```([\s\S]*?)```/g, '<pre>$1</pre>');
  t = t.replace(/## (.+)/g, '<div class="mh">$1</div>');
  t = t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  t = t.replace(/\n/g, '<br/>');
  return t;
}

/** Heuristic: infer a resume score from conversation content */
function guessScore(msgs) {
  const all = msgs.map(m => m.content).join(' ').toLowerCase();
  if (all.includes('excellent') || all.includes('outstanding')) return 92;
  if (all.includes('strong')    || all.includes('impressive'))  return 84;
  if (all.includes('good')      || all.includes('solid'))       return 75;
  if (all.includes('average')   || all.includes('decent'))      return 63;
  if (all.includes('weak')      || all.includes('missing'))     return 52;
  if (all.includes('poor')      || all.includes('major issues'))return 36;
  return null;
}
