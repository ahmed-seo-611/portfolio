/* ════════════════════════════════════════
   أحمد نادي | Portfolio JavaScript
   3D icons · Scroll animations · Counters
   ════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────────
   1. SCROLL REVEAL
────────────────────────────────────────── */
(function initScrollReveal() {
  const els = document.querySelectorAll('[data-anim]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseInt(el.dataset.delay || 0);
      setTimeout(() => el.classList.add('in-view'), delay);
      io.unobserve(el);
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
})();


/* ──────────────────────────────────────────
   2. HERO PARTICLES
────────────────────────────────────────── */
(function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const COUNT = 18;
  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 6 + 3;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${Math.random() * 12 + 8}s;
      animation-delay: ${Math.random() * 10}s;
      opacity: ${Math.random() * 0.4 + 0.1};
    `;
    container.appendChild(p);
  }
})();


/* ──────────────────────────────────────────
   3. 3D ICON SPHERE (Hero)
────────────────────────────────────────── */
(function buildIconSphere() {
  const sphere = document.getElementById('iconSphere');
  if (!sphere) return;

  const icons = [
    { icon: 'fab fa-wordpress',   label: 'WordPress', color: '#21759b' },
    { icon: 'fas fa-search',      label: 'SEO',        color: '#c41230' },
    { icon: 'fab fa-figma',       label: 'Figma',      color: '#f24e1e' },
    { icon: 'fab fa-html5',       label: 'HTML5',      color: '#e34c26' },
    { icon: 'fab fa-css3-alt',    label: 'CSS3',       color: '#264de4' },
    { icon: 'fas fa-chart-line',  label: 'Analytics',  color: '#c9a84c' },
    { icon: 'fas fa-mobile-alt',  label: 'Responsive', color: '#22c55e' },
    { icon: 'fas fa-tachometer-alt', label: 'Speed',   color: '#f59e0b' },
  ];

  const radius = 140;
  const count  = icons.length;

  icons.forEach((item, i) => {
    const phi   = Math.acos(-1 + (2 * i) / count);
    const theta = Math.sqrt(count * Math.PI) * phi;
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    const el = document.createElement('div');
    el.className = 'orbit-icon';
    el.innerHTML = `<i class="${item.icon}"></i><span class="icon-label">${item.label}</span>`;
    const rgb = hexToRgb(item.color);
    el.style.cssText = `
      transform: translate3d(calc(${x}px - 30px), calc(${y}px - 30px), ${z}px);
      background: linear-gradient(135deg, rgba(${rgb}, 0.25), rgba(${rgb}, 0.08));
      border-color: rgba(${rgb}, 0.35);
      --glow-color: rgba(${rgb}, 0.5);
      box-shadow: 0 8px 32px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.2), 0 0 18px rgba(${rgb}, 0.2);
    `;
    el.querySelector('i').style.color = item.color;
    sphere.appendChild(el);
  });
})();

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `${r}, ${g}, ${b}`;
}


/* ──────────────────────────────────────────
   4. STATS COUNTER ANIMATION
────────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length) return;

  const io = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    counters.forEach(el => animateCount(el));
    io.disconnect();
  }, { threshold: 0.4 });

  io.observe(document.querySelector('.stats-section'));

  function animateCount(el) {
    const target = parseInt(el.dataset.target);
    let current  = 0;
    const step   = Math.ceil(target / 60);
    const timer  = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current === target && target > 9
        ? `+${current}`
        : current;
      if (current >= target) {
        el.textContent = target > 9 ? `+${target}` : target;
        clearInterval(timer);
      }
    }, 24);
  }
})();


/* ──────────────────────────────────────────
   5. SKILL BARS ANIMATION
────────────────────────────────────────── */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar');
  if (!bars.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const bar   = entry.target;
      const fill  = bar.querySelector('.skill-fill');
      const pct   = parseInt(bar.dataset.pct);
      setTimeout(() => {
        fill.style.width = pct + '%';
      }, 200);
      io.unobserve(bar);
    });
  }, { threshold: 0.3 });

  bars.forEach(b => io.observe(b));
})();


/* ──────────────────────────────────────────
   6. PANEL ICON CARDS — 3D TILT ON HOVER
────────────────────────────────────────── */
(function initTiltCards() {
  const cards = document.querySelectorAll('[data-tilt]');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `
        perspective(600px)
        rotateX(${-y * 18}deg)
        rotateY(${x * 18}deg)
        translateY(-8px)
      `;
      card.style.boxShadow = `${-x * 20}px ${-y * 20}px 40px rgba(196,18,48,0.25)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
})();


