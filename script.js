// ── Theme Toggle ──
const themeToggleBtn = document.getElementById('theme-toggle');
const htmlEl = document.documentElement;

// Check for saved theme preference or use system preference
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
  htmlEl.setAttribute('data-theme', 'dark');
} else {
  htmlEl.setAttribute('data-theme', 'light');
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    if (htmlEl.getAttribute('data-theme') === 'dark') {
      htmlEl.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    } else {
      htmlEl.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  });
}

// ── Scroll Animations ──
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('[data-animate], [data-animate-stagger]').forEach((el) => {
  observer.observe(el);
});

// ── Active Nav on Scroll ──
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const sections = [];

navLinks.forEach((link) => {
  const id = link.getAttribute('href').slice(1);
  const section = document.getElementById(id);
  if (section) sections.push({ id, el: section, link });
});

function updateActiveNav() {
  const scrollY = window.scrollY + 120;

  let current = null;
  for (const s of sections) {
    if (s.el.offsetTop <= scrollY) {
      current = s;
    }
  }

  navLinks.forEach((link) => link.classList.remove('active'));
  if (current) {
    current.link.classList.add('active');
  }
}

if (sections.length > 0) {
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();
}
