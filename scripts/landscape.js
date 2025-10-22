// scripts/landscape.js
// Stamp simple upward silhouettes inside the fixed bottom band
(() => {
  const band  = document.getElementById('landscape');
  const back  = document.getElementById('layer-back');
  const mid   = document.getElementById('layer-mid');
  const front = document.getElementById('layer-front');
  if (!band || !back || !mid || !front) return;

  const HORIZON_Y = 312; // matches the horizon <rect> y value in index.html

  function stamp(group, d, step){
    for (let x = -60; x < 1500; x += step){
      const p = document.createElementNS("http://www.w3.org/2000/svg","path");
      p.setAttribute('d', d);
      // place base on horizon; shapes extend UP (negative y)
      p.setAttribute('transform', `translate(${x},${HORIZON_Y})`);
      group.appendChild(p);
    }
  }

  // Simple “stalks” — replace with nicer shapes later if you want
  const BACK   = 'M0 0 L6 -22 L12 0 L8 -6 L4 0 Z';
  const MID    = 'M0 0 L8 -34 L16 0 L10 -10 L4 0 Z';
  const FRONT  = 'M0 0 L10 -46 L20 0 L12 -14 L6 0 Z';

  stamp(back,  BACK,  48);
  stamp(mid,   MID,   56);
  stamp(front, FRONT, 64);

  // Very subtle, slow drift to keep it alive (not scroll-bound)
  let t0 = performance.now();
  function drift(){
    const t = (performance.now() - t0) / 1000;
    const dxBack  = Math.sin(t * 0.05) * 6;    // tiny oscillation
    const dxMid   = Math.sin(t * 0.06 + 1) * 10;
    const dxFront = Math.sin(t * 0.08 + 2) * 14;
    back .setAttribute('transform', `translate(${dxBack},0)`);
    mid  .setAttribute('transform', `translate(${dxMid},0)`);
    front.setAttribute('transform', `translate(${dxFront},0)`);
    requestAnimationFrame(drift);
  }
  drift();

  // ---- Reveal the fixed landscape only near the footer ----
  // Requires:
  //   <div id="landscape-trigger"></div> placed above your <footer>
  //   CSS:
  //     #landscape{ opacity:0; transition:opacity .8s ease; }
  //     #landscape.landscape--visible{ opacity:1; }
  //     #page{ padding-bottom: 34vh; }  // same as #landscape height
  const trigger = document.getElementById('landscape-trigger');

  function showBand(visible){
    band.classList.toggle('landscape--visible', !!visible);
  }

  if (trigger && 'IntersectionObserver' in window){
    const io = new IntersectionObserver(
      (entries) => showBand(entries[0]?.isIntersecting),
      {
        root: null,
        threshold: 0,
        // Start fading in a bit before the very bottom is reached
        rootMargin: '0px 0px -20% 0px'
      }
    );
    io.observe(trigger);
  } else {
    // Fallback: always show the band if IO isn't supported or trigger missing
    showBand(true);
  }
})();
