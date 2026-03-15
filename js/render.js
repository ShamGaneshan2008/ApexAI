// ============================================================
// APEX.AI — Render Functions
// Pure HTML-string renderers for each page/panel
// ============================================================

// ── LOGIN PAGE ──────────────────────────────────────────────
function renderLogin() {
  const bad     = !!S.loginErr;
  const errHtml = bad ? `<div class="lg-err">
    <span class="lg-err-ico">&#9888;</span>
    <span>${esc(S.loginErr)}</span>
  </div>` : '';

  return `<div class="login-wrap">
    <div class="login-bg-grid"></div>
    <div class="login-glow g1"></div>
    <div class="login-glow g2"></div>
    <div class="login-card" id="login-card">

      <div class="lg-logo">
        <div class="lg-hex">A</div>
        <div class="lg-brand">APEX<span>.AI</span></div>
      </div>
      <div class="lg-sub">AI Resume Builder &nbsp;·&nbsp; Sign in to continue</div>

      ${errHtml}

      <div class="lg-field">
        <label class="lg-label" for="l-user">Username</label>
        <div class="lg-input-wrap">
          <input id="l-user" class="lg-input ${bad ? 'bad' : ''}"
            type="text" placeholder="Enter your username"
            value="${esc(S.loginUser)}" autocomplete="username" spellcheck="false"/>
        </div>
      </div>

      <div class="lg-field">
        <label class="lg-label" for="l-pass">Password</label>
        <div class="lg-input-wrap">
          <input id="l-pass" class="lg-input ${bad ? 'bad' : ''}"
            type="${S.loginPassVisible ? 'text' : 'password'}"
            placeholder="Enter your password"
            value="${esc(S.loginPass)}" autocomplete="current-password"/>
          <button class="lg-eye" id="l-eye" type="button" tabindex="-1">
            ${S.loginPassVisible
              ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
              : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`
            }
          </button>
        </div>
      </div>

      <button class="lg-btn" id="l-submit" ${S.loginLoading ? 'disabled' : ''}>
        ${S.loginLoading
          ? `<span style="display:inline-flex;align-items:center;gap:8px">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation:spin .7s linear infinite"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
              Signing in…
             </span>`
          : 'Sign In →'}
      </button>

      <div class="lg-divider">OR USE DEMO</div>

      <div class="lg-demos">
        <button class="lg-demo" data-u="demo" data-p="demo">
          &#128640; Demo<br/><span style="color:#8a9db5;font-weight:400">demo / demo</span>
        </button>
        <button class="lg-demo" data-u="admin" data-p="apex2024">
          &#128273; Admin<br/><span style="color:#8a9db5;font-weight:400">admin / apex2024</span>
        </button>
        <button class="lg-demo" data-u="wrench" data-p="resume123">
          &#128296; Pro<br/><span style="color:#8a9db5;font-weight:400">wrench / resume123</span>
        </button>
      </div>

      <div class="lg-hint">
        Credentials &nbsp;·&nbsp;
        <code>demo / demo</code> &nbsp;
        <code>admin / apex2024</code> &nbsp;
        <code>wrench / resume123</code>
      </div>

    </div>
  </div>`;
}

// ── ONBOARDING ──────────────────────────────────────────────
function renderOb() {
  const cur   = STEPS[S.step];
  const bars  = STEPS.map((_, i) =>
    `<div class="ob-ps ${i < S.step ? 'done' : i === S.step ? 'active' : ''}"></div>`
  ).join('');

  const fields = cur.fields.map(f => {
    const v   = S.profile[f.k] || '';
    const cls = f.full ? 'ob-full' : '';
    let inp   = '';
    if (f.type === 'select') {
      inp = `<select class="ob-in ob-sel" data-k="${f.k}">
        <option value="">Select…</option>
        ${(f.opts || []).slice(1).map(o => `<option${v === o ? ' selected' : ''}>${esc(o)}</option>`).join('')}
      </select>`;
    } else if (f.type === 'textarea') {
      inp = `<textarea class="ob-in ob-ta" data-k="${f.k}" placeholder="${esc(f.ph || '')}">${esc(v)}</textarea>`;
    } else {
      inp = `<input class="ob-in" type="${f.type || 'text'}" data-k="${f.k}" placeholder="${esc(f.ph || '')}" value="${esc(v)}"/>`;
    }
    return `<div class="${cls}">
      <label class="ob-lbl">${esc(f.l)}${f.req ? '<span style="color:var(--accent2);margin-left:2px">*</span>' : ''}</label>
      ${inp}
    </div>`;
  }).join('');

  return `<div class="ob">
    <div style="text-align:center;margin-bottom:20px">
      <div style="display:flex;align-items:center;justify-content:center;gap:9px;margin-bottom:6px">
        <div class="t-hex">A</div>
        <div style="font-weight:700;font-size:16px;color:var(--text)">
          APEX<span style="color:var(--accent)">.AI</span>
        </div>
      </div>
      <div style="font-size:11px;color:var(--text3)">Building your job-winning career profile</div>
    </div>
    <div class="ob-card">
      <div class="ob-prog">${bars}</div>
      <div class="ob-icon">${cur.icon}</div>
      <div class="ob-title">${cur.title}</div>
      <div class="ob-sub">${cur.sub}</div>
      <div class="ob-grid">${fields}</div>
      <div class="ob-nav">
        <div>${S.step > 0 ? `<button class="ob-back" id="ob-back">← Back</button>` : ''}</div>
        <div style="display:flex;align-items:center;gap:14px">
          <span class="ob-skip" id="ob-skip">Skip all →</span>
          <span class="ob-cnt">${S.step + 1} / ${STEPS.length}</span>
          <button class="ob-next" id="ob-next">
            ${S.step === STEPS.length - 1 ? 'Launch APEX →' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  </div>`;
}

// ── MAIN APP ────────────────────────────────────────────────
function renderApp() {
  const p = S.profile || {};
  const r = S.resume;
  const gradeLabel = s => !s ? '–' : s >= 90 ? 'A+' : s >= 80 ? 'A' : s >= 70 ? 'B+' : s >= 60 ? 'B' : s >= 50 ? 'C' : 'D';

  // ── Sidebar ──
  const sb = `
    <div class="sb-s">
      <div class="sb-lbl">Profile</div>
      <div class="pc">
        <div class="pc-name">${esc(p.fullName || '—')}</div>
        <div class="pc-role">${esc(p.targetRole || 'Role not set')}</div>
        <div>
          ${p.yearsExp      ? `<span class="pc-tag">${esc(p.yearsExp)}</span>` : ''}
          ${p.targetIndustry? `<span class="pc-tag">${esc(p.targetIndustry)}</span>` : ''}
          ${p.currentCompany? `<span class="pc-tag">${esc(p.currentCompany)}</span>` : ''}
          ${p.location      ? `<span class="pc-tag">${esc(p.location)}</span>` : ''}
        </div>
      </div>
      <button class="eb" id="edit-p">✏️ Edit Profile</button>
    </div>

    <div class="sb-s">
      <div class="sb-lbl">Export</div>
      <button class="xbtn w" id="dl-docx" ${!r ? 'disabled' : ''}>📄 Download .docx (Word)</button>
      <button class="xbtn p" id="dl-html" ${!r ? 'disabled' : ''}>📥 Download .html (→ PDF)</button>
      <div class="x-note">${r
        ? '✓ Ready! Word opens directly. For PDF: open .html → Ctrl+P → Save as PDF.'
        : 'Generate your resume in chat first.'}</div>
    </div>

    <div class="sb-s">
      <div class="sb-lbl">Quick Actions</div>
      ${QUICK.map(q => `<button class="qb qa-act" data-p="${esc(q.prompt)}">
        <span style="font-size:12px">${q.icon}</span>${q.label}
      </button>`).join('')}
    </div>

    ${S.score ? `<div class="sb-s">
      <div class="sb-lbl">Resume Score</div>
      <div class="score-box">
        <div class="score-row">
          <span class="score-num">${S.score}</span>
          <span class="score-grade">${gradeLabel(S.score)}</span>
        </div>
        <div class="score-bar">
          <div class="score-fill" style="width:${S.score}%"></div>
        </div>
        <div style="font-size:9px;color:var(--text3);margin-top:4px">AI analysis · out of 100</div>
      </div>
    </div>` : ''}`;

  // ── Messages ──
  const msgHtml = S.messages.map(m => `
    <div class="msg ${m.role === 'user' ? 'u' : 'a'}">
      <div class="mav">${m.role === 'assistant' ? 'AX' : 'ME'}</div>
      <div class="bub">${formatMsg(m.content)}</div>
    </div>`).join('');

  const typingHtml = S.loading
    ? `<div class="msg a">
        <div class="mav">AX</div>
        <div class="bub"><div class="typing"><div class="td"></div><div class="td"></div><div class="td"></div></div></div>
       </div>`
    : '';

  // ── Preview content ──
  let previewHtml = '';
  if (!r) {
    previewHtml = `<div class="p-empty">
      <div class="p-empty-icon">📄</div>
      <div class="p-empty-text">
        Hit <b>⚡ Build Full Resume</b> in the Chat tab — your resume appears here, ready to export.
      </div>
      <button class="p-build" id="build-now">⚡ Build My Resume</button>
    </div>`;
  } else {
    const contact = [r.email||p.email, r.phone||p.phone, r.location||p.location, r.linkedin||p.linkedin].filter(Boolean).join('  ·  ');

    const renderExp = exp => {
      if (!exp) return '';
      return exp.split(/(?=^### )/m).filter(Boolean).map(block => {
        const lines = block.trim().split('\n');
        const hdr   = lines[0].replace(/^### /, '').trim();
        const pts   = hdr.split('|').map(s => s.trim());
        const buls  = lines.slice(1).filter(l => l.trim().match(/^[-•*]/))
          .map(l => `<li class="rd-li">${esc(l.replace(/^[-•*]\s*/, '').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'))}</li>`).join('');
        return `<div class="rd-job">
          <div class="rd-jh">
            <span class="rd-jt">${esc(pts[0] || '')}</span>
            <span class="rd-jm">${esc([pts[1], pts[2]].filter(Boolean).join(' · '))}</span>
          </div>
          <ul class="rd-ul">${buls}</ul>
        </div>`;
      }).join('');
    };

    const renderSkills = s => {
      if (!s) return '';
      return s.split('\n').filter(Boolean).map(line => {
        const m = line.match(/\*\*(.+?)\*\*[:\s]+(.*)/);
        return `<div class="rd-skill">${m ? `<b>${esc(m[1])}:</b> ${esc(m[2])}` : esc(line.replace(/^[-•*]\s*/, ''))}</div>`;
      }).join('');
    };

    const rdSec = (title, content) => !content ? '' :
      `<div class="rd-sec"><div class="rd-sec-title">${title}</div>${content}</div>`;

    previewHtml = `
      <div class="exp-bar">
        <button id="exp-docx" style="background:#1a6ef5">📄 Download .docx (Word)</button>
        <button id="exp-html" style="background:#0ea5e9">📥 Download .html (→ PDF)</button>
        <span style="font-size:9px;color:var(--text3)">
          Word: opens directly &nbsp;·&nbsp; PDF: open .html → Ctrl+P → Save as PDF
        </span>
      </div>
      <div class="resume-doc">
        <div class="rd-name">${esc(r.name || p.fullName || '')}</div>
        ${(r.role || p.targetRole) ? `<div class="rd-role">${esc(r.role || p.targetRole)}</div>` : ''}
        ${contact ? `<div class="rd-contact">${esc(contact)}</div>` : ''}
        ${rdSec('Professional Summary', r.summary ? `<div class="rd-summary">${esc(r.summary)}</div>` : '')}
        ${rdSec('Experience', renderExp(r.experience))}
        ${rdSec('Skills', renderSkills(r.skills))}
        ${rdSec('Education', (r.education || '').split('\n').filter(Boolean)
            .map(l => `<div class="rd-plain">${esc(l.replace(/\*\*(.*?)\*\*/g, '$1').replace(/^[-•*]\s*/, ''))}</div>`).join(''))}
        ${rdSec('Certifications', (r.certs || '').split('\n').filter(l => l.trim())
            .map(l => `<div class="rd-plain">• ${esc(l.replace(/^[-•*]\s*/, ''))}</div>`).join(''))}
        ${rdSec('Projects', (r.projects || '').split('\n').filter(l => l.trim()).map(l => {
            const m = l.match(/\*\*(.+?)\*\*[—-]?(.*)/);
            return `<div class="rd-plain">${m ? `<b>${esc(m[1])}</b>${m[2] ? ' — ' + esc(m[2]) : ''}` : esc(l.replace(/^[-•*]\s*/, ''))}</div>`;
          }).join(''))}
      </div>`;
  }

  // ── Full page ──
  return `
    ${S.toast ? `<div class="toast">${S.toast}</div>` : ''}
    <div class="app">
      <div class="topbar">
        <div class="t-logo">
          <div class="t-hex">A</div>
          APEX<span style="color:var(--accent)">.AI</span>
        </div>
        <div class="t-tabs">
          <button class="t-tab ${S.tab === 'chat' ? 'on' : ''}" id="tab-chat">💬 Chat</button>
          <button class="t-tab ${S.tab === 'preview' ? 'on' : ''}" id="tab-preview">
            📄 Preview${r ? '<span class="dot"></span>' : ''}
          </button>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <button class="eb" id="edit-p-top" style="width:auto;padding:6px 14px">✏️ Edit Profile</button>
          ${S.loggedInUser ? `
            <div style="font-size:10px;color:var(--text3)">
              <span style="color:var(--accent);font-weight:700">${esc(S.loggedInUser.name)}</span>
              <span> · ${esc(S.loggedInUser.role)}</span>
            </div>
            <button class="logout-btn" id="logout-btn">Sign Out</button>
          ` : ''}
        </div>
      </div>

      <div class="body">
        <div class="sb">${sb}</div>
        <div class="center">
          ${S.tab === 'chat' ? `
            <div class="chat">
              <div class="chat-hdr">
                <div class="av">AX</div>
                <div>
                  <div class="ai-n">APEX AI</div>
                  <div class="ai-s">● Online · Resume Architect</div>
                </div>
                ${r ? `<button class="vbtn" id="view-r">View Resume →</button>` : ''}
              </div>
              <div class="msgs" id="msgs">${msgHtml}${typingHtml}</div>
              <div class="chat-foot">
                <div class="chips">
                  ${CHIPS.map(c => `<button class="chip" data-c="${esc(c)}">${esc(c)}</button>`).join('')}
                </div>
                <div class="irow">
                  <textarea class="ci" id="ci" rows="2"
                    placeholder="Ask APEX anything — build, critique, tailor, score... (Enter to send)"
                  >${esc(S.input)}</textarea>
                  <button class="sbtn" id="sbtn" ${S.loading || !S.input.trim() ? 'disabled' : ''}>↑</button>
                </div>
              </div>
            </div>
          ` : `<div class="preview-wrap">${previewHtml}</div>`}
        </div>
      </div>
    </div>`;
}
