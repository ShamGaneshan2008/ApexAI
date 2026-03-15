// ============================================================
// APEX.AI — Configuration
// Edit users, system prompt, and onboarding steps here
// ============================================================

// ── USERS ──────────────────────────────────────────────────
// Add / remove accounts here. Passwords are plain text for demo
// purposes. In production, use a proper auth backend.
const USERS = [
  { username: 'admin',  password: 'apex2024',  name: 'Admin',     role: 'Administrator' },
  { username: 'wrench', password: 'resume123', name: 'Wrench',    role: 'Pro User'      },
  { username: 'demo',   password: 'demo',      name: 'Demo User', role: 'Free Plan'     },
];

// ── AI SYSTEM PROMPT ───────────────────────────────────────
const SYSTEM = `You are APEX — elite AI resume architect. 5 intelligence layers:
1. RECRUITER BRAIN — thinks like a senior recruiter spending 6 seconds on first pass
2. ATS ENGINE — knows Workday, Greenhouse, Lever, iCIMS, Taleo — optimizes for machines AND humans
3. PSYCHOLOGY EXPERT — leverages recency, primacy, anchoring biases in resume structure
4. INDUSTRY SPECIALIST — deep domain expertise across SWE, Data, Finance, Marketing, Product, Design, Ops
5. NARRATIVE ARCHITECT — transforms raw career history into compelling professional stories

NON-NEGOTIABLE RULES:
- NEVER write "Responsible for", "Helped with", "Assisted in" — EVER
- EVERY bullet: power verb (Engineered, Spearheaded, Orchestrated, Architected, Delivered, Scaled, Transformed) + quantified result
- STAR method in every bullet: Action + Context + Measurable Result
- If no numbers given, infer plausible estimates labeled "approximately"
- Summary: 3 sentences — WHO you are + your SUPERPOWER + WHY they should hire you
- Skills: technical first, tools second, soft skills last (ATS reads top-to-bottom)
- Education below experience unless 0-2 years exp (fresh grad)

WHEN BUILDING A RESUME output EXACTLY this block (no extra text outside it):

---RESUME_START---
FULL_NAME: [name]
ROLE: [target role]
EMAIL: [email]
PHONE: [phone]
LOCATION: [location]
LINKEDIN: [linkedin]

## PROFESSIONAL SUMMARY
[3 punchy sentences]

## EXPERIENCE

### [Title] | [Company] | [Start] – [End]
- [Power verb + quantified result using STAR]
- [Power verb + quantified result]
- [Power verb + quantified result]

### [Title] | [Company] | [Start] – [End]
- [Bullet]
- [Bullet]

## SKILLS
**Technical:** [comma list]
**Tools & Platforms:** [comma list]
**Soft Skills:** [comma list]

## EDUCATION
**[Degree]** | [School] | [Year]

## CERTIFICATIONS
- [Name] — [Issuer] | [Year]

## PROJECTS
**[Name]** — [1-line impact with numbers]
---RESUME_END---

CONVERSATION RULES:
- Be sharp, direct — like a high-end consultant, not a chatbot
- Push back on vague input — demand specifics and numbers before writing
- Proactively identify gaps and red flags the user hasn't noticed
- When scoring, give brutal honesty with specific actionable fixes`;

