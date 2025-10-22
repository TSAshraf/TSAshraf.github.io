// scripts/landscape.js
// Fixed bottom band: stamp silhouettes, add gentle drift,
// and reveal band near the footer with IntersectionObserver.
(() => {
  const band  = document.getElementById('landscape');
  const back  = document.getElementById('layer-back');
  const mid   = document.getElementById('layer-mid');
  const front = document.getElementById('layer-front');
  if (!band || !back || !mid || !front) return;

  const HORIZON_Y = 312; // matches horizon <rect> y in index.html

  function stamp(group, d, step){
    for (let x = -60; x < 1500; x += step){
      const p = document.createElementNS("http://www.w3.org/2000/svg","path");
      p.setAttribute('d', d);
      // base on horizon; shapes extend UP (negative y)
      p.setAttribute('transform', `translate(${x},${HORIZON_Y})`);
      group.appendChild(p);
    }
  }

  // Simple “stalks” — swap with nicer shapes anytime
  const BACK   = 'M0 0 L6 -22 L12 0 L8 -6 L4 0 Z';
  const MID    = 'M0 0 L8 -34 L16 0 L10 -10 L4 0 Z';
  const FRONT  = 'M0 0 L10 -46 L20 0 L12 -14 L6 0 Z';

  stamp(back,  BACK,  48);
  stamp(mid,   MID,   56);
  stamp(front, FRONT, 64);

  // Tiny ambient drift (keeps scene alive; not scroll-bound)
  let t0 = performance.now();
  function drift(){
    const t = (performance.now() - t0) / 1000;
    const dxBack  = Math.sin(t * 0.05) * 6;
    const dxMid   = Math.sin(t * 0.06 + 1) * 10;
    const dxFront = Math.sin(t * 0.08 + 2) * 14;
    back .setAttribute('transform', `translate(${dxBack},0)`);
    mid  .setAttribute('transform', `translate(${dxMid},0)`);
    front.setAttribute('transform', `translate(${dxFront},0)`);
    requestAnimationFrame(drift);
  }
  drift();

  // Reveal the band when near the bottom (trigger above footer)
  const trigger = document.getElementById('landscape-trigger');

  function setVisible(v){
    band.classList.toggle('landscape--visible', !!v);
  }

  if (trigger && 'IntersectionObserver' in window){
    const io = new IntersectionObserver(
      entries => setVisible(entries[0]?.isIntersecting),
      {
        root: null,
        threshold: 0,
        // Slightly before very bottom; adjust to taste
        rootMargin: '0px 0px -20% 0px'
      }
    );
    io.observe(trigger);
  } else {
    // Fallback: always show if no IO support or trigger missing
    setVisible(true);
  }
})();
