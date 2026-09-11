/* ANIMATION STORYBOARD — all values are live in DialKit.
 *    0ms  list arrives or filters change: names settle into their new positions
 *   40ms  deliberate hover: ink, margin mark, or paper wash identifies the row
 *  400ms  portrait opens between the name; following rows make room
 *  220ms  pointer leaves: row treatment clears, portrait closes from its velocity
 *
 * Each row has one activity target (0 / 1). Hover, focus, and preview all feed
 * that target. Reduced motion reaches the same visual state immediately.
 */
(() => {
  'use strict';
  const DEFAULTS = {
    panel: { spring: { type: 'spring', visualDuration: .55, bounce: 0 }, marginLag: .12, surface: 'line' },
    portrait: { spring: { type: 'spring', visualDuration: .4, bounce: .05 }, size: 120, gap: 24, rowGrowth: 1, leaveSpeed: 1.3 },
    list: { duration: .6, stagger: .08, distance: 25 },
    hover: { treatment: 'ink', delay: .06, duration: .33, offset: 5, neighbors: .72, wash: .15, arrow: true },
    playback: { speed: .75 }
  };
  // Exact damped-spring integration: stable across frame rates and interruptions.
  function springStep(position, velocity, target, dt, omega, damping) {
    const displacement = position - target;
    if (damping < .999) {
      const frequency = omega * Math.sqrt(1 - damping * damping);
      const decay = Math.exp(-damping * omega * dt);
      const sin = Math.sin(frequency * dt), cos = Math.cos(frequency * dt);
      const coefficient = (velocity + damping * omega * displacement) / frequency;
      return [target + decay * (displacement * cos + coefficient * sin), decay * (velocity * cos - (damping * omega * coefficient + frequency * displacement) * sin)];
    }
    if (damping > 1.001) {
      const root = Math.sqrt(damping * damping - 1);
      const r1 = -omega * (damping - root), r2 = -omega * (damping + root);
      const a = (velocity - r2 * displacement) / (r1 - r2), b = displacement - a;
      return [target + a * Math.exp(r1 * dt) + b * Math.exp(r2 * dt), a * r1 * Math.exp(r1 * dt) + b * r2 * Math.exp(r2 * dt)];
    }
    const term = velocity + omega * displacement, decay = Math.exp(-omega * dt);
    return [target + (displacement + term * dt) * decay, (velocity - omega * term * dt) * decay];
  }
  function bezier(progress, curve) {
    const [x1, y1, x2, y2] = curve;
    const sample = (t, a, b) => 3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t * t * b + t ** 3;
    let low = 0, high = 1;
    for (let i = 0; i < 16; i++) {
      const mid = (low + high) / 2;
      if (sample(mid, x1, x2) < progress) low = mid; else high = mid;
    }
    return sample((low + high) / 2, y1, y2);
  }
  window.createArchiveMotion = ({ page, rowsEl, reduceMotion, onActivate }) => {
    let settings = structuredClone(DEFAULTS), frame = null, lastTime = 0, activeRow = null;
    const moving = new Set(), timers = new Set(), entries = new Set();
    function schedule(callback, ms) {
      const id = setTimeout(() => { timers.delete(id); callback(); }, ms);
      timers.add(id);
      return id;
    }
    function size() { return Math.min(settings.portrait.size, innerWidth <= 600 ? 96 : 200); }
    function draw(row) {
      const state = row._motion;
      if (!state.el) return;
      state.el.style.width = `${Math.max(0, state.w)}px`;
      state.el.style.height = `${Math.max(0, state.h)}px`;
    }
    function targetFor(row, key) {
      if (!row._motion.open) return 0;
      return key === 'w' ? size() + settings.portrait.gap : size() * settings.portrait.rowGrowth;
    }
    function tick(now) {
      const dt = Math.min(.064, (now - lastTime) / 1000) * settings.playback.speed;
      lastTime = now;
      const spring = settings.portrait.spring;
      let omega, damping;
      if (spring.stiffness !== undefined) {
        const mass = Math.max(.01, spring.mass || 1);
        omega = Math.sqrt(Math.max(1, spring.stiffness) / mass);
        damping = Math.max(.02, spring.damping / (2 * Math.sqrt(spring.stiffness * mass)));
      } else {
        damping = Math.max(.1, 1 - (spring.bounce || 0));
        omega = 6.6 / Math.max(.08, spring.visualDuration || .4);
      }
      moving.forEach(row => {
        const state = row._motion;
        state.elapsed += dt * (state.open ? 1 : settings.portrait.leaveSpeed);
        let settled = true;
        for (const key of ['w', 'h']) {
          const target = targetFor(row, key);
          if (spring.type === 'easing') {
            const progress = Math.min(1, state.elapsed / Math.max(.05, spring.duration));
            state[key] = state.from[key] + (target - state.from[key]) * bezier(progress, spring.ease);
            state[`v${key}`] = 0;
            if (progress < 1) settled = false;
          } else {
            [state[key], state[`v${key}`]] = springStep(state[key], state[`v${key}`], target, dt * (state.open ? 1 : settings.portrait.leaveSpeed), omega, damping);
            if (Math.abs(state[key] - target) < .1 && Math.abs(state[`v${key}`]) < 1) {
              state[key] = target; state[`v${key}`] = 0;
            } else settled = false;
          }
        }
        draw(row);
        if (settled) moving.delete(row);
      });
      frame = moving.size ? requestAnimationFrame(tick) : null;
    }
    function openPortrait(row, open) {
      if (!row?._motion?.el) return;
      const state = row._motion;
      state.open = open;
      state.from = { w: state.w, h: state.h };
      state.elapsed = 0;
      if (reduceMotion.matches) {
        state.w = targetFor(row, 'w'); state.h = targetFor(row, 'h');
        state.vw = state.vh = 0;
        moving.delete(row); draw(row); return;
      }
      moving.add(row);
      if (frame === null) { lastTime = performance.now(); frame = requestAnimationFrame(tick); }
    }
    function activate(row) {
      if (activeRow && activeRow !== row) {
        activeRow.removeAttribute('data-active');
        openPortrait(activeRow, false);
      }
      activeRow = row;
      rowsEl.toggleAttribute('data-active', Boolean(row));
      if (row) { row.setAttribute('data-active', ''); openPortrait(row, true); }
      onActivate && onActivate(row);
    }
    function bindRows() {
      rowsEl.querySelectorAll('.mbt-row').forEach(row => {
        row._motion = { el: row.querySelector('.mbt-media'), w: 0, h: 0, vw: 0, vh: 0, open: false, hovered: false, elapsed: 0, from: { w: 0, h: 0 } };
        row.addEventListener('pointerenter', event => {
          if (event.pointerType === 'touch') return;
          row._motion.hovered = true;
          row._motion.timer = schedule(() => { if (row._motion.hovered) activate(row); }, settings.hover.delay * 1000);
        });
        row.addEventListener('pointerleave', () => {
          row._motion.hovered = false;
          clearTimeout(row._motion.timer); timers.delete(row._motion.timer);
          if (activeRow === row && !row.contains(document.activeElement)) activate(null);
        });
        row.addEventListener('focus', () => activate(row));
        row.addEventListener('blur', () => { if (activeRow === row && !row._motion.hovered) activate(null); });
      });
    }
    function capture() {
      return new Map([...rowsEl.querySelectorAll('.mbt-row')].map(row => [row.dataset.file, row.parentElement.getBoundingClientRect().top]));
    }
    function enter(previous = new Map()) {
      entries.forEach(animation => animation.cancel()); entries.clear();
      if (reduceMotion.matches) return;
      let index = 0;
      rowsEl.querySelectorAll('.mbt-row').forEach(row => {
        const item = row.parentElement, rect = item.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > innerHeight) return;
        const oldY = previous.get(row.dataset.file);
        const offset = oldY === undefined ? settings.list.distance : Math.max(-80, Math.min(80, oldY - rect.top));
        const animation = item.animate([
          { transform: `translateY(${offset}px)`, opacity: oldY === undefined ? 0 : 1 },
          { transform: 'translateY(0)', opacity: 1 }
        ], { duration: settings.list.duration * 1000 / settings.playback.speed, delay: Math.min(index++, 10) * settings.list.stagger * 1000 / settings.playback.speed, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'backwards' });
        entries.add(animation);
        animation.onfinish = () => entries.delete(animation);
      });
    }
    function reset() {
      timers.forEach(clearTimeout); timers.clear();
      entries.forEach(animation => animation.cancel()); entries.clear();
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null; moving.clear(); activeRow = null; rowsEl.removeAttribute('data-active');
    }
    function configure(values) {
      const before = settings;
      settings = { ...settings, ...values };
      page.style.setProperty('--portrait-size', `${size()}px`);
      page.style.setProperty('--portrait-gap', `${settings.portrait.gap}px`);
      page.style.setProperty('--hover-duration', `${settings.hover.duration / settings.playback.speed}s`);
      page.style.setProperty('--hover-offset', `${settings.hover.offset}px`);
      page.style.setProperty('--neighbor-opacity', settings.hover.neighbors);
      page.style.setProperty('--hover-wash', settings.hover.wash);
      page.dataset.hover = settings.hover.treatment;
      page.toggleAttribute('data-hover-arrow', settings.hover.arrow);
      if (activeRow) openPortrait(activeRow, true);
      if (JSON.stringify(before.list) !== JSON.stringify(settings.list)) enter();
    }
    function replay() {
      activate(null);
      rowsEl.querySelectorAll('.mbt-row').forEach(row => {
        if (!row._motion?.el) return;
        row._motion.w = row._motion.h = row._motion.vw = row._motion.vh = 0; draw(row);
      });
      enter();
      const visible = [...rowsEl.querySelectorAll('.mbt-row')].find(row => row._motion?.el && row.getBoundingClientRect().top >= 0 && row.getBoundingClientRect().bottom < innerHeight);
      if (visible) {
        schedule(() => activate(visible), reduceMotion.matches ? 0 : 350 / settings.playback.speed);
        schedule(() => { if (activeRow === visible && !visible._motion.hovered && document.activeElement !== visible) activate(null); }, 2200 / settings.playback.speed);
      }
    }
    reduceMotion.addEventListener('change', () => {
      if (reduceMotion.matches) {
        entries.forEach(animation => animation.cancel()); entries.clear();
        [...moving].forEach(row => openPortrait(row, row._motion.open));
      }
    });
    window.addEventListener('resize', () => configure(settings));
    configure(settings);
    // Generic width springs for the search line and the margin slot. Each
    // target owns {el, value, velocity, target, done}; they share the panel spring.
    const panels = new Map();
    let panelFrame = null, panelLast = 0;
    function panelTick(now) {
      const dt = Math.min(.064, (now - panelLast) / 1000) * settings.playback.speed;
      panelLast = now;
      const spring = settings.panel.spring;
      const damping = Math.max(.1, 1 - (spring.bounce || 0));
      const omega = 6.6 / Math.max(.08, spring.visualDuration || .4);
      let live = false;
      panels.forEach(p => {
        if (p.delay > 0) { p.delay -= dt; live = true; return; }
        [p.value, p.velocity] = springStep(p.value, p.velocity, p.target, dt, omega, damping);
        if (Math.abs(p.value - p.target) < .15 && Math.abs(p.velocity) < 1) { p.value = p.target; p.velocity = 0; }
        else live = true;
        p.apply(p.value);
      });
      panelFrame = live ? requestAnimationFrame(panelTick) : null;
      if (!live) panels.forEach(p => p.onSettle && p.onSettle(p.value));
    }
    function animateWidth(key, el, target, { apply, delay = 0, onSettle } = {}) {
      const p = panels.get(key) || { value: 0, velocity: 0 };
      p.el = el; p.target = target; p.delay = delay; p.onSettle = onSettle;
      p.apply = apply || (v => { el.style.width = `${Math.max(0, v)}px`; });
      panels.set(key, p);
      if (reduceMotion.matches) { p.value = target; p.velocity = 0; p.apply(target); onSettle && onSettle(target); return; }
      if (panelFrame === null) { panelLast = performance.now(); panelFrame = requestAnimationFrame(panelTick); }
    }
    return { configure, capture, reset, bindRows, enter, replay, animateWidth, get settings() { return settings; } };
  };
})();
