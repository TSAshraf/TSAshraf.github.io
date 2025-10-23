// Minimal DOM-based rain spawner (only effect enabled)
(() => {
  const root = document.getElementById('rain');
  if (!root) return;

  const N = 60;                // number of concurrent drops
  const drops = new Set();

  function spawn() {
    if (!document.body.contains(root)) return;
    if (drops.size >= N) return;

    const d = document.createElement('div');
    d.className = 'raindrop';
    // random horizontal seed for the diagonal transform
    d.style.setProperty('--x', Math.random() * 100 + 'vw');
    // randomize a tiny bit
    d.style.animationDuration = (550 + Math.random()*300) + 'ms';
    d.style.animationDelay = (-Math.random()*400) + 'ms';

    d.addEventListener('animationend', () => {
      drops.delete(d);
      d.remove();
    });

    drops.add(d);
    root.appendChild(d);
  }

  // keep seeding drops
  const timer = setInterval(spawn, 60);
  // safety on navigation
  window.addEventListener('beforeunload', () => clearInterval(timer));
})();
