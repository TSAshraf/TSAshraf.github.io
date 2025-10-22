// Simple stamped silhouettes + parallax motion
(() => {
  const back  = document.getElementById('layer-back');
  const mid   = document.getElementById('layer-mid');
  const front = document.getElementById('layer-front');
  if (!back || !mid || !front) return;

  // Tiny “stalk” shapes—replace with nicer paths later if you want
  function stamp(group, d, step, y){
    for (let x=-50; x<1500; x+=step){
      const p = document.createElementNS("http://www.w3.org/2000/svg","path");
      p.setAttribute('d', d);
      p.setAttribute('transform', `translate(${x},${y})`);
      group.appendChild(p);
    }
  }
  stamp(back,  'M0 0 c4 -20 12 -20 16 0 l-8 40 z', 48, 560);
  stamp(mid,   'M0 0 c6 -28 16 -28 20 0 l-10 50 z', 56, 560);
  stamp(front, 'M0 0 c8 -34 20 -34 26 0 l-13 60 z', 64, 560);

  let lastY = window.scrollY;
  function onScroll(){
    const y = window.scrollY; lastY = y;
    back .setAttribute('transform', `translate(${-y*0.02},0)`);
    mid  .setAttribute('transform', `translate(${-y*0.05},0)`);
    front.setAttribute('transform', `translate(${-y*0.09},0)`);
  }
  document.addEventListener('scroll', onScroll, { passive:true });
  onScroll();
})();
