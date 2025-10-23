// DOM-based rain so we can theme the drop color for day/night mode.
(() => {
  const container = document.getElementById("rain");
  if (!container) return;

  // Clear any previous drops (hot reload safety)
  container.innerHTML = "";

  // Adjust this to change intensity/perf
  const DROP_COUNT = Math.min(220, Math.floor(window.innerWidth / 6) + 120);

  for (let i = 0; i < DROP_COUNT; i++) {
    const drop = document.createElement("div");
    drop.className = "raindrop";

    // Randomized horizontal position & animation
    const startX = Math.random() * 100;        // vw
    const delay  = Math.random() * 2.2;        // seconds
    const dur    = 0.6 + Math.random() * 1.4;  // seconds

    drop.style.left = `${startX}vw`;
    drop.style.animationDuration = `${dur}s`;
    drop.style.animationDelay = `${delay}s`;

    container.appendChild(drop);
  }

  // Recalculate on resize (debounced)
  let t;
  window.addEventListener("resize", () => {
    clearTimeout(t);
    t = setTimeout(() => {
      // simple rebuild on resize
      container.innerHTML = "";
      const count = Math.min(220, Math.floor(window.innerWidth / 6) + 120);
      for (let i = 0; i < count; i++) {
        const d = document.createElement("div");
        d.className = "raindrop";
        const x = Math.random() * 100;
        const dl = Math.random() * 2.2;
        const du = 0.6 + Math.random() * 1.4;
        d.style.left = `${x}vw`;
        d.style.animationDuration = `${du}s`;
        d.style.animationDelay = `${dl}s`;
        container.appendChild(d);
      }
    }, 200);
  });
})();
