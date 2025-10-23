// Simple day/night toggle using data-theme on <html>
(() => {
  const btn = document.getElementById('theme-toggle');
  const html = document.documentElement;

  function set(theme){
    html.setAttribute('data-theme', theme);
    btn.textContent = theme === 'light' ? '☀' : '☾';
    try { localStorage.setItem('theme', theme); } catch {}
  }

  // init
  const saved = (() => { try { return localStorage.getItem('theme'); } catch { return null; } })();
  if (saved === 'light' || saved === 'dark') set(saved);
  else set('dark');

  btn.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    set(next);
  });
})();
