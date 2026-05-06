// Theme toggle — persists to localStorage
(function () {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    const root = document.documentElement;
    const stored = localStorage.getItem('theme');

    if (stored) {
        root.setAttribute('data-theme', stored);
        toggle.textContent = stored === 'light' ? '☀' : '☾';
    }

    toggle.addEventListener('click', function () {
        const current = root.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        toggle.textContent = next === 'light' ? '☀' : '☾';
    });
})();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