/* ──────────────────────────────────────────
   7. PROJECT CARDS — 3D TILT ON HOVER
────────────────────────────────────────── */
(function initProjectTilt() {
  const cards = document.querySelectorAll('.proj-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `
        perspective(800px)
        rotateX(${-y * 8}deg)
        rotateY(${x * 8}deg)
        translateY(-10px)
      `;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ──────────────────────────────────────────
   8. SKILL CARDS — 3D TILT ON HOVER
────────────────────────────────────────── */
(function initSkillTilt() {
  const cards = document.querySelectorAll('.skill-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `
        perspective(700px)
        rotateX(${-y * 10}deg)
        rotateY(${x * 10}deg)
        translateY(-12px)
      `;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ──────────────────────────────────────────
   9. PROJECT TABS SWITCHER
────────────────────────────────────────── */
function switchProj(id, btn) {
  // Hide all panels
  document.querySelectorAll('.proj-panel').forEach(p => p.classList.remove('active'));
  // Deactivate all tabs
  document.querySelectorAll('.proj-tab').forEach(t => t.classList.remove('active'));
  // Show target
  const panel = document.getElementById('proj-' + id);
  if (panel) {
    panel.classList.add('active');
    // Re-trigger animations on newly shown cards
    panel.querySelectorAll('[data-anim]').forEach(el => {
      el.classList.remove('in-view');
      const delay = parseInt(el.dataset.delay || 0);
      setTimeout(() => el.classList.add('in-view'), delay + 50);
    });
    // Re-trigger skill bars inside (if any)
    panel.querySelectorAll('.skill-bar').forEach(bar => {
      const fill = bar.querySelector('.skill-fill');
      const pct  = parseInt(bar.dataset.pct);
      fill.style.width = '0';
      setTimeout(() => { fill.style.width = pct + '%'; }, 300);
    });
  }
  btn.classList.add('active');
}


/* ──────────────────────────────────────────
   10. SMOOTH SCROLL FOR NAV LINKS
────────────────────────────────────────── */
(function smoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id  = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();


/* ──────────────────────────────────────────
   11. CONTINUOUS ORBIT ICON COUNTER (CSS var sync)
   — keeps 3D sphere perspective correct
────────────────────────────────────────── */
(function syncSphereRotation() {
  const sphere = document.getElementById('iconSphere');
  if (!sphere) return;
  let deg = 0;
  const step = 360 / (22 * 60); // full rotation in 22s at 60fps
  function tick() {
    deg = (deg + step) % 360;
    sphere.style.setProperty('--base-rotation', deg + 'deg');
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();


/* ──────────────────────────────────────────
   12. HERO VISUAL PARALLAX ON SCROLL
────────────────────────────────────────── */
(function heroParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const gridBg   = hero.querySelector('.hero-grid-bg');
    if (gridBg) gridBg.style.transform = `translateY(${scrolled * 0.3}px)`;
  }, { passive: true });
})();


/* ──────────────────────────────────────────
   13. CONTACT CARD HOVER SOUND (visual ripple)
────────────────────────────────────────── */
(function rippleEffect() {
  document.querySelectorAll('.contact-card, .btn-red, .btn-wa-big').forEach(el => {
    el.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect   = this.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position:absolute; border-radius:50%;
        width:${size}px; height:${size}px;
        left:${e.clientX - rect.left - size/2}px;
        top:${e.clientY - rect.top  - size/2}px;
        background:rgba(255,255,255,0.25);
        transform:scale(0); animation:ripple-anim 0.6s linear;
        pointer-events:none;
      `;
      if (!document.getElementById('ripple-style')) {
        const s = document.createElement('style');
        s.id = 'ripple-style';
        s.textContent = `@keyframes ripple-anim{to{transform:scale(2.5);opacity:0}}`;
        document.head.appendChild(s);
      }
      const pos = getComputedStyle(this).position;
      if (pos === 'static') this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });
})();


