// Simple theme toggle + persist choice
(function () {
  const root = document.documentElement;
  const btn  = document.getElementById('theme-toggle');
  const saved = localStorage.getItem('theme');

  if (saved === 'light' || saved === 'dark') {
    root.setAttribute('data-theme', saved);
  }

  const updateIcon = () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    btn.textContent = isLight ? '☀︎' : '☾';
  };

  btn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateIcon();
  });

  updateIcon();
})();
