/* ============================================
   GrowDirect Portfolio Site — main.js
   GA4 events, Formspree AJAX, mobile nav, sticky nav
   ============================================ */

(function () {
  'use strict';

  // --- Sticky nav border on scroll ---
  var nav = document.querySelector('.site-nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }

  // --- Mobile nav toggle ---
  var toggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.site-nav__links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
    });
  }

  // --- GA4 custom events ---
  function trackEvent(eventName, params) {
    if (typeof gtag === 'function') {
      gtag('event', eventName, params || {});
    }
  }

  // pillar_click — service card links on homepage
  document.querySelectorAll('[data-track="pillar"]').forEach(function (el) {
    el.addEventListener('click', function () {
      trackEvent('pillar_click', { pillar: el.dataset.pillar || 'unknown' });
    });
  });

  // email_click — any mailto link
  document.querySelectorAll('a[href^="mailto:"]').forEach(function (el) {
    el.addEventListener('click', function () {
      trackEvent('email_click');
    });
  });

  // cta_click — any CTA link
  document.querySelectorAll('[data-track="cta"]').forEach(function (el) {
    el.addEventListener('click', function () {
      trackEvent('cta_click', { label: el.dataset.label || '' });
    });
  });

  // --- Contact page: read ?from= param, set source + contextual headline ---
  var fromParam = new URLSearchParams(window.location.search).get('from');
  var sourceField = document.getElementById('source');
  var headline = document.getElementById('contact-headline');
  var subhead = document.getElementById('contact-subhead');
  if (fromParam && sourceField) {
    sourceField.value = fromParam;
    var copy = {
      'pos-platform':  { h: "Let's talk about your merchants",   p: 'POS analytics, loss prevention, Square integrations — tell me what you need.' },
      're-toolkit':    { h: 'Want something like this for your agents?', p: 'Neighborhood content, MLS data, lead capture — built for real estate.' },
      'membership':    { h: 'Have a membership organization that needs this?', p: 'Governance, GIS, elections, document management — tell me about your org.' }
    };
    if (copy[fromParam]) {
      if (headline) headline.textContent = copy[fromParam].h;
      if (subhead) subhead.textContent = copy[fromParam].p;
    }
  }

  // --- Formspree AJAX form submission ---
  var form = document.getElementById('contact-form');
  var successMsg = document.querySelector('.contact-form__success');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      }).then(function (response) {
        if (response.ok) {
          form.reset();
          if (successMsg) successMsg.classList.add('visible');
          trackEvent('contact_form_submit', { source: (sourceField && sourceField.value) || 'direct' });
        } else {
          window.location.href = 'mailto:gclyle@growdirect.io?subject=Contact%20from%20growdirect.io';
        }
      }).catch(function () {
        window.location.href = 'mailto:gclyle@growdirect.io?subject=Contact%20from%20growdirect.io';
      });
    });
  }
})();
