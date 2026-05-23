(() => {
  // Nav targets: top-level .spread sections AND page-anchors inside vignettes.
  // DOM order matches scroll order: opening → v1 anchors → bridge-a → v2 anchors → ...
  const navTargets = Array.from(document.querySelectorAll('.spread, .page-anchor'));
  const vignettes = Array.from(document.querySelectorAll('.vignette'));
  const opening = document.querySelector('.spread-opening');
  const isMobile = () => window.innerWidth < 800;

  // Shared between the postcard block (sets it) and the nav-key block
  // (yields to it so arrow keys can browse focused postcards instead).
  let focusedHotspot = null;

  // ===================================================================
  // OPENING — entrance choreography. Toggle `.is-entered` on the next
  // paint so the CSS fade-up runs from the opacity:0 initial state.
  // ===================================================================
  if (opening) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        opening.classList.add('is-entered');
      });
    });

    // Drive a 0→1 scroll progress on the opening so its image + overlay
    // can fade and blur as the visitor moves into V1 — depth-of-field
    // feel: the moment we're leaving recedes as we enter the next one.
    let openingScrollScheduled = false;
    function updateOpeningProgress() {
      const rect = opening.getBoundingClientRect();
      const h = opening.offsetHeight || 1;
      const raw = Math.max(0, Math.min(1, -rect.top / h));
      // Ease-out (quad) so the fade ramps in gently from the top.
      const eased = 1 - (1 - raw) * (1 - raw);
      opening.style.setProperty('--opening-scroll-progress', eased.toFixed(3));
      // Linear value for 1:1 effects (sticky-style translate that must
      // match scroll rate exactly).
      opening.style.setProperty('--opening-scroll-raw', raw.toFixed(3));
    }
    function scheduleOpeningProgress() {
      if (openingScrollScheduled) return;
      openingScrollScheduled = true;
      requestAnimationFrame(() => {
        updateOpeningProgress();
        openingScrollScheduled = false;
      });
    }
    window.addEventListener('scroll', scheduleOpeningProgress, { passive: true });
    window.addEventListener('resize', scheduleOpeningProgress);
    updateOpeningProgress();
  }

  // ===================================================================
  // STORYBOOK — drive horizontal translate from vertical scroll
  // ===================================================================

  function updateVignette(vignette) {
    const track = vignette.querySelector('.vignette-track');
    if (!track) return;

    if (isMobile()) {
      track.style.transform = '';
      return;
    }

    const pagesRaw = getComputedStyle(vignette).getPropertyValue('--pages');
    const pages = parseInt(pagesRaw, 10) || 1;
    if (pages < 2) {
      track.style.transform = 'translate3d(0, 0, 0)';
      return;
    }

    const rect = vignette.getBoundingClientRect();
    const total = vignette.offsetHeight - window.innerHeight;
    if (total <= 0) {
      track.style.transform = 'translate3d(0, 0, 0)';
      return;
    }
    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / total));
    const x = -progress * (pages - 1) * 100;
    track.style.transform = `translate3d(${x}vw, 0, 0)`;
  }

  function updateAllVignettes() {
    vignettes.forEach(updateVignette);
  }

  let scrollScheduled = false;
  function scheduleVignetteUpdate() {
    if (scrollScheduled) return;
    scrollScheduled = true;
    requestAnimationFrame(() => {
      updateAllVignettes();
      scrollScheduled = false;
    });
  }

  window.addEventListener('scroll', scheduleVignetteUpdate, { passive: true });
  window.addEventListener('resize', scheduleVignetteUpdate);
  updateAllVignettes();

  // ===================================================================
  // ARROW-KEY NAVIGATION between spreads + page-anchors
  // ===================================================================

  if (navTargets.length > 0) {
    function currentTargetIndex() {
      const threshold = window.innerHeight * 0.5;
      let idx = 0;
      for (let i = 0; i < navTargets.length; i++) {
        const top = navTargets[i].getBoundingClientRect().top;
        if (top <= threshold) idx = i;
      }
      return idx;
    }

    function goTo(i) {
      const clamped = Math.max(0, Math.min(navTargets.length - 1, i));
      navTargets[clamped].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function next() {
      goTo(currentTargetIndex() + 1);
    }

    function prev() {
      const i = currentTargetIndex();
      const currentTop = navTargets[i].getBoundingClientRect().top;
      if (currentTop < -50) {
        goTo(i);
      } else {
        goTo(i - 1);
      }
    }

    document.addEventListener('keydown', (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target;
      const tag = (target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || target.isContentEditable) return;
      // When a postcard is focused, Left/Right are claimed for card browsing.
      if (focusedHotspot && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) return;

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
      } else if (e.key === 'Home') {
        e.preventDefault();
        goTo(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goTo(navTargets.length - 1);
      }
    });
  }

  // ===================================================================
  // VIDEO pause/play — save bandwidth on offscreen <video> elements
  // ===================================================================

  const videos = Array.from(document.querySelectorAll('video'));
  if (videos.length > 0 && 'IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          const playPromise = video.play();
          if (playPromise && playPromise.catch) playPromise.catch(() => {});
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.1 });
    videos.forEach((v) => videoObserver.observe(v));
  }

  // ===================================================================
  // OPENING TITLE — rotate through languages with a smooth crossfade
  // ===================================================================

  const titleEl = document.querySelector('.opening-title-text');
  const titleContainer = document.querySelector('.opening-title');
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (titleEl && titleContainer) {
    const langs = [
      { lang: 'en',      text: 'The Untold Stories' },
      { lang: 'zh-Hans', text: '未被讲述的故事' },
      { lang: 'ja',      text: '語られざる物語' },
      { lang: 'ko',      text: '들려지지 않은 이야기들' },
      { lang: 'es',      text: 'Las historias no contadas' },
      { lang: 'fr',      text: 'Les histoires non racontées' },
      { lang: 'pt',      text: 'As histórias não contadas' },
    ];

    let idx = 0;
    let paused = false;

    // Each char gets its own randomized delay (0–STAGGER ms) so the title
    // dissolves and reassembles unevenly. Single transition duration is in
    // CSS (`.opening-char`).
    const STAGGER = 450;
    const TRANSITION = 900;

    function buildChars(text, lang) {
      titleEl.setAttribute('lang', lang);
      titleEl.innerHTML = '';
      const fragment = document.createDocumentFragment();
      for (const ch of text) {  /* iterates Unicode code points correctly */
        const span = document.createElement('span');
        span.className = 'opening-char';
        span.style.setProperty('--delay', `${Math.random() * STAGGER | 0}ms`);
        span.textContent = ch === ' ' ? ' ' : ch;
        fragment.appendChild(span);
      }
      titleEl.appendChild(fragment);
    }

    // Initial render: wrap the existing English string in per-char spans.
    buildChars(langs[idx].text, langs[idx].lang);

    function advanceTitle() {
      if (paused || prefersReduce) return;
      idx = (idx + 1) % langs.length;
      const { lang, text } = langs[idx];

      // Phase 1 — fade out (each char on its own delay).
      titleEl.classList.add('is-fading');

      // Phase 2 — once the slowest char has finished fading, swap in the
      // new text (built with fresh random delays) and lift the fade class
      // so the new chars transition back to visible.
      setTimeout(() => {
        buildChars(text, lang);
        void titleEl.offsetHeight;  /* commit the new chars before un-fading */
        titleEl.classList.remove('is-fading');
      }, STAGGER + TRANSITION);
    }

    if (!prefersReduce) {
      setInterval(advanceTitle, 4500);
      titleContainer.addEventListener('mouseenter', () => { paused = true; });
      titleContainer.addEventListener('mouseleave', () => { paused = false; });
    }
  }

  // ===================================================================
  // OPENING — peel-away transition when the visitor starts scrolling
  // ===================================================================

  const scrolledVideo = opening?.querySelector('.opening-bg-scrolled');

  if (opening && scrolledVideo && !prefersReduce) {
    let isScrolled = false;

    function updateOpeningState() {
      const past = window.scrollY > opening.offsetHeight * 0.1;
      if (past && !isScrolled) {
        isScrolled = true;
        opening.classList.add('is-scrolled');
        scrolledVideo.currentTime = 0;
        const p = scrolledVideo.play();
        if (p && p.catch) p.catch(() => {});
      } else if (!past && isScrolled) {
        isScrolled = false;
        opening.classList.remove('is-scrolled');
        scrolledVideo.pause();
        scrolledVideo.currentTime = 0;
      }
    }

    window.addEventListener('scroll', updateOpeningState, { passive: true });
  }

  // ===================================================================
  // OPENING GRID OVERLAY — design tool. Press `g` to toggle.
  // 12 cols x 8 rows inside a 3% page margin.
  // ===================================================================

  const gridHost = document.querySelector('.opening-grid');

  if (opening && gridHost) {
    const COLS = 12;
    const ROWS = 8;

    // Inner lines (1..COLS-1) and the framing 0 / COLS lines are drawn
    // by the .grid-margin dashed border instead, to keep counts clean.
    for (let i = 1; i < COLS; i++) {
      const line = document.createElement('div');
      line.className = 'grid-col';
      line.style.left = `calc(3% + ${(i / COLS) * 94}vw)`;
      gridHost.appendChild(line);
    }
    for (let i = 1; i < ROWS; i++) {
      const line = document.createElement('div');
      line.className = 'grid-row';
      line.style.top = `calc(3% + ${(i / ROWS) * 94}vh)`;
      gridHost.appendChild(line);
    }
    // Column labels along the top — centered on each column
    for (let i = 1; i <= COLS; i++) {
      const label = document.createElement('div');
      label.className = 'grid-label grid-label-col';
      label.style.left = `calc(3% + ${((i - 0.5) / COLS) * 94}vw)`;
      label.textContent = `c${i}`;
      gridHost.appendChild(label);
    }
    // Row labels along the left — centered on each row
    for (let i = 1; i <= ROWS; i++) {
      const label = document.createElement('div');
      label.className = 'grid-label grid-label-row';
      label.style.top = `calc(3% + ${((i - 0.5) / ROWS) * 94}vh)`;
      label.textContent = `r${i}`;
      gridHost.appendChild(label);
    }
    // The 3% margin frame
    const margin = document.createElement('div');
    margin.className = 'grid-margin';
    gridHost.insertBefore(margin, gridHost.firstChild);

    document.addEventListener('keydown', (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target;
      const tag = (target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || target.isContentEditable) return;
      if (e.key === 'g' || e.key === 'G') {
        opening.classList.toggle('show-grid');
      }
    });
  }

  // ===================================================================
  // POSTCARD HOTSPOTS — show popover next to hovered postcard, with
  // viewport-edge fallback positioning. Touch: tap toggles.
  // ===================================================================

  const hotspots = Array.from(document.querySelectorAll('.postcard-hotspot'));
  const postcardContainer = document.querySelector('.opening-postcards');

  // Per-card stagger index AND a randomized-but-stable tilt for the
  // focused postcard.
  const tiltSequence = ['-1.2deg', '0.6deg', '-0.4deg', '1deg',
                        '-0.8deg', '0.4deg', '-1.1deg', '0.7deg'];
  hotspots.forEach((hotspot, i) => {
    hotspot.style.setProperty('--i', i);
    const tilt = tiltSequence[i % tiltSequence.length];
    hotspot.style.setProperty('--postcard-tilt', tilt);
  });

  // Per-card lamp falloff — each postcard's halo scale + intensity is
  // computed from its distance to the lamp on the desk (approx. center
  // 40% x 55% of the artwork). Closer = bigger and brighter; farther =
  // smaller and dimmer, like paper barely catching the light. A small
  // deterministic noise term breaks the uniformity.
  const LAMP_X = 0.40;
  const LAMP_Y = 0.55;
  const cardCenter = (hs) => {
    const l = parseFloat(hs.style.left) || 0;
    const t = parseFloat(hs.style.top)  || 0;
    const w = parseFloat(hs.style.width)  || 0;
    const h = parseFloat(hs.style.height) || 0;
    return { x: (l + w / 2) / 100, y: (t + h / 2) / 100 };
  };
  const dists = hotspots.map((hs) => {
    const c = cardCenter(hs);
    return Math.hypot(c.x - LAMP_X, c.y - LAMP_Y);
  });
  const minD = Math.min(...dists);
  const maxD = Math.max(...dists);
  hotspots.forEach((hotspot, i) => {
    const t = maxD > minD ? (dists[i] - minD) / (maxD - minD) : 0;
    // Tiny noise (-0.12..+0.12, deterministic from index) so the
    // mapping doesn't read as a clean gradient.
    const noise = ((Math.sin(i * 1.7) + Math.cos(i * 2.3)) / 2) * 0.12;
    const tn = Math.max(0, Math.min(1, t + noise));
    const scale = 2.1 - tn * 0.75;   // 2.1x near → 1.35x far
    // Peak stays well below the lamp's apparent brightness — the
    // postcard reflects light, it doesn't emit it.
    const peak  = 0.62 - tn * 0.28;  // 0.62 near → 0.34 far
    // Per-card breathing duration + phase so they're never all
    // visible at once. Breathing fades fully out and back in.
    const duration = 5 + Math.abs(Math.sin(i * 1.1)) * 3.5;   // 5–8.5s
    const phase    = (i * 0.83) % 5;                          // 0–4.2s
    // Per-card shape — light catching paper at different angles makes
    // some glows wider, some taller, some tilted. Hand-tuned palette.
    const shapeVariants = [
      { sx: 1.20, sy: 0.88, rot: -10 },  // wide, slight left tilt
      { sx: 0.90, sy: 1.18, rot:   6 },  // tall, slight right tilt
      { sx: 1.08, sy: 1.04, rot:  14 },  // near-round, tilted right
      { sx: 0.94, sy: 0.96, rot:  -4 },  // small + uniform
      { sx: 1.24, sy: 0.84, rot: -18 },  // very wide, hard tilt
      { sx: 0.92, sy: 1.14, rot:   8 },  // slightly tall
      { sx: 1.06, sy: 0.94, rot:  -7 },  // gentle ellipse
      { sx: 0.98, sy: 1.10, rot:  16 },  // upright with twist
    ];
    const v = shapeVariants[i % shapeVariants.length];
    hotspot.style.setProperty('--glow-scale', `${(scale * 100).toFixed(0)}%`);
    hotspot.style.setProperty('--glow-peak', peak.toFixed(2));
    hotspot.style.setProperty('--breath-duration', `${duration.toFixed(2)}s`);
    hotspot.style.setProperty('--breath-phase', `${phase.toFixed(2)}s`);
    hotspot.style.setProperty('--glow-aspect-x', v.sx);
    hotspot.style.setProperty('--glow-aspect-y', v.sy);
    hotspot.style.setProperty('--glow-rotate', `${v.rot}deg`);
  });

  // Dust motes — only on the 3 postcards closest to the lamp. Real
  // lamplight reveals dust most where the light is brightest; far
  // postcards stay clean. Each mote drifts upward + sideways on its
  // own duration, with a negative delay so they're mid-animation on
  // first paint (not all synchronized).
  const closestIdxs = dists
    .map((d, i) => ({ d, i }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 3)
    .map(o => o.i);

  // Postcard grid overlay — artwork-anchored (12 cols x 8 rows directly
  // across .opening-postcards). Press `p` to toggle. Use these
  // coordinates to refine hotspot positions on the drawing.
  if (postcardContainer) {
    const pcGrid = document.createElement('div');
    pcGrid.className = 'opening-postcards-grid';
    pcGrid.setAttribute('aria-hidden', 'true');
    const PCG_COLS = 12;
    const PCG_ROWS = 8;
    for (let i = 1; i < PCG_COLS; i++) {
      const line = document.createElement('div');
      line.className = 'pcg-col';
      line.style.left = `${(i / PCG_COLS) * 100}%`;
      pcGrid.appendChild(line);
    }
    for (let i = 1; i < PCG_ROWS; i++) {
      const line = document.createElement('div');
      line.className = 'pcg-row';
      line.style.top = `${(i / PCG_ROWS) * 100}%`;
      pcGrid.appendChild(line);
    }
    for (let i = 1; i <= PCG_COLS; i++) {
      const label = document.createElement('div');
      label.className = 'pcg-label pcg-label-col';
      label.style.left = `${((i - 0.5) / PCG_COLS) * 100}%`;
      label.textContent = `c${i}`;
      pcGrid.appendChild(label);
    }
    for (let i = 1; i <= PCG_ROWS; i++) {
      const label = document.createElement('div');
      label.className = 'pcg-label pcg-label-row';
      label.style.top = `${((i - 0.5) / PCG_ROWS) * 100}%`;
      label.textContent = `r${i}`;
      pcGrid.appendChild(label);
    }
    postcardContainer.appendChild(pcGrid);

    document.addEventListener('keydown', (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;
      if (e.key === 'p' || e.key === 'P') {
        postcardContainer.classList.toggle('show-pc-grid');
      } else if (e.key === 'd' || e.key === 'D') {
        // Compare light vs dark author cards
        document.body.classList.toggle('cards-dark');
      }
    });
  }

  closestIdxs.forEach(idx => {
    const hotspot = hotspots[idx];
    const numMotes = 3 + Math.floor(Math.random() * 2); // 3 or 4
    for (let m = 0; m < numMotes; m++) {
      const angle  = Math.random() * Math.PI * 2;
      const radial = 18 + Math.random() * 55;
      const x0     = Math.cos(angle) * radial;
      const y0     = Math.sin(angle) * radial;
      const dx     = (Math.random() - 0.5) * 22;   // ±11 horizontal drift
      const dy     = -14 - Math.random() * 24;     // upward
      const size   = 1.6 + Math.random() * 1.6;    // 1.6–3.2px
      const dur    = 5.5 + Math.random() * 4;      // 5.5–9.5s
      const delay  = -Math.random() * 9;           // negative → start mid-cycle

      const mote = document.createElement('span');
      mote.className = 'dust-mote';
      mote.setAttribute('aria-hidden', 'true');
      mote.style.setProperty('--mote-x0', `${x0.toFixed(1)}px`);
      mote.style.setProperty('--mote-y0', `${y0.toFixed(1)}px`);
      mote.style.setProperty('--mote-x1', `${(x0 + dx).toFixed(1)}px`);
      mote.style.setProperty('--mote-y1', `${(y0 + dy).toFixed(1)}px`);
      mote.style.setProperty('--mote-size', `${size.toFixed(1)}px`);
      mote.style.setProperty('--mote-duration', `${dur.toFixed(2)}s`);
      mote.style.setProperty('--mote-delay', `${delay.toFixed(2)}s`);
      hotspot.appendChild(mote);
    }
  });

  if (hotspots.length > 0 && postcardContainer) {
    const hideTimers = new Map();
    let hoveredHotspot = null;
    // `focusedHotspot` is the outer-scope var hoisted at the top of the IIFE.

    function getPopover(hotspot) {
      const id = hotspot.getAttribute('aria-describedby');
      return id ? document.getElementById(id) : null;
    }

    /** Position popover near hotspot, biased so the focused (larger) card
     *  stays inside the viewport. Same algorithm in both states. */
    function positionPopover(hotspot, popover) {
      const hRect = hotspot.getBoundingClientRect();
      const cRect = postcardContainer.getBoundingClientRect();
      const margin = 14;

      // Provisional: drop measurement to top-left
      popover.style.left = '0px';
      popover.style.top = '0px';
      const pWidth = popover.offsetWidth;
      const pHeight = popover.offsetHeight;

      // Default: right of hotspot, top-aligned
      let left = (hRect.right - cRect.left) + margin;
      let top = hRect.top - cRect.top;

      // Overflows right edge → place to the left of hotspot
      if (hRect.right + margin + pWidth > window.innerWidth) {
        left = (hRect.left - cRect.left) - margin - pWidth;
      }

      // Overflows bottom → shift up
      const absTop = cRect.top + top;
      if (absTop + pHeight > window.innerHeight - margin) {
        top = (window.innerHeight - margin - pHeight) - cRect.top;
      }

      // Don't go above container; don't go off the left
      if (top < margin) top = margin;
      if (left < margin) left = margin;

      popover.style.left = left + 'px';
      popover.style.top = top + 'px';
    }

    function setPopoverTilt(hotspot, popover) {
      const tilt = hotspot.style.getPropertyValue('--postcard-tilt');
      if (tilt) popover.style.setProperty('--postcard-tilt', tilt);
    }

    function showPreview(hotspot) {
      if (focusedHotspot) return; // suppress previews while a card is focused
      const popover = getPopover(hotspot);
      if (!popover) return;
      if (hideTimers.has(popover)) {
        clearTimeout(hideTimers.get(popover));
        hideTimers.delete(popover);
      }
      // Drop any other in-flight preview
      if (hoveredHotspot && hoveredHotspot !== hotspot) {
        const prev = getPopover(hoveredHotspot);
        if (prev) prev.classList.remove('is-preview');
        hoveredHotspot.classList.remove('is-active');
      }
      setPopoverTilt(hotspot, popover);
      // Apply state class FIRST so width/padding settle, then measure + place.
      popover.classList.add('is-preview');
      hotspot.classList.add('is-active');
      hoveredHotspot = hotspot;
      positionPopover(hotspot, popover);
    }

    function hidePreview(hotspot, delay = 200) {
      if (focusedHotspot === hotspot) return; // focused state outranks hover
      const popover = getPopover(hotspot);
      if (!popover) return;
      if (hideTimers.has(popover)) clearTimeout(hideTimers.get(popover));
      const t = setTimeout(() => {
        popover.classList.remove('is-preview');
        if (focusedHotspot !== hotspot) hotspot.classList.remove('is-active');
        if (hoveredHotspot === hotspot) hoveredHotspot = null;
        hideTimers.delete(popover);
      }, delay);
      hideTimers.set(popover, t);
    }

    function focusCard(hotspot) {
      const popover = getPopover(hotspot);
      if (!popover) return;
      // Tear down any previous focused card
      if (focusedHotspot && focusedHotspot !== hotspot) {
        const prevPop = getPopover(focusedHotspot);
        if (prevPop) prevPop.classList.remove('is-focused', 'is-preview');
        focusedHotspot.classList.remove('is-active');
      }
      // Tear down any active preview that isn't this card
      if (hoveredHotspot && hoveredHotspot !== hotspot) {
        const prevPop = getPopover(hoveredHotspot);
        if (prevPop) prevPop.classList.remove('is-preview');
        hoveredHotspot.classList.remove('is-active');
        hoveredHotspot = null;
      }
      if (hideTimers.has(popover)) {
        clearTimeout(hideTimers.get(popover));
        hideTimers.delete(popover);
      }
      setPopoverTilt(hotspot, popover);
      popover.classList.remove('is-preview');
      popover.classList.add('is-focused');
      hotspot.classList.add('is-active');
      focusedHotspot = hotspot;
      // Position AFTER class swap so we measure the focused size
      requestAnimationFrame(() => positionPopover(hotspot, popover));
    }

    function unfocusCard() {
      if (!focusedHotspot) return;
      const popover = getPopover(focusedHotspot);
      if (popover) popover.classList.remove('is-focused');
      focusedHotspot.classList.remove('is-active');
      focusedHotspot = null;
    }

    function navigateFocused(dir) {
      if (!focusedHotspot) return;
      const i = hotspots.indexOf(focusedHotspot);
      if (i < 0) return;
      const next = (i + dir + hotspots.length) % hotspots.length;
      focusCard(hotspots[next]);
    }

    hotspots.forEach((hotspot) => {
      const popover = getPopover(hotspot);
      if (!popover) return;

      hotspot.addEventListener('mouseenter', () => showPreview(hotspot));
      hotspot.addEventListener('mouseleave', () => hidePreview(hotspot));
      hotspot.addEventListener('focus', () => showPreview(hotspot));
      hotspot.addEventListener('blur', () => hidePreview(hotspot, 0));

      // Preview popover stays open while cursor is on it (mouse loop)
      popover.addEventListener('mouseenter', () => {
        if (focusedHotspot) return;
        if (hideTimers.has(popover)) {
          clearTimeout(hideTimers.get(popover));
          hideTimers.delete(popover);
        }
      });
      popover.addEventListener('mouseleave', () => {
        if (focusedHotspot) return;
        hidePreview(hotspot);
      });

      hotspot.addEventListener('click', (e) => {
        e.stopPropagation();
        if (focusedHotspot === hotspot) return; // click on focused: no-op
        focusCard(hotspot);
      });
    });

    // Outside click dismisses focus. Clicking the focused card itself does NOT
    // (so users can select text or click in-card links later).
    document.addEventListener('click', (e) => {
      if (!focusedHotspot) return;
      if (e.target.closest('.postcard-hotspot')) return;
      if (e.target.closest('.postcard-popover.is-focused')) return;
      unfocusCard();
    });

    // Esc + Arrow Left/Right while a card is focused
    document.addEventListener('keydown', (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target;
      const tag = (target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || target.isContentEditable) return;
      if (!focusedHotspot) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        unfocusCard();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateFocused(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateFocused(1);
      }
    });

    // Reposition on resize (focused only — preview disappears on cursor move)
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (focusedHotspot) {
          const popover = getPopover(focusedHotspot);
          if (popover) positionPopover(focusedHotspot, popover);
        }
      }, 100);
    });
  }

  // ===================================================================
  // FADE-IN figures and cases as they enter the viewport
  // ===================================================================

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fadeTargets = document.querySelectorAll('.spread-figure, .case');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    fadeTargets.forEach((el) => { el.style.opacity = '1'; });
    return;
  }

  fadeTargets.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    el.style.transition = 'opacity 500ms ease-out, transform 500ms ease-out';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

  fadeTargets.forEach((el) => observer.observe(el));
})();
