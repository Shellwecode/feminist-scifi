(() => {
  // Nav targets: top-level .spread sections AND page-anchors inside vignettes.
  // DOM order matches scroll order: opening → v1 anchors → bridge-a → v2 anchors → ...
  const navTargets = Array.from(document.querySelectorAll('.spread, .page-anchor'));
  const vignettes = Array.from(document.querySelectorAll('.vignette'));
  const isMobile = () => window.innerWidth < 800;

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
      { lang: 'en',      text: 'the untold stories' },
      { lang: 'zh-Hans', text: '未被讲述的故事' },
      { lang: 'ja',      text: '語られざる物語' },
      { lang: 'ko',      text: '들려지지 않은 이야기들' },
      { lang: 'es',      text: 'las historias no contadas' },
      { lang: 'fr',      text: 'les histoires non racontées' },
      { lang: 'pt',      text: 'as histórias não contadas' },
    ];

    let idx = 0;
    let paused = false;

    function advanceTitle() {
      if (paused || prefersReduce) return;
      idx = (idx + 1) % langs.length;
      const { lang, text } = langs[idx];
      titleEl.classList.add('is-fading');
      setTimeout(() => {
        titleEl.textContent = text;
        titleEl.setAttribute('lang', lang);
        titleEl.classList.remove('is-fading');
      }, 400);
    }

    if (!prefersReduce) {
      setInterval(advanceTitle, 2500);
      titleContainer.addEventListener('mouseenter', () => { paused = true; });
      titleContainer.addEventListener('mouseleave', () => { paused = false; });
    }
  }

  // ===================================================================
  // POSTCARD HOTSPOTS — show popover next to hovered postcard, with
  // viewport-edge fallback positioning. Touch: tap toggles.
  // ===================================================================

  const hotspots = Array.from(document.querySelectorAll('.postcard-hotspot'));
  const postcardContainer = document.querySelector('.opening-postcards');

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
