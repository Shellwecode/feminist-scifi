/* Clicking a writer opens their file, typeset, instead of downloading it.
 * The markdown in authors-raw/ is the source; the sheet is a reading of it,
 * and the download is one action in its footer.
 *
 * ANIMATION STORYBOARD
 *    0ms   the row is clicked; the link's own navigation is cancelled
 *    0ms   paper scrim fades to .82, the sheet rises 10px
 *  420ms   both settle (cubic-bezier(.22, 1, .36, 1))
 *    esc   closes; focus returns to the row it came from
 */
(() => {
  'use strict';
  const page = document.getElementById('page');
  if (!page) return;
  const stage = document.createElement('div');
  document.body.appendChild(stage);
  const cache = new Map();

  /* ---------- the file, parsed ---------- */
  const esc = value => String(value).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // The .md files carry typewriter quotes; the page is meant to read as print.
  function curl(value) {
    return value
      .replace(/(^|[\s([{*_—–\/])"/g, '$1“')
      .replace(/"/g, '”')
      .replace(/(\w)'(\w)/g, '$1’$2')
      .replace(/(^|\s)'/g, '$1‘')
      .replace(/'/g, '’');
  }
  // Titles carry nested emphasis (**x *y* (z)**), so drop every marker rather
  // than try to pair them: the whole title is set in one style anyway.
  const plain = value => curl(value).replace(/\*/g, '').replace(/\s+/g, ' ').trim();

  /* ---------- non-Latin runs ----------
   * Every face this modal loads is Latin-only: Meta-old-French, Cotham Sans,
   * Instrument Serif and Instrument Sans have no CJK, kana, Hangul, Arabic,
   * Hebrew or Bengali between them. Left alone the browser picks a fallback per
   * machine and applies whatever style the surrounding run asked for — which is
   * how a work title ends up with slanted Hebrew glued to its romanisation.
   * So each non-Latin run is declared: its own script, stack, size and bidi island.
   */
  const SCRIPT_TESTS = [
    ['arab', /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/],
    ['hebr', /[\u0590-\u05FF\uFB1D-\uFB4F]/],
    ['hang', /[\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uAC00-\uD7FF]/],
    ['jpan', /[\u3040-\u309F\u30A0-\u30FF\u31F0-\u31FF\uFF66-\uFF9F]/],
    ['hani', /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]/],
    ['beng', /[\u0980-\u09FF]/]
  ];
  // 『』「」《》 belong to whichever CJK run they stand beside, never to the Latin.
  const CJK_PUNCT = /[\u3000-\u303F\uFF01-\uFF65]/;
  const CJK_KEYS = new Set(['hani', 'jpan', 'hang']);
  const LANG = { arab: 'ar', hebr: 'he', hang: 'ko', jpan: 'ja', hani: 'zh', beng: 'bn' };
  const RTL = new Set(['arab', 'hebr']);

  const scriptOf = ch => SCRIPT_TESTS.find(([, re]) => re.test(ch))?.[0] || null;

  function segment(text) {
    // Pass 1 — classify every character. Neutrals (spaces, ASCII, digits) are null.
    const runs = [];
    for (const ch of text) {
      const key = scriptOf(ch);
      const weak = key === null && CJK_PUNCT.test(ch);
      const last = runs[runs.length - 1];
      if (last && last.key === key && last.weak === weak) last.text += ch;
      else runs.push({ key, weak, text: ch });
    }
    // Pass 2 — a neutral run sandwiched by one script belongs to it, so an Arabic
    // phrase stays one run instead of shattering at every word space.
    for (let i = 1; i < runs.length - 1; i += 1) {
      const [before, run, after] = [runs[i - 1], runs[i], runs[i + 1]];
      if (run.key !== null) continue;
      if (run.weak && CJK_KEYS.has(before.key)) { run.key = before.key; continue; }
      if (run.weak && CJK_KEYS.has(after.key)) { run.key = after.key; continue; }
      if (run.weak) { run.key = 'hani'; continue; }
      if (before.key && before.key === after.key && !/\n/.test(run.text)) run.key = before.key;
    }
    // A leading or trailing bracket with no Latin on the far side still reads as CJK.
    [runs[0], runs[runs.length - 1]].forEach((run, at) => {
      if (!run || run.key !== null || !run.weak) return;
      const neighbour = at === 0 ? runs[1] : runs[runs.length - 2];
      run.key = CJK_KEYS.has(neighbour?.key) ? neighbour.key : 'hani';
    });
    // Pass 3 — Japanese writes kanji and kana in one breath (大原まり子), so a
    // string that shows any kana is Japanese throughout. Without this the name
    // splits into three runs and picks up a boundary space inside itself.
    if (runs.some(run => run.key === 'jpan')) {
      runs.forEach(run => { if (run.key === 'hani') run.key = 'jpan'; });
    }
    // Pass 4 — glue neighbours that now agree.
    return runs.reduce((acc, run) => {
      const last = acc[acc.length - 1];
      if (last && last.key === run.key) last.text += run.text;
      else acc.push({ key: run.key, text: run.text });
      return acc;
    }, []);
  }

  // Runs on already-escaped HTML, so it steps over tags and never touches an attribute.
  function markScripts(html) {
    if (!/[^\u0000-\u024F\u2000-\u206F]/.test(html)) return html;   // pure Latin, nothing to do
    return html.split(/(<[^>]+>)/).map(piece => {
      if (piece.startsWith('<')) return piece;
      return segment(piece).map(run => run.key
        ? `<span class="sheet-x" data-script="${run.key}" lang="${LANG[run.key]}"${RTL.has(run.key) ? ' dir="rtl"' : ''}>${run.text}</span>`
        : run.text).join('');
    }).join('');
  }

  function inline(value) {
    let out = esc(curl(value));
    out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
    out = out.replace(/\*\*\*([^*]+?)\*\*\*/g, '<em><strong>$1</strong></em>');
    out = out.replace(/\*\*((?:[^*]|\*(?!\*))+?)\*\*/g, '<strong>$1</strong>');
    out = out.replace(/\*([^*]+?)\*/g, '<em>$1</em>');
    out = out.replace(/(https?:\/\/[^\s<]+)/g, raw => {
      const tail = raw.match(/[.,;:)]*$/)?.[0] || '';
      const href = raw.slice(0, raw.length - tail.length);
      return `<a href="${href}" target="_blank" rel="noreferrer">${href.replace(/^https?:\/\//, '')}</a>${tail}`;
    });
    return markScripts(out);
  }
  const plainHTML = value => markScripts(esc(plain(value)));

  // A section's lines → blocks. A top-level bullet owns the indented lines under it.
  function blocks(lines) {
    const out = [];
    let para = [];
    const flush = () => { if (para.length) { out.push({ kind: 'para', text: para.join(' ') }); para = []; } };
    lines.forEach(line => {
      if (!line.trim()) { flush(); return; }
      const bullet = line.match(/^(\s*)[-*]\s+(.+)$/);
      if (bullet) {
        const indent = bullet[1].replace(/\t/g, '    ').length;
        const last = out[out.length - 1];
        if (indent >= 4 && last && last.kind === 'item') { last.notes.push(bullet[2].trim()); return; }
        flush();
        out.push({ kind: 'item', text: bullet[2].trim(), notes: [] });
        return;
      }
      para.push(line.trim());
    });
    flush();
    return out;
  }

  function parse(markdown) {
    const lines = markdown.replace(/\r/g, '').split('\n');
    const doc = { title: '', sections: [] };
    let current = null;
    lines.forEach(line => {
      const top = line.match(/^#\s+(.+)$/);
      const head = line.match(/^##\s+(.+)$/);
      if (top) { doc.title = top[1].trim(); return; }
      if (head) { current = { key: head[1].trim().toLowerCase(), lines: [] }; doc.sections.push(current); return; }
      if (current) current.lines.push(line);
    });
    return doc;
  }

  const find = (doc, key) => doc.sections.find(s => s.key === key)?.lines.join(' ').trim();

  /* ---------- Shellie's labels and her order ---------- */
  const LABELS = {
    'brief bio': 'Brief Bio',
    'primary writing language': 'Writing Language',
    'monumental works': 'Monumental Work',
    'themes': 'Themes',
    'country / region': 'Country / Region',
    'name': 'Name',
    'influences': 'Influences',
    'influenced': 'Influenced',
    'translation history': 'Translation History',
    'notable recognition': 'Notable Recognition',
    'sources': 'Sources'
  };
  const ORDER = ['brief bio', 'primary writing language', 'monumental works', 'themes'];
  const HEADER_ONLY = new Set(['years active']);   // the header already says it
  const titleCase = key => key.replace(/(^|[\s/])([a-z])/g, (m, a, b) => a + b.toUpperCase());

  /* ---------- rendering ---------- */
  function renderWork(block) {
    const notes = block.notes.map(note => {
      const form = note.match(/^form:\s*(.+)$/i);
      return form
        ? `<p class="sheet-form">${plainHTML(form[1])}</p>`
        : `<p class="sheet-gloss">${inline(note)}</p>`;
    }).join('');
    return `<div class="sheet-work">
      <p class="sheet-work-title">${plainHTML(block.text)}</p>
      ${notes ? `<div class="sheet-work-notes">${notes}</div>` : ''}
    </div>`;
  }

  function renderBlock(block, isWorks) {
    if (isWorks && block.kind === 'item') return renderWork(block);
    const notes = (block.notes || []).map(note => `<p class="sheet-gloss">${inline(note)}</p>`).join('');
    return `<div><p class="sheet-text">${inline(block.text)}</p>${notes ? `<div class="sheet-work-notes">${notes}</div>` : ''}</div>`;
  }

  function sections(doc) {
    const keys = doc.sections.map(s => s.key)
      .filter(key => !HEADER_ONLY.has(key))
      .filter(key => key !== 'name' || find(doc, 'name') !== doc.title);
    const ordered = [...ORDER.filter(k => keys.includes(k)), ...keys.filter(k => !ORDER.includes(k))];

    return ordered.map(key => {
      const section = doc.sections.find(s => s.key === key);
      const list = blocks(section.lines);
      if (!list.length) return '';
      const values = `<div class="sheet-values">${list.map(b => renderBlock(b, key === 'monumental works')).join('')}</div>`;
      return `<section class="sheet-row"><h3 class="sheet-label">${esc(LABELS[key] || titleCase(key))}</h3>${values}</section>`;
    }).join('');
  }

  function identity(doc, author) {
    const years = find(doc, 'years active');
    const img = author.portrait
      ? `<span class="sheet-portrait"><img src="${author.portrait}" alt="" width="75" height="71" decoding="async"></span>`
      : '';
    return `<div class="sheet-id">${img}<div class="sheet-id-text">
      <h2 class="sheet-name" id="sheet-title">${plainHTML(doc.title || author.name)}</h2>
      ${years ? `<p class="sheet-years">${esc(years)}</p>` : ''}
    </div></div>`;
  }

  const DOWNLOAD_ICON = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 1v6.5M3.4 5.2 6 7.8l2.6-2.6M1.5 9.6v1H10.5v-1"/></svg>`;

  function footerLine(author, bytes) {
    const href = `../authors-raw/${encodeURIComponent(author.file)}`;
    const size = bytes ? ` · ${Math.round(bytes / 1024 * 10) / 10} KB` : '';
    return `<div class="sheet-foot-line">
      <span class="sheet-file">${esc(author.file)}${size}</span>
      <span class="sheet-foot-rule" aria-hidden="true"></span>
      <a class="sheet-download" href="${href}" download="${esc(author.file)}">${DOWNLOAD_ICON}<span>Download</span></a>
    </div>`;
  }

  /* ---------- open / close ---------- */
  let openFile = null;
  let returnTo = null;
  let token = 0;   // one render wins; a second open() cancels the first mid-fetch

  function authorOf(file) {
    const record = window.WRITERS_DATA.AUTHORS.find(a => a.file === file);
    const row = page.querySelector(`.mbt-row[data-file="${CSS.escape(file)}"]`);
    const img = row?.querySelector('.mbt-media img');
    return { file, name: record?.name || file.replace(/\.md$/, ''), portrait: img?.getAttribute('src') || null };
  }

  function close({ restoreFocus = true } = {}) {
    token += 1;
    stage.innerHTML = '';
    openFile = null;
    if (restoreFocus && returnTo?.isConnected) returnTo.focus({ preventScroll: true });
    returnTo = null;
  }

  async function open(file, { focusRow } = {}) {
    const author = authorOf(file);
    const href = `../authors-raw/${encodeURIComponent(file)}`;
    if (focusRow !== undefined) returnTo = focusRow;
    stage.innerHTML = '';
    openFile = file;
    const mine = ++token;

    if (!cache.has(file)) {
      stage.innerHTML = '<div class="sheet-scrim"></div>';
      try {
        const response = await fetch(href);
        if (!response.ok) throw new Error(String(response.status));
        const text = await response.text();
        cache.set(file, { doc: parse(text), bytes: new TextEncoder().encode(text).length });
      } catch {
        // The row is still a real link, so hand the file over rather than fail silently.
        if (mine === token) { close({ restoreFocus: false }); window.open(href, '_blank', 'noreferrer'); }
        return;
      }
      if (mine !== token) return;
      stage.innerHTML = '';
    }
    if (mine !== token) return;

    const { doc, bytes } = cache.get(file);
    stage.innerHTML = `
      <div class="sheet-scrim" data-dismiss></div>
      <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title" tabindex="-1">
        <header class="sheet-head">
          ${identity(doc, author)}
          <button class="sheet-close" type="button" data-dismiss aria-label="Close">\u2715</button>
        </header>
        <div class="sheet-body">${sections(doc)}</div>
        <footer class="sheet-foot">${footerLine(author, bytes)}</footer>
      </div>`;
    stage.querySelector('.sheet').focus({ preventScroll: true });
  }

  /* ---------- wiring ---------- */
  // Capture, so the row's own navigation never fires.
  document.addEventListener('click', event => {
    const row = event.target.closest?.('.mbt-row');
    if (row && !event.metaKey && !event.ctrlKey && !event.shiftKey && event.button === 0) {
      event.preventDefault();
      event.stopPropagation();
      open(row.dataset.file, { focusRow: row });
      return;
    }
    if (event.target.closest?.('[data-dismiss]')) { event.preventDefault(); close(); }
  }, true);

  // Capture, so Escape closes the modal before the search panel sees it.
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && openFile) { event.stopPropagation(); close(); return; }
    if (event.key !== 'Tab' || !openFile) return;
    // The sheet is modal, so Tab stays inside it.
    const sheet = stage.querySelector('.sheet');
    if (!sheet) return;
    const focusable = [...sheet.querySelectorAll('a[href], button, input, [tabindex]:not([tabindex="-1"])')]
      .filter(el => el.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === sheet)) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  }, true);

})();
