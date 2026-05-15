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
