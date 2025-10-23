// Minimal DOM-based rain. Color comes from CSS variable --rainColor
(function () {
  const container = document.getElementById('rain');
  if (!container) return;

  const COUNT = 180; // adjust density
  const drops = [];

  function makeDrop() {
    const d = document.createElement('div');
    d.className = 'raindrop';
    reset(d, true);
    container.appendChild(d);
    drops.push(d);
  }

  function reset(el, first = false) {
    // random horizontal seed
    el.style.setProperty('--x', Math.random() * 100 + 'vw');
    // random start delay so falls are desynced
    if (first) el.style.animationDelay = (Math.random() * 800) + 'ms';
    // random speed
    el.style.animationDuration = (520 + Math.random() * 420) + 'ms';
    // random length/thickness (modest variance)
    el.style.height = (14 + Math.random() * 10) + 'px';
    el.style.width  = (1.5 + Math.random() * 1.6) + 'px';
  }

  for (let i = 0; i < COUNT; i++) makeDrop();

  // Occasionally reshuffle some drops to avoid visible patterns
  setInterval(() => {
    for (let i = 0; i < 10; i++) {
      const idx = (Math.random() * drops.length) | 0;
      reset(drops[idx]);
    }
  }, 1500);
})();
