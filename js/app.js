// ============================================================
// APEX.AI — Application State & Event Handlers
// ============================================================

// ── STATE ───────────────────────────────────────────────────
const S = {
  // Navigation
  page: 'login',       // 'login' | 'onboarding' | 'app'
  tab:  'chat',        // 'chat'  | 'preview'

  // Auth
  loggedInUser:     null,
  loginUser:        '',
  loginPass:        '',
  loginErr:         '',
  loginPassVisible: false,
  loginLoading:     false,

  // Profile form
  step:    0,
  profile: {},

  // Chat
  messages: [],
  loading:  false,
  input:    '',

  // Resume
  resume: null,
  score:  null,

  // Toast
  toast: '',
};

let _toastTimer = null;

// ── TOAST ───────────────────────────────────────────────────
function toast(msg) {
  S.toast = msg;
  render();
  if (_toastTimer) clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => { S.toast = ''; render(); }, 3000);
}

// ── MAIN RENDER DISPATCHER ──────────────────────────────────
function render() {
  const root = document.getElementById('root');
  if (S.page === 'login')      { root.innerHTML = renderLogin(); attachLogin();  return; }
  if (S.page === 'onboarding') { root.innerHTML = renderOb();    attachOb();     return; }
  root.innerHTML = renderApp();
  attachApp();
}

// ── LOGIN EVENT HANDLERS ────────────────────────────────────
function attachLogin() {
  const userEl   = document.getElementById('l-user');
  const passEl   = document.getElementById('l-pass');
  const submitEl = document.getElementById('l-submit');
  const eyeEl    = document.getElementById('l-eye');

  userEl?.addEventListener('input', e => {
    S.loginUser = e.target.value;
    if (S.loginErr) { S.loginErr = ''; render(); setTimeout(() => document.getElementById('l-user')?.focus(), 0); }
  });
  passEl?.addEventListener('input', e => {
    S.loginPass = e.target.value;
    if (S.loginErr) { S.loginErr = ''; render(); setTimeout(() => document.getElementById('l-pass')?.focus(), 0); }
  });
  eyeEl?.addEventListener('click', () => {
    S.loginPassVisible = !S.loginPassVisible;
    S.loginPass = document.getElementById('l-pass')?.value || S.loginPass;
    render();
    setTimeout(() => {
      const p = document.getElementById('l-pass');
      if (p) { p.focus(); p.setSelectionRange(p.value.length, p.value.length); }
    }, 0);
  });

  const doLogin = () => {
    const u = (document.getElementById('l-user')?.value || S.loginUser).trim().toLowerCase();
    const p = (document.getElementById('l-pass')?.value || S.loginPass);

    if (!u && !p) { S.loginErr = 'Please enter your username and password.'; shake(); render(); return; }
    if (!u)        { S.loginErr = 'Please enter your username.';              shake(); render(); return; }
    if (!p)        { S.loginErr = 'Please enter your password.';              shake(); render(); return; }

    const match = USERS.find(usr => usr.username.toLowerCase() === u && usr.password === p);
    if (!match) {
      S.loginErr  = `"${u}" — incorrect password. Please try again.`;
      S.loginPass = '';
      shake(); render();
      setTimeout(() => document.getElementById('l-pass')?.focus(), 50);
      return;
    }

    S.loginLoading = true; render();
    setTimeout(() => {
      S.loggedInUser     = match;
      S.loginUser        = '';
      S.loginPass        = '';
      S.loginErr         = '';
      S.loginLoading     = false;
      S.loginPassVisible = false;
      S.page = 'onboarding';
      render();
      toast(`Welcome, ${match.name}! Let's build your resume.`);
    }, 700);
  };

  submitEl?.addEventListener('click', doLogin);
  passEl?.addEventListener('keydown',  e => { if (e.key === 'Enter') doLogin(); });
  userEl?.addEventListener('keydown',  e => { if (e.key === 'Enter') document.getElementById('l-pass')?.focus(); });

  // Demo quick-fill buttons
  document.querySelectorAll('.lg-demo').forEach(btn => {
    btn.addEventListener('click', () => {
      const match = USERS.find(u => u.username === btn.dataset.u);
      S.loginLoading = true; render();
      setTimeout(() => {
        S.loggedInUser = match;
        S.loginLoading = false;
        S.page = 'onboarding';
        render();
        toast(`Welcome, ${match.name}!`);
      }, 700);
    });
  });

  setTimeout(() => document.getElementById('l-user')?.focus(), 80);
}

function shake() {
  const c = document.getElementById('login-card');
  if (!c) return;
  c.classList.remove('shake');
  void c.offsetWidth; // force reflow to restart animation
  c.classList.add('shake');
}

