/* ============================================================
   IZINIX — shared interaction layer
   Lenis inertia scroll + GSAP/ScrollTrigger choreography,
   custom cursor, magnetic elements, glass spotlights.
   Every feature is guarded so a blocked CDN never breaks pages.
   ============================================================ */
(function () {
  'use strict';

  var docEl = document.documentElement;
  docEl.classList.remove('no-js');
  docEl.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var hasGSAP = typeof gsap !== 'undefined';
  var hasST = hasGSAP && typeof ScrollTrigger !== 'undefined';

  if (hasST) gsap.registerPlugin(ScrollTrigger);

  /* ============================================================
     LOADER — brief curtain, lifts once fonts settle
     ============================================================ */
  var loader = document.querySelector('.loader');
  var pageReady = false;
  function liftLoader() {
    if (pageReady) return;
    pageReady = true;
    if (loader) loader.classList.add('is-done');
    playHeroIntro();
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { setTimeout(liftLoader, 350); });
  }
  window.addEventListener('load', function () { setTimeout(liftLoader, 500); });
  setTimeout(liftLoader, 2200); // hard cap — never trap the user

  /* ============================================================
     LENIS — inertia scrolling, driven by the GSAP ticker
     ============================================================ */
  var lenis = null;
  if (typeof Lenis !== 'undefined' && !reduceMotion) {
    lenis = new Lenis({
      duration: 1.15,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true
    });
    if (hasST) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(time) { lenis.raf(time); requestAnimationFrame(raf); })(0);
    }
  }

  function scrollToTarget(target) {
    if (lenis) lenis.scrollTo(target, { offset: -90 });
    else if (target && target.scrollIntoView) target.scrollIntoView({ behavior: 'smooth' });
  }

  // in-page anchors ride the smooth scroll
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var el = document.querySelector(a.getAttribute('href'));
    if (el) { e.preventDefault(); scrollToTarget(el); }
  });

  /* ============================================================
     NAV — scrolled state + mobile menu
     ============================================================ */
  var nav = document.querySelector('.site-nav');
  function onScrollNav() {
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  var burger = document.querySelector('.nav-burger');
  if (burger) {
    burger.addEventListener('click', function () {
      var open = docEl.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (lenis) open ? lenis.stop() : lenis.start();
    });
    document.querySelectorAll('.mobile-menu a').forEach(function (a) {
      a.addEventListener('click', function () {
        docEl.classList.remove('nav-open');
        if (lenis) lenis.start();
      });
    });
  }

  /* ============================================================
     CUSTOM CURSOR — dot leads, ring trails with inertia
     ============================================================ */
  if (finePointer && !reduceMotion) {
    document.body.classList.add('has-custom-cursor');
    var dot = document.createElement('div');
    dot.className = 'cursor-dot';
    var ring = document.createElement('div');
    ring.className = 'cursor-ring';
    ring.innerHTML = '<span class="cursor-label"></span>';
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    var label = ring.querySelector('.cursor-label');

    var mx = -100, my = -100, rx = -100, ry = -100;
    window.addEventListener('pointermove', function (e) {
      mx = e.clientX; my = e.clientY;
    }, { passive: true });

    (function cursorLoop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      dot.style.transform = 'translate(' + (mx - 3) + 'px,' + (my - 3) + 'px)';
      ring.style.transform = 'translate(' + (rx - ring.offsetWidth / 2) + 'px,' + (ry - ring.offsetHeight / 2) + 'px)';
      requestAnimationFrame(cursorLoop);
    })();

    document.addEventListener('pointerover', function (e) {
      var labelled = e.target.closest('[data-cursor-label]');
      var interactive = e.target.closest('a, button, input, select, textarea, label');
      if (labelled) {
        ring.classList.add('has-label');
        ring.classList.remove('is-hover');
        label.textContent = labelled.getAttribute('data-cursor-label');
      } else if (interactive) {
        ring.classList.add('is-hover');
        ring.classList.remove('has-label');
      } else {
        ring.classList.remove('is-hover', 'has-label');
      }
    });
  }

  /* ============================================================
     MAGNETIC ELEMENTS — [data-magnetic]
     ============================================================ */
  if (finePointer && !reduceMotion && hasGSAP) {
    document.querySelectorAll('[data-magnetic]').forEach(function (el) {
      var strength = parseFloat(el.getAttribute('data-magnetic')) || 0.3;
      el.addEventListener('pointermove', function (e) {
        var b = el.getBoundingClientRect();
        gsap.to(el, {
          x: (e.clientX - b.left - b.width / 2) * strength,
          y: (e.clientY - b.top - b.height / 2) * strength,
          duration: 0.5, ease: 'power3.out'
        });
      });
      el.addEventListener('pointerleave', function () {
        gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
      });
    });
  }

  /* ============================================================
     GLASS SPOTLIGHT — cursor-tracked highlight on .glass-spot
     ============================================================ */
  document.querySelectorAll('.glass-spot').forEach(function (card) {
    if (!card.querySelector('.spot')) {
      var s = document.createElement('div');
      s.className = 'spot';
      card.prepend(s);
    }
    card.addEventListener('pointermove', function (e) {
      var b = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - b.left) + 'px');
      card.style.setProperty('--my', (e.clientY - b.top) + 'px');
    }, { passive: true });
  });

  /* ============================================================
     TILT — subtle 3D lean on [data-tilt] cards
     ============================================================ */
  if (finePointer && !reduceMotion && hasGSAP) {
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var b = el.getBoundingClientRect();
        var px = (e.clientX - b.left) / b.width - 0.5;
        var py = (e.clientY - b.top) / b.height - 0.5;
        gsap.to(el, {
          rotateY: px * 6, rotateX: -py * 6,
          transformPerspective: 900,
          duration: 0.6, ease: 'power2.out'
        });
      });
      el.addEventListener('pointerleave', function () {
        gsap.to(el, { rotateY: 0, rotateX: 0, duration: 0.9, ease: 'elastic.out(1, 0.5)' });
      });
    });
  }

  /* ============================================================
     HERO INTRO — staggered line masks after the loader lifts
     ============================================================ */
  function playHeroIntro() {
    var lines = document.querySelectorAll('.hero .h-line-inner');
    var extras = document.querySelectorAll('.hero [data-hero-fade]');
    if (reduceMotion || !hasGSAP) {
      document.querySelectorAll('.hero').forEach(function (h) { h.classList.add('anim-done'); });
      extras.forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; });
      return;
    }
    var tl = gsap.timeline({ delay: 0.15 });
    if (lines.length) {
      tl.to(lines, {
        y: 0, duration: 1.2, ease: 'power4.out', stagger: 0.09,
        onComplete: function () {
          document.querySelectorAll('.hero').forEach(function (h) { h.classList.add('anim-done'); });
          lines.forEach(function (l) { l.style.transform = ''; });
        }
      }, 0.1);
    }
    if (extras.length) {
      gsap.set(extras, { opacity: 0, y: 26 });
      tl.to(extras, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.08 }, 0.55);
    }
  }
  if (reduceMotion || !hasGSAP) {
    document.querySelectorAll('.hero').forEach(function (h) { h.classList.add('anim-done'); });
  }

  /* ============================================================
     SCROLL REVEALS — [data-reveal], staggered by data-reveal-delay
     ============================================================ */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-revealed'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var delay = parseFloat(el.getAttribute('data-reveal-delay') || 0);
          setTimeout(function () { el.classList.add('is-revealed'); }, delay * 1000);
          io.unobserve(el);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  /* split-line headings that reveal on scroll (outside hero) */
  if (hasST && !reduceMotion) {
    document.querySelectorAll('[data-lines-reveal]').forEach(function (head) {
      var inners = head.querySelectorAll('.h-line-inner');
      if (!inners.length) return;
      gsap.to(inners, {
        y: 0, duration: 1.15, ease: 'power4.out', stagger: 0.09,
        scrollTrigger: { trigger: head, start: 'top 82%' },
        onComplete: function () {
          head.classList.add('anim-done');
          inners.forEach(function (l) { l.style.transform = ''; });
        }
      });
    });
  } else {
    document.querySelectorAll('[data-lines-reveal]').forEach(function (h) { h.classList.add('anim-done'); });
  }

  /* ============================================================
     QUOTE SCRUB — words ink themselves in as you scroll
     ============================================================ */
  document.querySelectorAll('[data-quote-scrub]').forEach(function (quote) {
    var text = quote.textContent.trim();
    quote.textContent = '';
    text.split(/\s+/).forEach(function (word, idx, arr) {
      var span = document.createElement('span');
      span.className = 'qword';
      span.textContent = word;
      quote.appendChild(span);
      if (idx < arr.length - 1) quote.appendChild(document.createTextNode(' '));
    });
    var words = quote.querySelectorAll('.qword');
    if (hasST && !reduceMotion) {
      gsap.to(words, {
        opacity: 1, stagger: 0.06, ease: 'none',
        scrollTrigger: {
          trigger: quote,
          start: 'top 78%',
          end: 'bottom 45%',
          scrub: 0.6
        }
      });
    } else {
      words.forEach(function (w) { w.style.opacity = 1; });
    }
  });

  /* ============================================================
     PARALLAX — [data-parallax="0.2"] drifts against scroll
     ============================================================ */
  if (hasST && !reduceMotion) {
    document.querySelectorAll('[data-parallax]').forEach(function (el) {
      var speed = parseFloat(el.getAttribute('data-parallax')) || 0.2;
      gsap.fromTo(el,
        { yPercent: speed * 22 },
        {
          yPercent: -speed * 22, ease: 'none',
          scrollTrigger: {
            trigger: el.closest('section') || el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
    });

    // hero canvas drifts up + fades as the page leaves it behind
    var heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
      gsap.to(heroBg, {
        yPercent: 18, opacity: 0.25, ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }
  }

  /* ============================================================
     PROCESS — pinned horizontal scroll on desktop
     ============================================================ */
  var processTrack = document.querySelector('.process-track');
  if (processTrack && (!hasST || reduceMotion)) {
    docEl.classList.add('no-scrolltrigger');
  }
  if (processTrack && hasST && !reduceMotion) {
    ScrollTrigger.matchMedia({
      '(min-width: 901px)': function () {
        var pin = document.querySelector('.process-pin');
        var bar = document.querySelector('.process-progress .bar');
        var getDistance = function () {
          return processTrack.scrollWidth - document.documentElement.clientWidth + 80;
        };
        var tween = gsap.to(processTrack, {
          x: function () { return -getDistance(); },
          ease: 'none',
          scrollTrigger: {
            trigger: pin,
            start: 'top top',
            end: function () { return '+=' + getDistance(); },
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: function (self) {
              if (bar) bar.style.transform = 'scaleX(' + self.progress + ')';
            }
          }
        });
        return function () { tween.scrollTrigger && tween.scrollTrigger.kill(); };
      }
    });
  }

  /* ============================================================
     COUNTERS — [data-count] roll up when visible
     ============================================================ */
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var end = parseFloat(el.getAttribute('data-count'));
    if (isNaN(end)) return;
    if (!hasST || reduceMotion) { el.textContent = end; return; }
    var obj = { v: 0 };
    gsap.to(obj, {
      v: end, duration: 1.6, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%' },
      onUpdate: function () { el.textContent = Math.round(obj.v); }
    });
  });

  /* ============================================================
     SCENARIO PANELS (work page) — before fogs in, after snaps in,
     hairline draws between them
     ============================================================ */
  document.querySelectorAll('.scenario').forEach(function (panel) {
    var before = panel.querySelector('.scenario-col--before');
    var after = panel.querySelector('.scenario-col--after');
    if (!hasST || reduceMotion) { panel.classList.add('is-revealed-panel'); return; }
    ScrollTrigger.create({
      trigger: panel,
      start: 'top 72%',
      once: true,
      onEnter: function () {
        panel.classList.add('is-revealed-panel');
        if (before) gsap.fromTo(before.children, { opacity: 0, x: -24 },
          { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08 });
        if (after) gsap.fromTo(after.children, { opacity: 0, x: 24 },
          { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, delay: 0.25 });
      }
    });
  });

  /* ============================================================
     CONTACT FORM — static-site submit: validate, then confirm
     ============================================================ */
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var grid = form.querySelector('.form-grid');
      var success = document.getElementById('form-success');
      var name = (form.querySelector('#f-name') || {}).value || '';
      var firstName = name.trim().split(/\s+/)[0];
      if (firstName) {
        var slot = success.querySelector('[data-name-slot]');
        if (slot) slot.textContent = firstName + ', we';
      }
      if (hasGSAP && !reduceMotion) {
        gsap.to(grid, {
          opacity: 0, y: -16, duration: 0.45, ease: 'power2.in',
          onComplete: function () {
            grid.style.display = 'none';
            success.classList.add('is-visible');
            gsap.fromTo(success, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });
          }
        });
      } else {
        grid.style.display = 'none';
        success.classList.add('is-visible');
      }
    });
  }

  /* ============================================================
     FOOTER YEAR
     ============================================================ */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* keep ScrollTrigger honest once everything has loaded */
  if (hasST) {
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }
})();
