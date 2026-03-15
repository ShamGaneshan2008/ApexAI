// ============================================================
// APEX.AI — Document Export
// Generates real .docx (Word) and .html (→ PDF) files and
// downloads them via data: URIs — works in every browser,
// including sandboxes (no URL.createObjectURL needed).
// ============================================================

// ── ZIP BUILDER ─────────────────────────────────────────────
// A minimal but complete ZIP implementation in pure JS.
// Used to package the .docx XML files.

function _u16(n) { return new Uint8Array([n & 0xFF, (n >> 8) & 0xFF]); }
function _u32(n) { return new Uint8Array([n & 0xFF, (n >> 8) & 0xFF, (n >> 16) & 0xFF, (n >> 24) & 0xFF]); }
function _str(s) { return new TextEncoder().encode(s); }

function _crc32(data) {
  const T = new Uint32Array(256).map((_, i) => {
    let c = i;
    for (let j = 0; j < 8; j++) c = c & 1 ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    return c;
  });
  let c = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) c = T[(c ^ data[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function zipFiles(files) {
  const now = new Date();
  const dt = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
  const tm = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
  const local = [], central = [];
  let offset = 0;

  for (const [name, content] of Object.entries(files)) {
    const nb   = _str(name);
    const data = typeof content === 'string' ? _str(content) : content;
    const crc  = _crc32(data);
    const lh = new Uint8Array([
      0x50,0x4B,0x03,0x04, 20,0, 0,0, 0,0,
      ..._u16(tm), ..._u16(dt), ..._u32(crc),
      ..._u32(data.length), ..._u32(data.length),
      ..._u16(nb.length), 0,0
    ]);
    const cd = new Uint8Array([
      0x50,0x4B,0x01,0x02, 20,0, 20,0, 0,0, 0,0,
      ..._u16(tm), ..._u16(dt), ..._u32(crc),
      ..._u32(data.length), ..._u32(data.length),
      ..._u16(nb.length), 0,0, 0,0, 0,0, 0,0,0,0, ..._u32(offset)
    ]);
    local.push(lh, nb, data);
    central.push(cd, nb);
    offset += lh.length + nb.length + data.length;
  }

  const cdSize = central.reduce((a, b) => a + b.length, 0);
  const count  = Object.keys(files).length;
  const eocd   = new Uint8Array([
    0x50,0x4B,0x05,0x06, 0,0, 0,0,
    ..._u16(count), ..._u16(count), ..._u32(cdSize), ..._u32(offset), 0,0
  ]);

  const all = [...local, ...central, eocd];
  const out = new Uint8Array(all.reduce((a, b) => a + b.length, 0));
  let pos = 0;
  for (const p of all) { out.set(p, pos); pos += p.length; }
  return out;
}

// ── DOCX XML BUILDER ────────────────────────────────────────
function buildDocxFiles(r) {
  let body = '';

  const para = (txt, { bold=false, sz=20, color='333333', after=100, before=0, align='left' } = {}) =>
    `<w:p><w:pPr><w:jc w:val="${align}"/><w:spacing w:before="${before}" w:after="${after}"/></w:pPr>
    <w:r><w:rPr>${bold ? '<w:b/><w:bCs/>' : ''}<w:color w:val="${color}"/>
    <w:sz w:val="${sz}"/><w:szCs w:val="${sz}"/><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr>
    <w:t xml:space="preserve">${esc(txt)}</w:t></w:r></w:p>`;

  const secHdr = title =>
    `<w:p><w:pPr><w:spacing w:before="200" w:after="60"/>
    <w:pBdr><w:bottom w:val="single" w:sz="6" w:space="1" w:color="1A6EF5"/></w:pBdr></w:pPr>
    <w:r><w:rPr><w:b/><w:bCs/><w:caps/><w:color w:val="1A6EF5"/>
    <w:sz w:val="18"/><w:szCs w:val="18"/><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr>
    <w:t>${esc(title)}</w:t></w:r></w:p>`;

  const bullet = txt =>
    `<w:p><w:pPr><w:ind w:left="360" w:hanging="180"/><w:spacing w:after="40"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="19"/><w:szCs w:val="19"/><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr>
    <w:t xml:space="preserve">\u2022 ${esc(txt.replace(/^[-\u2022*]\s*/, ''))}</w:t></w:r></w:p>`;

  // Header: Name
  body += `<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="60"/></w:pPr>
    <w:r><w:rPr><w:b/><w:bCs/><w:sz w:val="44"/><w:szCs w:val="44"/>
    <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr>
    <w:t>${esc(r.name || '')}</w:t></w:r></w:p>`;

  if (r.role) body += `<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="60"/></w:pPr>
    <w:r><w:rPr><w:color w:val="1A6EF5"/><w:sz w:val="22"/><w:szCs w:val="22"/>
    <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr>
    <w:t>${esc(r.role)}</w:t></w:r></w:p>`;

  const contact = [r.email, r.phone, r.location, r.linkedin].filter(Boolean).join('  \u00B7  ');
  if (contact) body += `<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="160"/>
    <w:pBdr><w:bottom w:val="single" w:sz="6" w:space="1" w:color="1A6EF5"/></w:pBdr></w:pPr>
    <w:r><w:rPr><w:color w:val="666666"/><w:sz w:val="17"/><w:szCs w:val="17"/>
    <w:rFonts w:ascii="Courier New" w:hAnsi="Courier New"/></w:rPr>
    <w:t>${esc(contact)}</w:t></w:r></w:p>`;

  // Summary
  if (r.summary) {
    body += secHdr('Professional Summary');
    body += para(r.summary, { sz: 20, after: 80 });
  }

  // Experience
  if (r.experience) {
    body += secHdr('Experience');
    r.experience.split(/(?=^### )/m).filter(Boolean).forEach(block => {
      const lines = block.trim().split('\n');
      const hdr   = lines[0].replace(/^### /, '').trim();
      const parts = hdr.split('|').map(s => s.trim());
      body += `<w:p><w:pPr><w:spacing w:before="140" w:after="40"/></w:pPr>
        <w:r><w:rPr><w:b/><w:bCs/><w:sz w:val="20"/><w:szCs w:val="20"/>
        <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr>
        <w:t xml:space="preserve">${esc(parts[0] || '')}</w:t></w:r>
        <w:r><w:rPr><w:sz w:val="20"/><w:szCs w:val="20"/>
        <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr>
        <w:t xml:space="preserve">${parts[1] ? ' | ' + esc(parts[1]) : ''}${parts[2] ? '  ' + esc(parts[2]) : ''}</w:t></w:r></w:p>`;
      lines.slice(1).filter(l => l.trim().match(/^[-\u2022*]/)).forEach(l => body += bullet(l));
    });
  }

  // Skills
  if (r.skills) {
    body += secHdr('Skills');
    r.skills.split('\n').filter(Boolean).forEach(line => {
      const m = line.match(/\*\*(.+?)\*\*[:\s]+(.*)/);
      if (m) body += `<w:p><w:pPr><w:spacing w:after="40"/></w:pPr>
        <w:r><w:rPr><w:b/><w:bCs/><w:sz w:val="19"/><w:szCs w:val="19"/>
        <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr>
        <w:t xml:space="preserve">${esc(m[1])}: </w:t></w:r>
        <w:r><w:rPr><w:sz w:val="19"/><w:szCs w:val="19"/>
        <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr>
        <w:t>${esc(m[2])}</w:t></w:r></w:p>`;
    });
  }

  // Education
  if (r.education) {
    body += secHdr('Education');
    r.education.split('\n').filter(Boolean).forEach(l =>
      body += para(l.replace(/\*\*(.*?)\*\*/g, '$1').replace(/^[-\u2022*]\s*/, ''), { sz: 19, after: 40 })
    );
  }

  // Certifications
  if (r.certs) {
    body += secHdr('Certifications');
    r.certs.split('\n').filter(l => l.trim()).forEach(l => body += bullet(l));
  }

  // Projects
  if (r.projects) {
    body += secHdr('Projects');
    r.projects.split('\n').filter(l => l.trim()).forEach(line => {
      const m = line.match(/\*\*(.+?)\*\*[—-]?(.*)/);
      if (m) body += `<w:p><w:pPr><w:spacing w:after="40"/></w:pPr>
        <w:r><w:rPr><w:b/><w:bCs/><w:sz w:val="19"/><w:szCs w:val="19"/>
        <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr>
        <w:t xml:space="preserve">${esc(m[1])} </w:t></w:r>
        <w:r><w:rPr><w:sz w:val="19"/><w:szCs w:val="19"/>
        <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr>
        <w:t>${esc(m[2])}</w:t></w:r></w:p>`;
      else body += bullet(line);
    });
  }

  const docXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:body>${body}
<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1080" w:right="1080" w:bottom="1080" w:left="1080"/></w:sectPr>
</w:body></w:document>`;

  return {
    '[Content_Types].xml': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>`,
    '_rels/.rels': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`,
    'word/document.xml': docXml,
    'word/styles.xml': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:sz w:val="20"/><w:szCs w:val="20"/><w:lang w:val="en-US"/></w:rPr></w:rPrDefault></w:docDefaults></w:styles>`,
    'word/_rels/document.xml.rels': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`,
  };
}

// ── DOWNLOAD HELPERS ────────────────────────────────────────

/** Download resume as a properly formatted Word .docx file */
function downloadDocx(resume) {
  try {
    const files = buildDocxFiles(resume);
    const zip   = zipFiles(files);
    let bin = '';
    for (let i = 0; i < zip.length; i++) bin += String.fromCharCode(zip[i]);
    const b64 = btoa(bin);
    const a   = document.createElement('a');
    a.href     = 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,' + b64;
    a.download = (resume.name || 'Resume').replace(/\s+/g, '_') + '_Resume.docx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return true;
  } catch (e) {
    console.error('DOCX generation failed:', e);
    return false;
  }
}

/** Download resume as a print-ready HTML file (open → Ctrl+P → Save as PDF) */
function downloadHtmlPdf(resume, profile) {
  const p = profile || {};
  const contact = [resume.email||p.email, resume.phone||p.phone, resume.location||p.location, resume.linkedin||p.linkedin].filter(Boolean).join('  ·  ');

  const renderExp = exp => {
    if (!exp) return '';
    return exp.split(/(?=^### )/m).filter(Boolean).map(block => {
      const lines = block.trim().split('\n');
      const hdr   = lines[0].replace(/^### /, '').trim();
      const pts   = hdr.split('|').map(s => s.trim());
      const buls  = lines.slice(1).filter(l => l.trim().match(/^[-•*]/))
        .map(l => `<li>${esc(l.replace(/^[-•*]\s*/, '').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'))}</li>`).join('');
      return `<div style="margin-bottom:13px">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px">
          <b style="font-size:11px">${esc(pts[0] || '')}</b>
          <span style="font-size:9px;color:#666">${esc([pts[1], pts[2]].filter(Boolean).join(' · '))}</span>
        </div>
        <ul style="padding-left:14px;margin:0">${buls}</ul>
      </div>`;
    }).join('');
  };

  const renderSkills = s => {
    if (!s) return '';
    return s.split('\n').filter(Boolean).map(line => {
      const m = line.match(/\*\*(.+?)\*\*[:\s]+(.*)/);
      return `<div style="font-size:10px;line-height:1.7;margin-bottom:2px">${m ? `<b>${esc(m[1])}:</b> ${esc(m[2])}` : esc(line.replace(/^[-•*]\s*/, ''))}</div>`;
    }).join('');
  };

  const sec = (title, content) => !content ? '' :
    `<div style="margin-top:17px">
      <div style="font-size:8px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#1a6ef5;border-bottom:1.5px solid #1a6ef5;padding-bottom:3px;margin-bottom:8px">${title}</div>
      ${content}
    </div>`;

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
<title>${esc(resume.name || 'Resume')} — Resume</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Arial,sans-serif;font-size:11px;color:#111;background:#fff;padding:48px 52px;max-width:820px;margin:0 auto}
  h1{font-family:Georgia,serif;font-size:26px;font-weight:700;letter-spacing:-.02em;color:#111;margin-bottom:4px}
  ul li{font-size:10px;line-height:1.65;margin-bottom:2px}
  @media print{body{padding:0;max-width:none}@page{margin:.6in;size:letter}}
</style>
</head><body>
<h1>${esc(resume.name || p.fullName || '')}</h1>
${(resume.role || p.targetRole) ? `<div style="font-size:12px;color:#1a6ef5;font-weight:700;margin-bottom:5px">${esc(resume.role || p.targetRole)}</div>` : ''}
${contact ? `<div style="font-family:'Courier New',monospace;font-size:9px;color:#666;padding-bottom:12px;border-bottom:2px solid #1a6ef5;margin-bottom:4px">${esc(contact)}</div>` : ''}
${sec('Professional Summary', resume.summary ? `<div style="font-size:10.5px;line-height:1.75;color:#333">${esc(resume.summary)}</div>` : '')}
${sec('Experience', renderExp(resume.experience))}
${sec('Skills', renderSkills(resume.skills))}
${sec('Education', (resume.education || '').split('\n').filter(Boolean).map(l => `<div style="font-size:10px;line-height:1.65;margin-bottom:3px">${esc(l.replace(/\*\*(.*?)\*\*/g, '$1').replace(/^[-•*]\s*/, ''))}</div>`).join(''))}
${sec('Certifications', (resume.certs || '').split('\n').filter(l => l.trim()).map(l => `<div style="font-size:10px;margin-bottom:2px">• ${esc(l.replace(/^[-•*]\s*/, ''))}</div>`).join(''))}
${sec('Projects', (resume.projects || '').split('\n').filter(l => l.trim()).map(l => {
  const m = l.match(/\*\*(.+?)\*\*[—-]?(.*)/);
  return `<div style="font-size:10px;margin-bottom:3px">${m ? `<b>${esc(m[1])}</b>${m[2] ? ' — ' + esc(m[2]) : ''}` : esc(l.replace(/^[-•*]\s*/, ''))}</div>`;
}).join(''))}
</body></html>`;

  const b64 = btoa(unescape(encodeURIComponent(html)));
  const a   = document.createElement('a');
  a.href     = 'data:text/html;base64,' + b64;
  a.download = (resume.name || 'Resume').replace(/\s+/g, '_') + '_Resume.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
