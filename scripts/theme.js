// Day/Night toggle with persistence
const toggle = document.getElementById('theme-toggle');
const html = document.documentElement;

function updateThemeIcon() {
  toggle.textContent = html.dataset.theme === 'light' ? '🌙' : '☀️';
}

toggle.addEventListener('click', () => {
  html.dataset.theme = html.dataset.theme === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme', html.dataset.theme);
  updateThemeIcon();
});

// Initialize from saved preference if present
const stored = localStorage.getItem('theme');
if (stored === 'light' || stored === 'dark') {
  html.dataset.theme = stored;
}
updateThemeIcon();
