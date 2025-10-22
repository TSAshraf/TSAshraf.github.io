// Parallax silhouettes that grow UP from the horizon (y = 820)
(() => {
  const back  = document.getElementById('layer-back');
  const mid   = document.getElementById('layer-mid');
  const front = document.getElementById('layer-front');
  if (!back || !mid || !front) return;

  const H = 900;        // viewBox height
  const HORIZON = 820;  // matches index.html rect y

  function stamp(group, d, step){
    for (let x = -60; x < 1500; x += step){
      const p = document.createElementNS("http://www.w3.org/2000/svg","path");
      // place each spike with its base ON the horizon, spike goes UP (negative y)
      p.setAttribute('d', d);
      p.setAttribute('transform', `translate(${x},${HORIZON})`);
      group.appendChild(p);
    }
  }

  // Upward spikes (very simple silhouettes). Replace with nicer paths later.
  // Each path starts at (0,0) (the horizon), then goes upward (negative y).
  const BACK_SPIKE  = 'M0 0 L6 -22 L12 0 L8 -6 L4 0 Z';   // short, soft
  const MID_SPIKE   = 'M0 0 L8 -34 L16 0 L10 -10 L4 0 Z'; // medium
  const FRONT_SPIKE = 'M0 0 L10 -46 L20 0 L12 -14 L6 0 Z';// tall, sharp

  stamp(back,  BACK_SPIKE,  48);
  stamp(mid,   MID_SPIKE,   56);
  stamp(front, FRONT_SPIKE, 64);

  // Parallax on scroll (farther layers move less)
  function onScroll(){
    const y = window.scrollY;
    back .setAttribute('transform', `translate(${-y*0.02},0)`);
    mid  .setAttribute('transform', `translate(${-y*0.05},0)`);
    front.setAttribute('transform', `translate(${-y*0.09},0)`);
  }
  document.addEventListener('scroll', onScroll, { passive:true });
  onScroll();
})();
