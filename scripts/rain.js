(() => {
  const c = document.getElementById('rain');
  if (!c) return;
  const ctx = c.getContext('2d');

  let w, h, dpr, drops=[], running=true, pauseUntil=0;
  const ANG = -15 * Math.PI/180; // slant
  const SPEED_MIN=8, SPEED_MAX=18;
  const LEN_MIN=60, LEN_MAX=120;
  const DENSITY = 160; // adjust for perf

  function resize(){
    dpr = Math.max(1, devicePixelRatio||1);
    w = c.clientWidth = innerWidth;
    h = c.clientHeight = innerHeight;
    c.width = Math.floor(w*dpr); c.height = Math.floor(h*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  function rand(a,b){ return a + Math.random()*(b-a); }
  function makeDrop(){
    return {
      x: Math.random()*(w+400) - 200,
      y: Math.random()*(h+400) - 200,
      v: rand(SPEED_MIN,SPEED_MAX),
      len: rand(LEN_MIN,LEN_MAX),
      a: rand(.08,.22),
    };
  }
  function populate(){ drops = Array.from({length:DENSITY}, makeDrop); }

  let lastY=scrollY, lastT=performance.now();
  addEventListener('scroll', () => {
    const t = performance.now(), dy = Math.abs(scrollY-lastY), dt = Math.max(1,t-lastT);
    const vel = (dy/dt)*1000; // px/s
    if (vel > 800) pauseUntil = t + 140; // brief suspend on fast scroll
    lastY = scrollY; lastT = t;
  }, { passive:true });

  function draw(){
    const now = performance.now();
    if (!running || document.hidden || now < pauseUntil){ requestAnimationFrame(draw); return; }

    ctx.clearRect(0,0,w,h);
    ctx.save();
    ctx.translate(w/2,h/2); ctx.rotate(ANG); ctx.translate(-w/2,-h/2);
    ctx.lineWidth = 1.2; ctx.strokeStyle = 'rgba(255,255,255,0.8)';

    for (const d of drops){
      ctx.globalAlpha = d.a;
      ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x, d.y + d.len); ctx.stroke();
      d.y += d.v;
      if (d.y - d.len > h+200){
        d.x = Math.random()*(w+400) - 200;
        d.y = -rand(20,200);
        d.v = rand(SPEED_MIN,SPEED_MAX);
        d.len = rand(LEN_MIN,LEN_MAX);
        d.a = rand(.08,.22);
      }
    }
    ctx.restore();
    requestAnimationFrame(draw);
  }

  addEventListener('resize', resize);
  addEventListener('visibilitychange', () => running = !document.hidden);
  resize(); populate(); draw();
})();
