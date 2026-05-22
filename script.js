(() => {
  // Nav targets: top-level .spread sections AND page-anchors inside vignettes.
  // DOM order matches scroll order: opening → v1 anchors → bridge-a → v2 anchors → ...
  const navTargets = Array.from(document.querySelectorAll('.spread, .page-anchor'));
  const vignettes = Array.from(document.querySelectorAll('.vignette'));
  const opening = document.querySelector('.spread-opening');
  const isMobile = () => window.innerWidth < 800;

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

  // Stagger index for the post-entrance wake-up animation
  hotspots.forEach((hotspot, i) => {
    hotspot.style.setProperty('--i', i);
  });

  if (hotspots.length > 0 && postcardContainer) {
    const hideTimers = new Map();
    let activeHotspot = null;

    function getPopover(hotspot) {
      const id = hotspot.getAttribute('aria-describedby');
      return id ? document.getElementById(id) : null;
    }

    function positionPopover(hotspot, popover) {
      const hRect = hotspot.getBoundingClientRect();
      const cRect = postcardContainer.getBoundingClientRect();
      const margin = 12;

      // Measure popover (briefly without final styles applied)
      popover.style.left = '0px';
      popover.style.top = '0px';
      const pWidth = popover.offsetWidth;
      const pHeight = popover.offsetHeight;

      // Default: right of hotspot, top-aligned with hotspot
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

      // Don't go above container
      if (top < margin) top = margin;
      // Don't go off the left
      if (left < margin) left = margin;

      popover.style.left = left + 'px';
      popover.style.top = top + 'px';
    }

    function showPopover(hotspot) {
      const popover = getPopover(hotspot);
      if (!popover) return;
      if (hideTimers.has(popover)) {
        clearTimeout(hideTimers.get(popover));
        hideTimers.delete(popover);
      }
      // Dismiss any other active popover
      if (activeHotspot && activeHotspot !== hotspot) {
        const prev = getPopover(activeHotspot);
        if (prev) {
          prev.classList.remove('is-visible');
          activeHotspot.classList.remove('is-active');
        }
      }
      positionPopover(hotspot, popover);
      popover.classList.add('is-visible');
      hotspot.classList.add('is-active');
      activeHotspot = hotspot;
    }

    function hidePopover(hotspot, delay = 220) {
      const popover = getPopover(hotspot);
      if (!popover) return;
      if (hideTimers.has(popover)) clearTimeout(hideTimers.get(popover));
      const t = setTimeout(() => {
        popover.classList.remove('is-visible');
        hotspot.classList.remove('is-active');
        if (activeHotspot === hotspot) activeHotspot = null;
        hideTimers.delete(popover);
      }, delay);
      hideTimers.set(popover, t);
    }

    hotspots.forEach((hotspot) => {
      const popover = getPopover(hotspot);
      if (!popover) return;

      hotspot.addEventListener('mouseenter', () => showPopover(hotspot));
      hotspot.addEventListener('mouseleave', () => hidePopover(hotspot));
      hotspot.addEventListener('focus', () => showPopover(hotspot));
      hotspot.addEventListener('blur', () => hidePopover(hotspot, 0));

      // Cursor entering popover keeps it open
      popover.addEventListener('mouseenter', () => {
        if (hideTimers.has(popover)) {
          clearTimeout(hideTimers.get(popover));
          hideTimers.delete(popover);
        }
      });
      popover.addEventListener('mouseleave', () => hidePopover(hotspot));

      // Tap toggles (works on touch and mouse without conflicting with hover)
      hotspot.addEventListener('click', (e) => {
        e.stopPropagation();
        if (popover.classList.contains('is-visible')) {
          hidePopover(hotspot, 0);
        } else {
          showPopover(hotspot);
        }
      });
    });

    // Outside tap dismisses any visible popover (touch UX)
    document.addEventListener('click', (e) => {
      if (!activeHotspot) return;
      if (e.target.closest('.postcard-hotspot') || e.target.closest('.postcard-popover')) return;
      const popover = getPopover(activeHotspot);
      if (popover) popover.classList.remove('is-visible');
      activeHotspot.classList.remove('is-active');
      activeHotspot = null;
    });

    // Reposition active popover on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (activeHotspot) {
          const popover = getPopover(activeHotspot);
          if (popover && popover.classList.contains('is-visible')) {
            positionPopover(activeHotspot, popover);
          }
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
