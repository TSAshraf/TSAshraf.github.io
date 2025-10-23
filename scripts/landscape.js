// Fixed bottom band: stamp silhouettes and add subtle drift
(() => {
  const band  = document.getElementById('landscape');
  const back  = document.getElementById('layer-back');
  const mid   = document.getElementById('layer-mid');
  const front = document.getElementById('layer-front');
  if (!band || !back || !mid || !front) return;

  const HORIZON_Y = 312; // must match <rect y="312"> in index.html

  function stamp(group, d, step){
    for (let x = -60; x < 1500; x += step){
      const p = document.createElementNS("http://www.w3.org/2000/svg","path");
      p.setAttribute('d', d);
      // base on horizon; shapes extend UP (negative y)
      p.setAttribute('transform', `translate(${x},${HORIZON_Y})`);
      group.appendChild(p);
    }
  }

  // Simple silhouettes
  const BACK   = 'M0 0 L6 -22 L12 0 L8 -6 L4 0 Z';
  const MID    = 'M0 0 L8 -34 L16 0 L10 -10 L4 0 Z';
  const FRONT  = 'M0 0 L10 -46 L20 0 L12 -14 L6 0 Z';

  stamp(back,  BACK,  48);
  stamp(mid,   MID,   56);
  stamp(front, FRONT, 64);

  // Ambient micro-drift
  let t0 = performance.now();
  function drift(){
    const t = (performance.now() - t0) / 1000;
    back .setAttribute('transform', `translate(${Math.sin(t * 0.05) * 6},0)`);
    mid  .setAttribute('transform', `translate(${Math.sin(t * 0.06 + 1) * 10},0)`);
    front.setAttribute('transform', `translate(${Math.sin(t * 0.08 + 2) * 14},0)`);
    requestAnimationFrame(drift);
  }
  drift();
})();
