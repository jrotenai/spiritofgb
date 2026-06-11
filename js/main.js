/* =================================================================
   SPIRIT OF GB — Interactions
   ================================================================= */
(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header shadow on scroll ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    if (window.scrollY > 24) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile nav ---------- */
  const toggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  const closeMobile = () => {
    toggle.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      if (open) { closeMobile(); }
      else {
        toggle.setAttribute('aria-expanded', 'true');
        mobileNav.classList.add('open');
        mobileNav.setAttribute('aria-hidden', 'false');
      }
    });
    mobileNav.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMobile));
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMobile(); });
  }

  /* ---------- "More" dropdown ---------- */
  const moreWrap = document.querySelector('.nav-more');
  const moreBtn = document.querySelector('.nav-more-btn');
  if (moreWrap && moreBtn) {
    const closeMore = () => { moreWrap.classList.remove('open'); moreBtn.setAttribute('aria-expanded', 'false'); };
    moreBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = moreWrap.classList.toggle('open');
      moreBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', (e) => { if (!moreWrap.contains(e.target)) closeMore(); });
    moreWrap.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeMore(); moreBtn.focus(); } });
    moreWrap.querySelectorAll('.nav-dropdown a').forEach((a) => a.addEventListener('click', closeMore));
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (prefersReduced || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // subtle stagger for siblings entering together
          const delay = Math.min(i * 60, 240);
          setTimeout(() => entry.target.classList.add('in'), delay);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('.stat-num[data-count]');
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const isRaw = el.dataset.raw === '1';        // e.g. years — no thousands separator
    const duration = 1600;
    let startTime = null;

    const format = (val) => {
      if (isRaw) return Math.round(val).toString();
      if (decimals > 0) return val.toFixed(decimals);
      return Math.round(val).toLocaleString('en-GB');
    };

    if (prefersReduced) { el.textContent = format(target); return; }

    const step = (ts) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = format(target * eased);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = format(target);
    };
    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { animateCount(entry.target); cio.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach((c) => cio.observe(c));
  } else {
    counters.forEach((c) => { c.textContent = c.dataset.count; });
  }

  /* ---------- Record bars fill ---------- */
  const bars = document.querySelectorAll('.bar-fill[data-width]');
  if ('IntersectionObserver' in window) {
    const bio = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          requestAnimationFrame(() => { el.style.width = el.dataset.width + '%'; });
          bio.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    bars.forEach((b) => bio.observe(b));
  } else {
    bars.forEach((b) => { b.style.width = b.dataset.width + '%'; });
  }

  /* ---------- Enquiry form ----------
     No backend yet: on submit we validate, then open the visitor's email
     client with a pre-filled message to info@spiritofgb.co.uk.
     To route submissions to an inbox instead, point form.action at a
     service like Formspree/Netlify Forms and remove this handler. */
  const form = document.getElementById('enquiryForm');
  const status = document.getElementById('formStatus');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      status.className = 'form-status';

      if (!form.checkValidity()) {
        form.reportValidity();
        status.textContent = 'Please complete the required fields.';
        status.classList.add('err');
        return;
      }

      const get = (id) => (form.elements[id].value || '').trim();
      const first = get('firstName');
      const last = get('lastName');
      const reason = get('reason');

      const subject = 'Spirit of GB enquiry (' + reason + ')';
      const body =
        'Name: ' + first + ' ' + last + '\n' +
        'Email: ' + get('email') + '\n' +
        'Phone: ' + get('phone') + '\n' +
        'Reason for enquiry: ' + reason + '\n\n' +
        'Message:\n' + get('message') + '\n';

      window.location.href =
        'mailto:info@spiritofgb.co.uk' +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      status.textContent = 'Thanks ' + first + '. Your email app should open with the message ready to send.';
      status.classList.add('ok');
      form.reset();
    });
  }

  /* ---------- Gallery lightbox ---------- */
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const lb = document.getElementById('lightbox');
  if (lb && galleryItems.length) {
    const lbImg = document.getElementById('lbImg');
    const lbCounter = document.getElementById('lbCounter');
    const lbClose = document.getElementById('lbClose');
    const lbPrev = document.getElementById('lbPrev');
    const lbNext = document.getElementById('lbNext');
    let idx = 0;
    let lastFocus = null;

    const show = (i) => {
      idx = (i + galleryItems.length) % galleryItems.length;
      const item = galleryItems[idx];
      const thumb = item.querySelector('img');
      lbImg.src = item.dataset.full || (thumb && thumb.src) || '';
      lbImg.alt = (thumb && thumb.alt) || '';
      lbCounter.textContent = (idx + 1) + ' / ' + galleryItems.length;
    };
    const open = (i) => {
      lastFocus = document.activeElement;
      show(i);
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      lbClose.focus();
    };
    const close = () => {
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      lbImg.src = '';
      if (lastFocus) lastFocus.focus();
    };

    galleryItems.forEach((item, i) => item.addEventListener('click', () => open(i)));
    lbClose.addEventListener('click', close);
    lbPrev.addEventListener('click', () => show(idx - 1));
    lbNext.addEventListener('click', () => show(idx + 1));
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    window.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(idx - 1);
      else if (e.key === 'ArrowRight') show(idx + 1);
    });
  }
})();
