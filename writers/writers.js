/* The writers index — bookpile opens a search line and a marginal filter.
 * Typography and margin follow the Paper frames "Experiment · V1 marginalia"
 * and "Experiment · V1 · collapsed".
 *
 * ANIMATION STORYBOARD (values live in DialKit)
 *    0ms   click the pile / ⌘K: the leaning book stands up
 *    0ms   search line springs 0 → 481px out of the pile's right edge
 *   80ms   margin note follows (panel.marginLag); the index narrows on the same spring
 *  550ms   both settle (panel.spring: visualDuration .55, bounce 0)
 *   60ms   deliberate hover: warm wash, name shifts 3px, neighbours fade to .72
 *  400ms   portrait opens between the name's two parts (portrait.spring)
 *    esc   everything reverses from its current position and velocity
 */
(() => {
  'use strict';
  const { AUTHORS, THEMES } = window.WRITERS_DATA;
  // Portrait files are named for their manifest stem, so the path is derived.
  // Every writer in the manifest but the few still without an image.
  const HAS_PORTRAIT = new Set([
    'abdel-aziz-basma.md', 'al-maria-sophia.md', 'atwood-margaret.md', 'bazterrica-agustina.md',
    'beukes-lauren.md', 'brackett-leigh.md', 'bujold-lois-mcmaster.md', 'burdekin-katharine.md',
    'butler-octavia.md', 'cadigan-pat.md', 'carter-angela.md', 'chabria-priya-sarukkai.md',
    'chambers-becky.md', 'chapela-andrea.md', 'chaviano-daina.md', 'cherryh-c-j.md',
    'chi-hui.md', 'chung-bora.md', 'damian-miravete-gabriela.md', 'djuna.md',
    'due-tananarive.md', 'fideli-finisia.md', 'gilman-charlotte-perkins.md', 'gorodischer-angelica.md',
    'griffith-nicola.md', 'hao-jingfang.md', 'hareven-gail.md', 'haushofer-marlen.md',
    'hopkinson-nalo.md', 'hossain-rokeya.md', 'jemisin-n-k.md', 'jones-gwyneth.md',
    'kahiu-wanuri.md', 'kim-bo-young.md', 'kim-choyeop.md', 'kress-nancy.md',
    'kurahashi-yumiko.md', 'lanagan-margo.md', 'le-guin-ursula.md', 'leckie-ann.md',
    'lee-tanith.md', 'lessing-doris.md', 'mccaffrey-anne.md', 'mcintyre-vonda.md',
    'mira-de-echeverria-teresa.md', 'mitchison-naomi.md', 'moore-c-l.md', 'norton-andre.md',
    'ogawa-yoko.md', 'okorafor-nnedi.md', 'onwualu-chinelo.md', 'oyeyemi-helen.md',
    'padmanabhan-manjula.md', 'roanhorse-rebecca.md', 'russ-joanna.md', 'sansour-larissa.md',
    'schweblin-samanta.md', 'serpell-namwali.md', 'shah-bina.md', 'shawl-nisi.md',
    'shelley-mary.md', 'singh-vandana.md', 'sinisalo-johanna.md', 'suzuki-izumi.md',
    'tang-fei.md', 'tidbeck-karin.md', 'tiptree-james-jr.md', 'tokarczuk-olga.md',
    'tolstaya-tatiana.md', 'vonarburg-elisabeth.md', 'wilhelm-kate.md', 'willis-connie.md',
    'wittig-monique.md', 'wolf-christa.md', 'xia-jia.md'
  ]);
  const portraitOf = file => HAS_PORTRAIT.has(file) ? `media/${file.replace(/\.md$/, '')}.png` : null;

  // The portrait opens between the two halves of the name; a single-word
  // name (Djuna) has no between, so it simply follows the name. Splitting on the last
  // space alone broke "Ursula K. Le Guin" and cut inside Tiptree's parenthetical.
  const PARTICLES = new Set(['Le', 'La', 'de', 'De', 'van', 'Van', 'von', 'Von', 'del', 'Del', 'da', 'Da']);
  function splitName(name) {
    const paren = name.indexOf(' (');
    if (paren > 0) return [name.slice(0, paren), name.slice(paren + 1)];
    const parts = name.split(' ');
    if (parts.length < 2) return [name, ''];
    let i = parts.length - 1;
    if (i > 1 && PARTICLES.has(parts[i - 1])) i -= 1;
    return [parts.slice(0, i).join(' '), parts.slice(i).join(' ')];
  }
  // Paper margin, in Shellie's order and wording.
  const REGION_ORDER = [
    ['Anglophone traditions', 'Anglophone'],
    ['East Asia', 'East Asia'],
    ['Africa & diaspora', 'Africa & Diaspora'],
    ['South Asia', 'South Asia'],
    ['Europe, non-English', 'Europe, non-English'],
    ['Indigenous Americas', 'Indigenous Americas'],
    ['Latin America', 'Latin America'],
    ['MENA', 'MENA']
  ];
  const PERIODS = [
    ['before-1960', 'Before 1960', year => year < 1960],
    ['1960-1989', '1960\u20131989', year => year >= 1960 && year < 1990],
    ['1990-2009', '1990\u20132009', year => year >= 1990 && year < 2010],
    ['2010-now', '2010\u2013now', year => year >= 2010 && year < 9999]
  ];
  const CONCERNS_PRIMARY = [
    ['bodies', 'Bodies', ['biology', 'embodiment']],
    ['language', 'Language', ['language']],
    ['time', 'Time', ['time']],
    ['colonialism', 'Colonialism', ['colonialism']],
    ['ecology', 'Ecology', ['ecology']],
    ['family', 'Family / Kinship', ['family/kinship']],
    ['consciousness', 'Consciousness', ['AI/machine-consciousness']],
    ['space-opera', 'Space Opera', ['space-opera']],
    ['utopia', 'Utopia', ['utopia']]
  ];
  const covered = new Set(CONCERNS_PRIMARY.flatMap(([, , themes]) => themes));
  const CONCERNS_MORE = THEMES.filter(theme => !covered.has(theme)).map(theme => [theme, theme.replaceAll('-', ' ').replaceAll('/', ' / ').replace(/^./, c => c.toUpperCase()), [theme]]);
  const CONCERNS = [...CONCERNS_PRIMARY, ...CONCERNS_MORE];

  const esc = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
  const norm = value => String(value).normalize('NFD').replace(/[̀-ͯ]/g, '').toLocaleLowerCase();
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const compact = window.matchMedia('(max-width: 900px)');
  const page = document.getElementById('page');
  const state = { open: false, search: '', region: '', period: '', concern: '' };
  const records = AUTHORS.map((author, index) => ({
    ...author,
    folio: String(index + 1).padStart(3, '0'),
    shortRegion: (REGION_ORDER.find(([key]) => key === author.regionGroup) || [, author.regionGroup])[1],
    regionLabel: author.regionGroup === 'Africa & diaspora' ? 'Africa & Diaspora' : author.regionGroup,
    haystack: norm([author.name, author.language, author.languageGroup, author.region, author.regionGroup, author.years, ...author.themes].join(' '))
  })).sort((a, b) => a.name.localeCompare(b.name));

  const PILE = `<svg viewBox="0 2.7 20.4 20.4" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M5.61 7.034C5.44 11.03 5.526 15.024 5.61 18.85"/>
    <path d="M9.01 6.95C8.926 10.944 8.926 14.854 9.01 18.85"/>
    <path class="mbt-pile-lean" d="M11.9 7.46C13.26 11.114 14.536 14.77 15.726 18.424"/>
  </svg>`;

  page.innerHTML = `
    <header class="mbt-toolbar">
      <button class="mbt-pile" type="button" aria-expanded="false" aria-controls="archive-search-line archive-margin" aria-label="Search and filter the archive">${PILE}</button>
      <span class="mbt-pile-hint" aria-hidden="true">Search &amp; filter</span>
      <label class="mbt-search" id="archive-search-line">
        <span class="mbt-sr-only">Search writer, place, theme</span>
        <input id="archive-search" type="search" autocomplete="off" spellcheck="false" placeholder="Search writer, place, theme" aria-controls="archive-rows" tabindex="-1">
        <span class="mbt-shortcut" aria-hidden="true">⌘K</span>
      </label>
    </header>
    <div class="mbt-layout">
      <section class="mbt-results" aria-label="Writers">
        <p class="mbt-sr-only" role="status" aria-live="polite" aria-atomic="true" data-result-count></p>
        <ol class="mbt-rows" id="archive-rows"></ol>
      </section>
      <div class="mbt-margin-slot" id="archive-margin">
        <aside class="mbt-margin" aria-label="Filter the archive">
          <section class="mbt-filter-group" aria-labelledby="region-heading">
            <h2 id="region-heading">Filed Under</h2>
            ${REGION_ORDER.map(([key, label]) => filterButton('region', key, label, records.filter(author => author.regionGroup === key).length)).join('')}
          </section>
          <section class="mbt-filter-group" aria-labelledby="period-heading">
            <h2 id="period-heading">First Active</h2>
            ${PERIODS.map(([value, label]) => filterButton('period', value, label)).join('')}
          </section>
          <section class="mbt-filter-group" aria-labelledby="concern-heading">
            <h2 id="concern-heading">Concerns</h2>
            ${CONCERNS_PRIMARY.map(([value, label]) => filterButton('concern', value, label)).join('')}
            <details class="mbt-more"><summary>more concerns</summary>
              ${CONCERNS_MORE.map(([value, label]) => filterButton('concern', value, label)).join('')}
            </details>
          </section>
          <button class="mbt-clear" type="button" data-clear hidden>Clear filters</button>
        </aside>
      </div>
    </div>`;

  function filterButton(group, value, label, count) {
    return `<button type="button" class="mbt-filter-option" data-group="${group}" data-value="${esc(value)}" aria-pressed="false"><span class="filter-label">${esc(label)}</span>${count === undefined ? '' : `<span class="filter-count">${count}</span>`}</button>`;
  }
  const toolbar = page.querySelector('.mbt-toolbar');
  const pile = page.querySelector('.mbt-pile');
  const searchLine = page.querySelector('.mbt-search');
  const searchEl = page.querySelector('#archive-search');
  const rowsEl = page.querySelector('.mbt-rows');
  const marginSlot = page.querySelector('.mbt-margin-slot');
  const filterButtons = [...page.querySelectorAll('.mbt-filter-option')];
  const clearButton = page.querySelector('[data-clear]');
  // Hovering a row echoes into the margin: its region lights up in Filed Under,
  // so the annotation and the text it annotates are visibly joined.
  const motion = window.createArchiveMotion({ page, rowsEl, reduceMotion, onActivate(row) {
    const region = row && records.find(author => author.file === row.dataset.file)?.regionGroup;
    filterButtons.forEach(button => button.toggleAttribute('data-echo', button.dataset.group === 'region' && button.dataset.value === region));
  } });

  /* ---------- URL ---------- */
  function readURL() {
    const params = new URLSearchParams(location.search);
    state.search = params.get('q') || '';
    state.region = REGION_ORDER.some(([key]) => key === params.get('region')) ? params.get('region') : '';
    state.period = PERIODS.some(([value]) => value === params.get('period')) ? params.get('period') : '';
    state.concern = CONCERNS.some(([value]) => value === params.get('concern')) ? params.get('concern') : '';
    state.open = params.get('open') === '1';
    searchEl.value = state.search;
    if (CONCERNS_MORE.some(([value]) => value === state.concern)) page.querySelector('.mbt-more').open = true;
  }
  function writeURL() {
    const url = new URL(location.href);
    for (const [key, value] of Object.entries({ q: state.search, region: state.region, period: state.period, concern: state.concern, open: state.open ? '1' : '' })) {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    history.replaceState(null, '', url);
  }

  /* ---------- open / close ---------- */
  function searchTarget() {
    const available = toolbar.clientWidth - 56;
    const preferred = parseFloat(getComputedStyle(page).getPropertyValue('--search-width')) || 481;
    return Math.max(0, Math.min(preferred, available));
  }
  function marginTarget() {
    const styles = getComputedStyle(page);
    return (parseFloat(styles.getPropertyValue('--margin-width')) || 216) + (parseFloat(styles.getPropertyValue('--margin-gap')) || 0);
  }
  function setOpen(open, { focus = true } = {}) {
    state.open = open;
    page.toggleAttribute('data-open', open);
    pile.setAttribute('aria-expanded', String(open));
    searchEl.tabIndex = open ? 0 : -1;
    marginSlot.inert = !open;
    if (open) marginSlot.setAttribute('data-visible', '');
    motion.animateWidth('search', searchLine, open ? searchTarget() : 0, {
      apply: value => {
        searchLine.style.width = `${Math.max(0, value)}px`;
        searchLine.style.opacity = Math.min(1, value / 80);
      },
      onSettle: () => { if (!open) searchLine.style.width = '0px'; }
    });
    if (compact.matches) {
      marginSlot.style.width = '';
      if (!open) marginSlot.removeAttribute('data-visible');
    } else {
      motion.animateWidth('margin', marginSlot, open ? marginTarget() : 0, {
        delay: open ? motion.settings.panel.marginLag : 0,
        onSettle: () => { if (!open) marginSlot.removeAttribute('data-visible'); }
      });
    }
    if (open && focus) setTimeout(() => searchEl.focus({ preventScroll: true }), reduceMotion.matches ? 0 : 120);
    if (!open) { if (searchLine.contains(document.activeElement) || marginSlot.contains(document.activeElement)) pile.focus(); }
    syncPile();
    writeURL();
  }
  function syncPile() {
    const active = Boolean(state.search.trim() || state.region || state.period || state.concern);
    pile.toggleAttribute('data-filtered', active);
    pile.style.color = !state.open && active ? 'var(--ink)' : '';
  }


  /* ---------- filtering + painting ---------- */
  function matches(author) {
    const period = PERIODS.find(([value]) => value === state.period);
    const concern = CONCERNS.find(([value]) => value === state.concern);
    return (!state.search.trim() || author.haystack.includes(norm(state.search.trim())))
      && (!state.region || author.regionGroup === state.region)
      && (!period || period[2](author.firstYear))
      && (!concern || concern[2].some(theme => author.themes.includes(theme)));
  }
  function syncFilters() {
    filterButtons.forEach(button => button.setAttribute('aria-pressed', String(state[button.dataset.group] === button.dataset.value)));
    const count = [state.region, state.period, state.concern].filter(Boolean).length;
    clearButton.hidden = !count && !state.search.trim();
    syncPile();
  }
  function paint() {
    const previous = motion.capture();
    motion.reset();
    const list = records.filter(matches);
    page.querySelector('[data-result-count]').textContent = `${list.length} of ${records.length} writers`;
    rowsEl.innerHTML = list.map(author => {
      const portrait = portraitOf(author.file);
      const [first, last] = portrait ? splitName(author.name) : [author.name, ''];
      return `<li><a class="mbt-row" href="../authors-raw/${encodeURIComponent(author.file)}" rel="noreferrer" data-file="${esc(author.file)}" aria-haspopup="dialog" aria-label="${esc(author.name)}, ${esc(author.regionGroup)}, file ${author.folio}">
        <span class="mbt-name"><span>${esc(first)}</span>${portrait ? `<span class="mbt-media" aria-hidden="true"><span class="mbt-media-inner"><img src="${portrait}" alt="" width="120" height="120" loading="lazy" decoding="async"></span></span><span>${esc(last)}</span>` : ''}</span>
        <span class="mbt-meta">${esc(author.regionLabel)}, <span>F. ${author.folio}</span><svg class="mbt-row-arrow" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true"><path d="M4 12 12 4M4 4h8v8"/></svg></span>
      </a></li>`;
    }).join('') || '<li class="mbt-empty"><p>No writers match this search.</p><button class="mbt-clear" type="button" data-reset>Clear search and filters</button></li>';
    motion.bindRows();
    motion.enter(previous);
    syncFilters();
  }
  function clearFilters() {
    state.search = state.region = state.period = state.concern = '';
    searchEl.value = '';
    if (state.open) searchEl.focus({ preventScroll: true });
    writeURL();
    paint();
  }

  /* ---------- events ---------- */
  pile.addEventListener('click', () => setOpen(!state.open));
  rowsEl.addEventListener('click', event => { if (event.target.closest('[data-reset]')) clearFilters(); });
  clearButton.addEventListener('click', clearFilters);
  searchEl.addEventListener('input', () => { state.search = searchEl.value; state.hot = 0; writeURL(); paint(); });
  filterButtons.forEach(button => button.addEventListener('click', () => {
    const { group, value } = button.dataset;
    state[group] = state[group] === value ? '' : value;
    writeURL();
    paint();
  }));
  rowsEl.addEventListener('keydown', event => {
    if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
    const row = event.target.closest('.mbt-row');
    if (!row) return;
    const next = event.key === 'ArrowDown' ? row.parentElement.nextElementSibling : row.parentElement.previousElementSibling;
    if (next) { event.preventDefault(); next.querySelector('a').focus(); }
  });
  document.addEventListener('keydown', event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (!state.open) setOpen(true);
      else { searchEl.focus(); searchEl.select(); }
    }
    if (event.key === 'Escape' && state.open && !event.target.closest?.('.dialkit-root')) setOpen(false);
  });
  window.addEventListener('popstate', () => { readURL(); paint(); setOpen(state.open, { focus: false }); });
  window.addEventListener('resize', () => { if (state.open) setOpen(true, { focus: false }); });
  compact.addEventListener('change', () => setOpen(state.open, { focus: false }));
  if (!/Mac|iPhone|iPad/.test(navigator.platform)) page.querySelector('.mbt-shortcut').textContent = 'Ctrl K';

  page.dataset.hover = 'wash';
  readURL();
  paint();
  setOpen(state.open, { focus: false });
})();
