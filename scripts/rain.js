// Birds (SVG) + Lightning (CSS) — gentle, rare, atmospheric.
(() => {
  const birdsSvg = document.getElementById('birds');
  const lightning = document.getElementById('lightning');
  if (!birdsSvg || !lightning) return;

  const sky = { w: window.innerWidth, h: window.innerHeight };
  function resize(){
    sky.w = window.innerWidth;
    sky.h = window.innerHeight;
    birdsSvg.setAttribute('viewBox', `0 0 ${Math.max(1440, sky.w)} ${Math.max(900, sky.h)}`);
  }
  window.addEventListener('resize', resize, { passive:true });
  resize();

  /* ---------- Lightning (subtle, occasional) ---------- */
  function flash(){
    if (Math.random() < 0.5) return; // keep it rare
    const pulses = 1 + (Math.random() < 0.35 ? 1 : 0);
    let i = 0;
    function pulse(){
      lightning.style.opacity = (0.12 + Math.random()*0.12).toFixed(2);
      setTimeout(() => {
        lightning.style.opacity = '0';
        i++;
        if (i < pulses) setTimeout(pulse, 120 + Math.random()*200);
      }, 120 + Math.random()*120);
    }
    pulse();
  }
  setInterval(flash, 25000 + Math.random()*15000); // ~25–40s

  /* ---------- Birds (tiny V silhouettes) ---------- */
  const NS = "http://www.w3.org/2000/svg";
  const flock = [];

  function makeBird(){
    const g = document.createElementNS(NS, 'g');
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', 'M0 0 L10 -6 L20 0');
    p.setAttribute('fill', 'none');
    p.setAttribute('stroke', 'rgba(220,220,220,0.55)');
    p.setAttribute('stroke-width', '1.4');
    g.appendChild(p);
    birdsSvg.appendChild(g);

    const scale = 0.8 + Math.random()*0.9;
    const y = Math.floor(sky.h * (0.18 + Math.random()*0.30));
    const dir = Math.random() < 0.5 ? 1 : -1;
    const startX = dir > 0 ? -40 : sky.w + 40;

    const speed = (30 + Math.random()*40) * dir; // px/sec
    const swayAmp = 6 + Math.random()*10;
    const swayFreq = 0.6 + Math.random()*0.9;

    const b = { g, x:startX, y, dir, speed, swayAmp, swayFreq, scale };
    flock.push(b);
  }

  function maybeSpawnBird(){
    if (flock.length > 3) return;        // cap population
    if (Math.random() < 0.02) makeBird(); // very rare
  }
  setInterval(maybeSpawnBird, 3000);

  function tick(){
    const t = performance.now()/1000;
    for (let i = flock.length - 1; i >= 0; i--){
      const b = flock[i];
      b.x += (b.speed / 60);
      const sway = Math.sin(t * b.swayFreq) * b.swayAmp;
      const angle = Math.sin(t * 0.7) * 6;

      b.g.setAttribute('transform',
        `translate(${b.x}, ${b.y + sway}) rotate(${angle}) scale(${b.scale})`
      );

      if ((b.dir > 0 && b.x > sky.w + 80) || (b.dir < 0 && b.x < -80)){
        birdsSvg.removeChild(b.g);
        flock.splice(i,1);
      }
    }
    requestAnimationFrame(tick);
  }
  tick();

})();
