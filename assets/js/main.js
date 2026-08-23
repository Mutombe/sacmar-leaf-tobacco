/* Sacmar Leaf Tobacco — site behaviour
   Vanilla, no dependencies. Progressive: everything degrades gracefully. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------- header -- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ------------------------------------------------------ mobile nav -- */
  var toggle = document.querySelector('.nav-toggle');
  var mobileNav = document.querySelector('.mobile-nav');
  if (toggle && mobileNav) {
    var setNav = function (open) {
      document.body.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      mobileNav.setAttribute('aria-hidden', String(!open));
      document.body.style.overflow = open ? 'hidden' : '';
    };
    setNav(false);
    toggle.addEventListener('click', function () {
      setNav(!document.body.classList.contains('nav-open'));
    });
    mobileNav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) setNav(false);
    });
  }

  /* --------------------------------------------------------- reveals -- */
  var revealables = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduced) {
    Array.prototype.forEach.call(revealables, function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    Array.prototype.forEach.call(revealables, function (el) { io.observe(el); });
  }

  /* -------------------------------------------------------- counters -- */
  var counters = document.querySelectorAll('[data-count]');
  var runCount = function (el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = (el.getAttribute('data-decimals') | 0);
    var dur = 1500;
    if (reduced) { el.textContent = target.toFixed(decimals); return; }
    var start = null;
    var tick = function (ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (counters.length) {
    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(counters, runCount);
    } else {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { runCount(entry.target); cio.unobserve(entry.target); }
        });
      }, { threshold: 0.6 });
      Array.prototype.forEach.call(counters, function (el) { cio.observe(el); });
    }
  }

  /* ------------------------------------------------------------ year -- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* --------------------------------------- product deep-link into the form */
  /* products.html cards link here as ?product=lamina — preselect that option
     so the visitor does not have to re-pick what they just clicked. */
  var interest = document.getElementById('interest');
  if (interest) {
    var wanted = new URLSearchParams(window.location.search).get('product');
    var MAP = {
      lamina: 'Tobacco lamina',
      cutrag: 'Cut rag',
      stems: 'Tobacco stems',
      fines: 'Tobacco fines'
    };
    if (wanted && MAP[wanted]) {
      Array.prototype.forEach.call(interest.options, function (o) {
        if (o.text === MAP[wanted]) { interest.value = o.value || o.text; o.selected = true; }
      });
    }
  }

  /* ------------------------------------------------------ enquiry form */
  var form = document.querySelector('form[data-enquiry]');
  if (form) {
    var status = form.querySelector('.form__status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var endpoint = form.getAttribute('data-endpoint');
      var data = new FormData(form);

      // No backend wired up yet -> compose a mail draft so nothing is lost.
      if (!endpoint) {
        var lines = [];
        data.forEach(function (v, k) {
          if (String(v).trim()) lines.push(k.replace(/_/g, ' ').toUpperCase() + ': ' + v);
        });
        var subject = 'Website enquiry - ' + (data.get('company') || 'website');
        var href = 'mailto:sacrifice@sacmarleaftobacco.co.zw'
          + '?subject=' + encodeURIComponent(subject)
          + '&body=' + encodeURIComponent(lines.join('\n\n'));
        if (status) status.textContent = 'Opening your email client…';
        window.location.href = href;
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; }
      if (status) status.textContent = 'Sending…';

      fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error('Request failed');
          form.reset();
          if (status) status.textContent = 'Thank you — we will get back to you shortly.';
        })
        .catch(function () {
          if (status) status.textContent = 'Something went wrong. Please email sacrifice@sacmarleaftobacco.co.zw directly.';
        })
        .then(function () { if (btn) btn.disabled = false; });
    });
  }
})();