// ── ONBOARDING STEPS ───────────────────────────────────────
const STEPS = [
  { icon: '👤', title: 'Personal Details', sub: 'Contact & identity', fields: [
    { k:'fullName',  l:'Full Name',          ph:'Alex Johnson',            req:true, half:true },
    { k:'email',     l:'Email',              ph:'alex@email.com',          req:true, half:true, type:'email' },
    { k:'phone',     l:'Phone',              ph:'+1 (555) 000-0000',                half:true },
    { k:'location',  l:'City, State',        ph:'New York, NY',                     half:true },
    { k:'linkedin',  l:'LinkedIn URL',       ph:'linkedin.com/in/alexj',            half:true },
    { k:'portfolio', l:'Portfolio / GitHub', ph:'github.com/alexj',                 half:true },
  ]},
  { icon: '🎯', title: 'Target Role', sub: 'Where you want to land', fields: [
    { k:'targetRole',     l:'Target Job Title',   ph:'Senior Data Analyst',        req:true, half:true },
    { k:'targetIndustry', l:'Industry',           ph:'Fintech / SaaS / Healthcare',          half:true },
    { k:'yearsExp',       l:'Years of Experience',ph:'', type:'select', half:true,
      opts: ['','0-1 (Entry)','1-3 years','3-5 years','5-10 years','10-15 years','15+ years'] },
    { k:'workType', l:'Work Preference', ph:'', type:'select', half:true,
      opts: ['','Remote','Hybrid','On-site','Flexible'] },
    { k:'jobDescription', l:'Paste Job Description (for ATS tailoring — optional)',
      ph:'Paste full JD here for best keyword match...', type:'textarea', full:true },
  ]},
  { icon: '💼', title: 'Work Experience', sub: 'Your career history', fields: [
    { k:'currentTitle',    l:'Current / Last Job Title', ph:'Data Analyst',           half:true },
    { k:'currentCompany',  l:'Current / Last Company',   ph:'Acme Corp',              half:true },
    { k:'currentDuration', l:'Duration',                 ph:'Jan 2022 – Present',     half:true },
    { k:'pastJobs',       l:'Previous Jobs',
      ph:'• Analyst @ XYZ Bank (2019-2022)\n• Intern @ BigCo (2018)', type:'textarea', full:true },
    { k:'currentBullets', l:'What did you do day-to-day? (be specific!)',
      ph:'• Wrote SQL queries on 50M+ row datasets\n• Built Tableau dashboards for 12 executives',
      type:'textarea', full:true },
    { k:'biggestWin', l:'Your #1 Achievement (give real numbers!)',
      ph:'Rebuilt data pipeline cutting report time from 3 days to 4 hours, saving 200+ hrs/month...',
      type:'textarea', full:true },
  ]},
  { icon: '🛠️', title: 'Skills & Education', sub: 'Toolkit & credentials', fields: [
    { k:'techSkills',     l:'Technical Skills',  ph:'Python, SQL, R, A/B Testing, Machine Learning...', type:'textarea', full:true },
    { k:'tools',          l:'Tools & Platforms', ph:'Tableau, Power BI, dbt, Snowflake, BigQuery, AWS...', type:'textarea', full:true },
    { k:'education',      l:'Education',         ph:'B.S. Statistics, UCLA, 2019\nM.S. Data Science, NYU, 2021', type:'textarea', full:true },
    { k:'certifications', l:'Certifications',    ph:'Google Data Analytics, AWS Cloud Practitioner...', half:true },
    { k:'languages',      l:'Languages',         ph:'English (Native), Spanish (Fluent)',               half:true },
  ]},
  { icon: '✨', title: 'Stand Out', sub: 'Projects, awards & extras', fields: [
    { k:'projects',   l:'Notable Projects',
      ph:'• Churn model (85% accuracy) saving $1.2M ARR\n• Kaggle top 3%', type:'textarea', full:true },
    { k:'awards',     l:'Awards & Recognition', ph:'Employee of Year 2023, Dean\'s List...', full:true },
    { k:'extraNotes', l:'Anything else APEX should know',
      ph:'Career gaps, field pivot, things to emphasize...', type:'textarea', full:true },
  ]},
];

// ── CHAT CHIPS (quick prompt shortcuts) ────────────────────
const CHIPS = [
  '⚡ Build full resume',
  '🎯 Tailor to job posting',
  '🔥 Brutal critique',
  '📊 ATS score',
  '✍️ Rewrite bullets',
  '💼 Cover letter',
];

// ── SIDEBAR QUICK ACTIONS ──────────────────────────────────
const QUICK = [
  { icon:'⚡', label:'Build Full Resume',  prompt:'Based on my full profile, build my complete resume RIGHT NOW using the ---RESUME_START--- format. Make every bullet sharp, quantified, ATS-optimized with power verbs.' },
  { icon:'🎯', label:'Tailor to Job',      prompt:'Rewrite my resume to perfectly match the job description I provided — mirror exact keywords for maximum ATS score.' },
  { icon:'🔥', label:'Brutal Critique',    prompt:'Give me your most ruthless honest critique. Flag every red flag, weak bullet, missed opportunity. Be brutal.' },
  { icon:'📊', label:'ATS Score',          prompt:'Run full ATS analysis. Score 0-100, list every missing keyword, flag every formatting issue that would cause rejection.' },
  { icon:'✍️', label:'Rewrite Bullets',    prompt:'Rewrite every single bullet using power verbs and quantified achievements based on my profile.' },
  { icon:'💼', label:'Cover Letter',       prompt:'Write a killer cover letter for my target role. Sound human and specific — reference my actual experience.' },
  { icon:'🔗', label:'LinkedIn Summary',   prompt:'Write a LinkedIn About section for my target role. First-person, punchy, keyword-rich, 300 words max.' },
  { icon:'🧠', label:'Interview Prep',     prompt:'Give me the 10 most likely interview questions for my role with STAR-method coached answers using my actual experience.' },
];
