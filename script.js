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