// ── ONBOARDING EVENT HANDLERS ───────────────────────────────
function attachOb() {
  document.querySelectorAll('.ob-in').forEach(el => {
    el.addEventListener('input',  e => { S.profile = { ...S.profile, [e.target.dataset.k]: e.target.value }; });
    el.addEventListener('change', e => { S.profile = { ...S.profile, [e.target.dataset.k]: e.target.value }; });
  });

  document.getElementById('ob-next')?.addEventListener('click', () => {
    if (S.step < STEPS.length - 1) {
      S.step++;
      render();
    } else {
      // Final step — launch the app
      if (!S.messages.length) {
        const p = S.profile;
        S.messages = [{ role: 'assistant', content:
          p.fullName
            ? `Hey **${p.fullName}** — profile loaded.\n\nTargeting **${p.targetRole || 'your next role'}**${p.targetIndustry ? ` in **${p.targetIndustry}**` : ''}${p.yearsExp ? ` · **${p.yearsExp}**` : ''}.\n\nHit **⚡ Build Full Resume** to generate your resume instantly.`
            : `Hey — I'm **APEX**. I build job-winning resumes with real Word & PDF export.\n\nHit **⚡ Build Full Resume** or tell me what you need.`
        }];
      }
      S.page = 'app';
      render();
    }
  });

  document.getElementById('ob-back')?.addEventListener('click', () => { S.step--; render(); });
  document.getElementById('ob-skip')?.addEventListener('click', () => {
    if (!S.messages.length) {
      S.messages = [{ role: 'assistant', content: "Hey — I'm **APEX**. I build job-winning resumes. What do you want to tackle?" }];
    }
    S.page = 'app';
    render();
  });
}

// ── APP EVENT HANDLERS ──────────────────────────────────────
function attachApp() {
  document.getElementById('tab-chat')?.addEventListener('click',    () => { S.tab = 'chat';    render(); });
  document.getElementById('tab-preview')?.addEventListener('click', () => { S.tab = 'preview'; render(); });
  document.getElementById('edit-p')?.addEventListener('click',      () => { S.page = 'onboarding'; S.step = 0; render(); });
  document.getElementById('edit-p-top')?.addEventListener('click',  () => { S.page = 'onboarding'; S.step = 0; render(); });
  document.getElementById('view-r')?.addEventListener('click',      () => { S.tab = 'preview'; render(); });
  document.getElementById('build-now')?.addEventListener('click',   () => { S.tab = 'chat'; sendMsg(QUICK[0].prompt); });

  document.getElementById('logout-btn')?.addEventListener('click', () => {
    S.loggedInUser = null;
    S.page     = 'login';
    S.messages = [];
    S.resume   = null;
    S.score    = null;
    S.profile  = {};
    S.step     = 0;
    S.tab      = 'chat';
    render();
    toast('Signed out successfully.');
  });

  // Export handlers
  const doDocx = () => {
    if (!S.resume) return;
    const ok = downloadDocx(S.resume);
    toast(ok ? '✓ Word document downloading...' : '❌ Download failed — try the HTML option');
  };
  const doHtml = () => {
    if (!S.resume) return;
    downloadHtmlPdf(S.resume, S.profile);
    toast('✓ HTML downloaded. Open it in browser → Ctrl+P → Save as PDF');
  };

  document.getElementById('dl-docx')?.addEventListener('click', doDocx);
  document.getElementById('dl-html')?.addEventListener('click', doHtml);
  document.getElementById('exp-docx')?.addEventListener('click', doDocx);
  document.getElementById('exp-html')?.addEventListener('click', doHtml);

  // Quick action sidebar buttons
  document.querySelectorAll('.qa-act').forEach(btn =>
    btn.addEventListener('click', () => { S.tab = 'chat'; sendMsg(btn.dataset.p); })
  );

  // Chip shortcuts
  document.querySelectorAll('.chip').forEach(btn =>
    btn.addEventListener('click', () => sendMsg(btn.dataset.c))
  );

  // Chat input
  const ci = document.getElementById('ci');
  ci?.addEventListener('input', e => {
    S.input = e.target.value;
    document.getElementById('sbtn').disabled = S.loading || !e.target.value.trim();
  });
  ci?.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); }
  });
  document.getElementById('sbtn')?.addEventListener('click', () => sendMsg());

  setTimeout(() => document.getElementById('msgs')?.scrollTo({ top: 99999 }), 10);
}

// ── API CALL ────────────────────────────────────────────────
async function sendMsg(override) {
  const text = (override ?? S.input).trim();
  if (!text || S.loading) return;
  S.input = '';

  const userMsg  = { role: 'user', content: text };
  const nextMsgs = [...S.messages, userMsg];
  S.messages = nextMsgs;
  S.loading  = true;
  render();

  // Inject full profile context into the user message sent to the API
  const apiMsgs = nextMsgs.map(m => ({
    role:    m.role,
    content: m.role === 'user' && m === userMsg ? text + buildCtx(S.profile) : m.content,
  }));

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model:      'claude-sonnet-4-20250514',
        max_tokens: 2000,
        system:     SYSTEM,
        messages:   apiMsgs,
      }),
    });

    const data  = await res.json();
    const reply = data.content?.map(b => b.text || '').join('') || 'Something went wrong. Please try again.';

    S.messages = [...nextMsgs, { role: 'assistant', content: reply }];

    // Auto-detect generated resume and switch to preview
    const parsed = parseResume(reply);
    if (parsed) {
      S.resume = parsed;
      S.tab    = 'preview';
      toast('Resume generated! Switching to Preview.');
    }

    // Update score badge
    const sc = guessScore(S.messages);
    if (sc) S.score = sc;

  } catch (e) {
    S.messages = [...nextMsgs, { role: 'assistant', content: 'Connection error. Please try again.' }];
  }

  S.loading = false;
  render();
  setTimeout(() => document.getElementById('msgs')?.scrollTo({ top: 99999, behavior: 'smooth' }), 50);
}

// ── BOOT ────────────────────────────────────────────────────
render();
