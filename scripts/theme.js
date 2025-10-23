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

if (localStorage.getItem('theme')) {
  html.dataset.theme = localStorage.getItem('theme');
}
updateThemeIcon();
