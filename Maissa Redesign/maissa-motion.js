// Shared GSAP motion system for the Maissa pages.
// Pages load the GSAP CDN scripts in their <helmet>; this module wires them up.
// Registering a new instance kills the previous one, so hot reloads self-heal.

function ready(tries, done, fail) {
  if (window.gsap && window.ScrollTrigger) return done();
  if (tries > 60) return fail();
  setTimeout(() => ready(tries + 1, done, fail), 100);
}

function revealAll() {
  document.querySelectorAll('[data-reveal],[data-split-lines]').forEach((el) => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
  const l = document.querySelector('[data-loader]');
  if (l) l.style.display = 'none';
}

export function initPageMotion(opts) {
  const o = opts || {};
  if (window.__maissaMotion) {
    try { window.__maissaMotion.kill(); } catch (e) {}
  }

  const state = { splits: [], obs: null, smoother: null, drags: [], onLink: null, killed: false };
  const api = {
    kill() {
      state.killed = true;
      if (state.obs) state.obs.kill();
      state.drags.forEach((d) => d && d.kill && d.kill());
      if (state.smoother) state.smoother.kill();
      if (window.ScrollTrigger) window.ScrollTrigger.getAll().forEach((t) => t.kill());
      state.splits.forEach((s) => { try { s.revert(); } catch (e) {} });
      if (state.onLink) document.removeEventListener('click', state.onLink);
      if (window.__maissaMotion === api) window.__maissaMotion = null;
    },
    refresh() { if (window.ScrollTrigger) window.ScrollTrigger.refresh(); },
  };
  window.__maissaMotion = api;

  ready(0, () => {
    if (state.killed) return;
    try { build(o, state); } catch (e) { revealAll(); }
  }, revealAll);

  return api;
}

function build(o, state) {
  const g = window.gsap;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  g.registerPlugin.apply(g, [
    window.ScrollTrigger, window.ScrollSmoother, window.ScrollToPlugin, window.Observer,
    window.SplitText, window.ScrambleTextPlugin, window.Flip, window.Draggable,
    window.InertiaPlugin, window.MorphSVGPlugin, window.DrawSVGPlugin, window.MotionPathPlugin,
  ].filter(Boolean));

  // Bail out of scroll hijacking if frames are throttled.
  let ticked = false;
  requestAnimationFrame(() => { ticked = true; });
  setTimeout(() => { if (!ticked) revealAll(); }, 600);

  // Loading screen.
  const loader = document.querySelector('[data-loader]');
  const intro = g.timeline();
  if (loader) {
    intro.from('[data-loader-mark]', { yPercent: 40, opacity: 0, duration: .8, ease: 'power3.out' });
    if (document.querySelector('[data-loader-line]') && window.DrawSVGPlugin) {
      intro.from('[data-loader-line]', { drawSVG: '50% 50%', duration: 1, ease: 'power2.inOut' }, .1);
    }
    intro.from('[data-loader-note]', { opacity: 0, duration: .6 }, .45)
      .to(loader, { yPercent: -100, duration: .9, ease: 'expo.inOut' }, '+=.3')
      .set(loader, { display: 'none' });
  }
  if (document.querySelector('[data-intro]')) {
    intro.from('[data-intro]', { y: 26, opacity: 0, duration: 1, ease: 'power3.out', stagger: .08 }, loader ? '-=.55' : 0);
  }

  // ScrollSmoother — marketing pages only.
  if (o.smooth && window.ScrollSmoother && !reduced) {
    requestAnimationFrame(() => {
      if (state.killed) return;
      try {
        if (window.ScrollSmoother.get()) return;
        state.smoother = window.ScrollSmoother.create({
          wrapper: '[data-smooth-wrapper]', content: '[data-smooth-content]',
          smooth: 1.1, effects: false, normalizeScroll: false,
        });
      } catch (e) {}
    });
  }

  // SplitText headings, by line.
  if (window.SplitText) {
    document.querySelectorAll('[data-split-lines]').forEach((el) => {
      const s = new window.SplitText(el, { type: 'lines' });
      state.splits.push(s);
      g.from(s.lines, {
        yPercent: 60, opacity: 0, duration: 1, stagger: .09, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      });
    });
  }

  // ScrollTrigger reveals.
  g.utils.toArray('[data-reveal]').forEach((el) => {
    g.from(el, {
      y: 32, opacity: 0, duration: 1.05, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%' },
    });
  });

  // DrawSVG any marked stroke.
  if (window.DrawSVGPlugin) {
    g.utils.toArray('[data-draw]').forEach((el) => {
      g.from(el, {
        drawSVG: '0%', duration: 1.8, ease: 'power2.inOut',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      });
    });
  }

  // MotionPath: run a mote along a marked path.
  const path = document.querySelector('[data-path]');
  const mote = document.querySelector('[data-mote]');
  if (path && mote && window.MotionPathPlugin) {
    g.to(mote, { opacity: 1, duration: .6, scrollTrigger: { trigger: path, start: 'top 75%' } });
    g.to(mote, {
      duration: o.moteDuration || 20, repeat: -1, ease: 'none',
      motionPath: { path, align: path, alignOrigin: [0.5, 0.5] },
    });
  }

  // MorphSVG on scrub.
  const mFrom = document.querySelector('[data-morph-from]');
  const mTo = document.querySelector('[data-morph-to]');
  if (mFrom && mTo && window.MorphSVGPlugin) {
    g.to(mFrom, {
      morphSVG: mTo, ease: 'none',
      scrollTrigger: { trigger: mFrom, start: 'top bottom', end: 'bottom top', scrub: 1 },
    });
  }

  // ScrambleText.
  if (window.ScrambleTextPlugin) {
    g.utils.toArray('[data-scramble]').forEach((el) => {
      const text = el.textContent;
      g.to(el, {
        duration: 1.1, scrambleText: { text, chars: 'upperCase', speed: .5, revealDelay: .2 },
        scrollTrigger: { trigger: el, start: 'top 92%' },
      });
    });
  }

  // Observer — hide the marked bar on scroll-down.
  const bar = document.querySelector('[data-hide-on-scroll]');
  if (bar && window.Observer) {
    state.obs = window.Observer.create({
      target: window, type: 'wheel,touch,scroll', tolerance: 16,
      onDown: () => g.to(bar, { yPercent: -130, opacity: 0, duration: .45, ease: 'power2.out' }),
      onUp: () => g.to(bar, { yPercent: 0, opacity: 1, duration: .45, ease: 'power2.out' }),
    });
  }

  // ScrollTo — glide to anchors.
  state.onLink = (e) => {
    const a = e.target.closest('[data-scroll-link]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (!id || id.charAt(0) !== '#') return;
    const target = id === '#top' ? 0 : document.querySelector(id);
    if (!target && target !== 0) return;
    e.preventDefault();
    if (state.smoother) state.smoother.scrollTo(target, true, 'top 0px');
    else g.to(window, { duration: 1.1, ease: 'power3.inOut', scrollTo: target === 0 ? 0 : { y: target, offsetY: 0 } });
  };
  document.addEventListener('click', state.onLink);

  // Draggable + Inertia on marked elements.
  if (window.Draggable) {
    document.querySelectorAll('[data-drag]').forEach((el) => {
      const bounds = el.getAttribute('data-drag-bounds');
      const d = window.Draggable.create(el, {
        type: el.getAttribute('data-drag-axis') || 'x,y',
        bounds: bounds ? document.querySelector(bounds) : null,
        inertia: !!window.InertiaPlugin,
        edgeResistance: .72,
        onPress() { g.to(this.target, { scale: 1.03, duration: .3 }); },
        onRelease() { g.to(this.target, { scale: 1, duration: .4, ease: 'power2.out' }); },
      });
      state.drags.push(d && d[0]);
    });
  }

  window.ScrollTrigger.refresh();
}

// Flip helper for layout toggles.
export function flipLayout(selector, apply) {
  const items = document.querySelectorAll(selector);
  if (!window.Flip || !items.length) { apply(); return; }
  const st = window.Flip.getState(items);
  apply();
  requestAnimationFrame(() => {
    window.Flip.from(st, {
      duration: .8, ease: 'power3.inOut', absolute: true, stagger: .06,
      onComplete: () => { if (window.ScrollTrigger) window.ScrollTrigger.refresh(); },
    });
  });
}
