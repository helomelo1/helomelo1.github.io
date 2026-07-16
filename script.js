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

// ── Dynamic Notes ──
async function loadNotes() {
  const notesList = document.getElementById('dynamic-notes-list');
  if (!notesList) return;

  try {
    const res = await fetch('notes.json');
    if (!res.ok) return; // Keep default placeholder if notes.json is missing

    const notes = await res.json();
    if (notes.length === 0) return; // Keep default placeholder if empty

    let html = '';
    notes.forEach(note => {
      const dateStr = new Date(note.date * 1000).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric'
      });

      html += `
        <div class="note-card">
          <div class="note-meta">
            <time>${dateStr}</time>
          </div>
          <h3 class="note-title">${note.title}</h3>
          <p class="note-body">
            ${note.content.replace(/\n/g, '<br>')}
          </p>
        </div>
      `;
    });

    notesList.innerHTML = html;
  } catch (err) {
    console.error('Failed to load notes:', err);
  }
}

document.addEventListener('DOMContentLoaded', loadNotes);