/* ──────────────────────────────────────────
   14. TYPING EFFECT on Hero tagline
────────────────────────────────────────── */
(function typingEffect() {
  const tagline = document.querySelector('.hero-tagline');
  if (!tagline) return;

  const lines = [
    'لا تقلق، أنت في المكان الصحيح',
    'أبني مواقع تتصدر نتائج البحث',
    'وتحقق نتائج حقيقية وقابلة للقياس'
  ];

  let lineIdx  = 0;
  let charIdx  = 0;
  let isDeleting = false;
  tagline.innerHTML = '';

  function type() {
    const current = lines[lineIdx % lines.length];
    const displayed = isDeleting
      ? current.slice(0, charIdx--)
      : current.slice(0, charIdx++);

    tagline.textContent = displayed;

    let delay = isDeleting ? 40 : 65;

    if (!isDeleting && charIdx > current.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIdx <= 0) {
      isDeleting = false;
      lineIdx++;
      delay = 500;
    }

    setTimeout(type, delay);
  }

  // Start after hero animates in
  setTimeout(type, 1200);
})();


/* ──────────────────────────────────────────
   15. FLOATING CARDS DEPTH EFFECT
────────────────────────────────────────── */
(function floatingCardsDepth() {
  const cards = document.querySelectorAll('.hero-badge-card');
  let t = 0;
  function animate() {
    t += 0.02;
    cards.forEach((card, i) => {
      const offset = Math.sin(t + i * Math.PI) * 6;
      const rotate = Math.cos(t + i * 1.5) * 3;
      card.style.transform = `translateY(${offset}px) rotate(${rotate}deg)`;
    });
    requestAnimationFrame(animate);
  }
  animate();
})();


/* ──────────────────────────────────────────
   16. LOGO SLIDER
────────────────────────────────────────── */
let currentSlide = 0;
const totalSlides = 3;

function goToSlide(idx) {
  currentSlide = (idx + totalSlides) % totalSlides;
  document.querySelectorAll('.logo-slide').forEach((s, i) => {
    s.classList.toggle('active', i === currentSlide);
  });
  document.querySelectorAll('.s-dot').forEach((d, i) => {
    d.classList.toggle('active', i === currentSlide);
  });
}

function slideLogo(dir) {
  goToSlide(currentSlide + dir);
}

// Auto-play
setInterval(() => { slideLogo(1); }, 4500);

/* ──────────────────────────────────────────
   17. FAQ ACCORDION
────────────────────────────────────────── */
(function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const btn = item.querySelector('.faq-btn');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;
    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      items.forEach(i => {
        i.classList.remove('active');
        const ans = i.querySelector('.faq-answer');
        if (ans) ans.style.maxHeight = '0';
      });
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
})();

/* ──────────────────────────────────────────
   18. DARK MODE TOGGLE
────────────────────────────────────────── */
(function initDarkMode() {
  const toggleBtn = document.getElementById('darkModeToggle');
  if (!toggleBtn) return;

  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
    toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
  }

  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    let theme = 'light';
    if (document.body.classList.contains('dark-mode')) {
      theme = 'dark';
      toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }
    localStorage.setItem('theme', theme);
  });
})();


/* ──────────────────────────────────────────
   19. HEADING HOVER — CHAR BY CHAR FADE + CIRCLE
────────────────────────────────────────── */
(function initHeadingEffect() {
  // Create circle element — always visible, follows mouse everywhere
  const circle = document.createElement('div');
  circle.className = 'heading-circle';
  document.body.appendChild(circle);

  // Circle follows mouse globally
  window.addEventListener('mousemove', (e) => {
    circle.style.left = e.clientX + 'px';
    circle.style.top = e.clientY + 'px';
  });

  // Split headings into individual char spans
  const headings = document.querySelectorAll('h1, h2');

  headings.forEach(heading => {
    const children = Array.from(heading.childNodes);
    heading.innerHTML = '';

    children.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        for (let i = 0; i < text.length; i++) {
          const span = document.createElement('span');
          span.className = 'char';
          span.textContent = text[i];
          heading.appendChild(span);
        }
      } else {
        const clone = node.cloneNode(false);
        const innerText = node.textContent;
        for (let i = 0; i < innerText.length; i++) {
          const span = document.createElement('span');
          span.className = 'char';
          span.textContent = innerText[i];
          clone.appendChild(span);
        }
        heading.appendChild(clone);
      }
    });

    // Staggered delay per char
    const allChars = heading.querySelectorAll('.char');
    allChars.forEach((ch, i) => {
      ch.style.transitionDelay = (i * 0.03) + 's';
    });
  });
})();

