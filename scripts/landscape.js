// Stamped silhouettes + reveal near footer
(() => {
  const band  = document.getElementById('landscape');
  const back  = document.getElementById('layer-back');
  const mid   = document.getElementById('layer-mid');
  const front = document.getElementById('layer-front');
  if (!band || !back || !mid || !front) return;

  const HORIZON_Y = 312; // MUST match <rect y="312"> in index.html

  function stamp(group, d, step){
    group.innerHTML = '';
    for (let x = -60; x < 1500; x += step){
      const p = document.createElementNS('http://www.w3.org/2000/svg','path');
      p.setAttribute('d', d);
      p.setAttribute('transform', `translate(${x},${HORIZON_Y})`);
      group.appendChild(p);
    }
  }

  const BACK   = 'M0 0 L6 -22 L12 0 L8 -6 L4 0 Z';
  const MID    = 'M0 0 L8 -34 L16 0 L10 -10 L4 0 Z';
  const FRONT  = 'M0 0 L10 -46 L20 0 L12 -14 L6 0 Z';

  stamp(back,  BACK,  48);
  stamp(mid,   MID,   56);
  stamp(front, FRONT, 64);

  // Gentle drift
  let t0 = performance.now();
  function drift(){
    const t = (performance.now() - t0) / 1000;
    back .setAttribute('transform',  `translate(${Math.sin(t * .05) * 6},0)`);
    mid  .setAttribute('transform',  `translate(${Math.sin(t * .06 + 1) * 10},0)`);
    front.setAttribute('transform',  `translate(${Math.sin(t * .08 + 2) * 14},0)`);
    requestAnimationFrame(drift);
  }
  drift();

  // Reveal near footer
  const trigger = document.getElementById('landscape-trigger');
  const setVisible = (v) => band.classList.toggle('landscape--visible', !!v);

  if (trigger && 'IntersectionObserver' in window){
    const io = new IntersectionObserver((entries) => {
      setVisible(entries[0]?.isIntersecting);
    }, { root: null, threshold: 0, rootMargin: '0px 0px -25% 0px' });
    io.observe(trigger);
  } else {
    setVisible(true);
  }
})();
