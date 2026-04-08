/* ═══════════════════════════════════════════════════════════════
   Ahmed Nady Portfolio — script.js
   Pure Vanilla JS — No libraries — GitHub Pages Ready
═══════════════════════════════════════════════════════════════ */

'use strict';

/* ════════════════════════════════════
   1. NAVBAR — scroll + hamburger
════════════════════════════════════ */
(function () {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const links     = navLinks.querySelectorAll('.nav-link');

  /* Solid on scroll */
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveLink();
    toggleScrollTop();
  }, { passive: true });

  /* Hamburger toggle */
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  /* Close on link click */
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* Active link based on scroll */
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 160) current = sec.id;
    });
    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }
})();


/* ════════════════════════════════════
   2. SCROLL-TO-TOP BUTTON
════════════════════════════════════ */
const scrollTopBtn = document.getElementById('scrollTop');

function toggleScrollTop() {
  if (scrollTopBtn) {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
  }
}

if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ════════════════════════════════════
   3. FOOTER YEAR
════════════════════════════════════ */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* ════════════════════════════════════
   4. INTERSECTION OBSERVER — reveal + skills
════════════════════════════════════ */
const observerOptions = {
  root: null,
  rootMargin: '0px 0px -80px 0px',
  threshold: 0.12
};

/* 4a. Reveal fade-in for all .reveal elements */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger children slightly
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, entry.target.dataset.delay || 0);
      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.dataset.delay = (i % 4) * 80; // stagger within visible batch
  revealObserver.observe(el);
});


/* 4b. Circular ring fills */
const ringObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fills = entry.target.querySelectorAll('.ring-fill');
      fills.forEach(fill => {
        const pct = parseFloat(fill.dataset.pct) || 0;
        const circumference = 327; // 2π×52
        const dashOffset = circumference - (pct / 100) * circumference;
        // Delay slightly for visual delight
        setTimeout(() => {
          fill.style.strokeDashoffset = dashOffset;
        }, 200);
      });
      ringObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.skill-ring-card').forEach(card => {
  ringObserver.observe(card);
});


/* 4c. Skill bar fills */
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bars = entry.target.querySelectorAll('.skill-bar-fill');
      bars.forEach((bar, i) => {
        const w = bar.dataset.width || 0;
        setTimeout(() => {
          bar.style.width = w + '%';
        }, i * 100);
      });
      barObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.skill-bars').forEach(el => barObserver.observe(el));


/* ════════════════════════════════════
   5. COUNTER ANIMATION (about stats)
════════════════════════════════════ */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el      = entry.target;
      const target  = parseInt(el.dataset.target, 10);
      const duration = 1600;
      const start    = performance.now();

      function update(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out quad
        const eased    = 1 - (1 - progress) * (1 - progress);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target;
      }

      requestAnimationFrame(update);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-target]').forEach(el => {
  counterObserver.observe(el);
});


/* ════════════════════════════════════
   6. BEFORE/AFTER IMAGE SLIDER
════════════════════════════════════ */
document.querySelectorAll('.before-after-slider').forEach(slider => {
  const afterEl = slider.querySelector('.ba-after');
  const handle  = slider.querySelector('.ba-handle');
  let isDragging = false;

  function setPosition(x) {
    const rect = slider.getBoundingClientRect();
    let pct = ((x - rect.left) / rect.width) * 100;
    pct = Math.max(2, Math.min(98, pct));

    // Clip the "after" image from the left
    afterEl.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    handle.style.left      = pct + '%';
  }

  /* Mouse events */
  slider.addEventListener('mousedown', (e) => {
    isDragging = true;
    setPosition(e.clientX);
    e.preventDefault();
  });
  window.addEventListener('mousemove', (e) => {
    if (isDragging) setPosition(e.clientX);
  });
  window.addEventListener('mouseup', () => { isDragging = false; });

  /* Touch events */
  slider.addEventListener('touchstart', (e) => {
    isDragging = true;
    setPosition(e.touches[0].clientX);
  }, { passive: true });
  window.addEventListener('touchmove', (e) => {
    if (isDragging) setPosition(e.touches[0].clientX);
  }, { passive: true });
  window.addEventListener('touchend', () => { isDragging = false; });

  /* Init at 50% */
  setPosition(slider.getBoundingClientRect().left + slider.offsetWidth / 2);
});


/* ════════════════════════════════════
   7. SMOOTH SCROLL (fallback for older browsers)
════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ════════════════════════════════════
   8. LAZY LOADING (native + polyfill)
════════════════════════════════════ */
// Already handled via loading="lazy" attr on images.
// This is a fallback IntersectionObserver for browsers that don't support native lazy loading.
if (!('loading' in HTMLImageElement.prototype)) {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) img.src = img.dataset.src;
        imageObserver.unobserve(img);
      }
    });
  });
  lazyImages.forEach(img => imageObserver.observe(img));
}


/* ════════════════════════════════════
   9. CURSOR GLOW (desktop only)
════════════════════════════════════ */
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip touch devices

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,200,83,0.06) 0%, transparent 65%);
    pointer-events: none;
    transform: translate(-50%, -50%);
    transition: left 0.12s ease, top 0.12s ease;
    z-index: 0;
    will-change: left, top;
  `;
  document.body.appendChild(glow);

  window.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });
})();


/* ════════════════════════════════════
   10. PROJECT CARD — tilt on hover (desktop)
════════════════════════════════════ */
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-10px) perspective(800px) rotateY(${dx * 4}deg) rotateX(${-dy * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ════════════════════════════════════
   11. Init — re-run slider positions on resize
════════════════════════════════════ */
window.addEventListener('resize', () => {
  document.querySelectorAll('.before-after-slider').forEach(slider => {
    const afterEl = slider.querySelector('.ba-after');
    const handle  = slider.querySelector('.ba-handle');
    afterEl.style.clipPath = 'inset(0 50% 0 0)';
    handle.style.left      = '50%';
  });
}, { passive: true });
