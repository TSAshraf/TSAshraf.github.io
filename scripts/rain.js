// Subtle diagonal rain across the viewport.
// Now theme-aware via CSS variable --rain-color (set in :root / [data-theme]).
(() => {
  const c = document.getElementById('rain');
  if (!c) return;
  const ctx = c.getContext('2d');

  let w = 0, h = 0, dpr = 1;
  let drops = [];
  let pauseUntil = 0;

  const ANG = -15 * Math.PI/180;   // slant angle
  const SPEED_MIN = 8, SPEED_MAX = 18;
  const LEN_MIN = 60, LEN_MAX = 120;
  const DENSITY = 140;

  function resize(){
    dpr = Math.max(1, window.devicePixelRatio || 1);
    w = c.clientWidth = window.innerWidth;
    h = c.clientHeight = window.innerHeight;
    c.width = Math.floor(w * dpr);
    c.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function rand(a,b){ return a + Math.random()*(b-a); }

  function makeDrop(){
    return {
      x: Math.random()*(w+400) - 200,
      y: Math.random()*(h+400) - 200,
      v: rand(SPEED_MIN, SPEED_MAX),
      len: rand(LEN_MIN, LEN_MAX),
      a: rand(.08, .18),
    };
  }

  function populate(){
    drops = Array.from({length: DENSITY}, makeDrop);
  }

  // small pause when user scrolls extremely fast (avoid streaking)
  let lastY = window.scrollY, lastT = performance.now();
  addEventListener('scroll', () => {
    const t = performance.now();
    const dy = Math.abs(window.scrollY - lastY);
    const dt = Math.max(1, t - lastT);
    const vel = (dy/dt) * 1000;
    if (vel > 1200) pauseUntil = t + 180;
    lastY = window.scrollY; lastT = t;
  }, { passive:true });

  function currentRainColor(){
    const cs = getComputedStyle(document.documentElement);
    return cs.getPropertyValue('--rain-color').trim() || 'rgba(255,255,255,0.85)';
  }

  function draw(){
    const now = performance.now();
    if (now >= pauseUntil){
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(w/2, h/2);
      ctx.rotate(ANG);
      ctx.translate(-w/2, -h/2);
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = currentRainColor();

      for (const d of drops){
        ctx.globalAlpha = d.a;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x, d.y + d.len);
        ctx.stroke();

        d.y += d.v;
        if (d.y - d.len > h + 200){
          d.x = Math.random()*(w+400) - 200;
          d.y = -rand(20, 200);
          d.v = rand(SPEED_MIN, SPEED_MAX);
          d.len = rand(LEN_MIN, LEN_MAX);
          d.a = rand(.08, .18);
        }
      }
      ctx.restore();
    }
    requestAnimationFrame(draw);
  }

  addEventListener('resize', resize);
  resize();
  populate();
  requestAnimationFrame(draw);
})();
