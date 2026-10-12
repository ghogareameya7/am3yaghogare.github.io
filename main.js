/* 1) Fill each grid with images: images/<folder>/01.jpg, 02.jpg ...
      (if you type your own <img> tags inside a grid, this step is skipped) */
document.querySelectorAll('.grid[data-dir]').forEach(function (g) {
  if (g.children.length) return;
  var n = +g.dataset.n, ext = g.dataset.ext || 'jpg';
  for (var i = 1; i <= n; i++) {
    var f = document.createElement('figure');
    if (i <= (+g.dataset.tall || 0)) f.className = 'tall';   /* first N pictures are 9:16 */
    var img = document.createElement('img');
    img.src = 'images/' + g.dataset.dir + '/' + String(i).padStart(2, '0') + '.' + ext;
    img.alt = g.dataset.dir + ' ' + i;
    img.loading = 'lazy';
    f.appendChild(img);
    g.appendChild(f);
  }
});

/* 2) If an image is missing, hide the broken icon and keep the grey placeholder */
document.querySelectorAll('img').forEach(function (img) {
  function miss() { img.classList.add('missing'); }
  img.addEventListener('error', miss);
  if (img.complete && img.naturalWidth === 0) miss();
});

/* 3) Fade sections in as you scroll */
var items = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  items.forEach(function (el) { io.observe(el); });
} else {
  items.forEach(function (el) { el.classList.add('in'); });
}

/* 4) Carousel arrows: each arrow moves the slides by one picture */
document.querySelectorAll('.car').forEach(function (car) {
  var s = car.querySelector('.slides'),
      prev = car.querySelector('.prev'),
      next = car.querySelector('.next');
  function step() { var f = s.querySelector('figure'); return f ? f.offsetWidth + 14 : 300; }
  function update() {
    prev.disabled = s.scrollLeft <= 2;
    next.disabled = s.scrollLeft + s.clientWidth >= s.scrollWidth - 2;
  }
  prev.addEventListener('click', function () { s.scrollBy({ left: -step(), behavior: 'smooth' }); });
  next.addEventListener('click', function () { s.scrollBy({ left: step(), behavior: 'smooth' }); });
  s.addEventListener('scroll', update);
  window.addEventListener('resize', update);
  update();
});

/* 5) Keep the hover/tap bubbles inside the screen (important on phones) */
document.querySelectorAll('.stk').forEach(function (el) {
  function place() {
    var r = el.getBoundingClientRect();
    var x = r.left + r.width / 2 - 100;
    x = Math.max(8, Math.min(window.innerWidth - 208, x));
    el.style.setProperty('--bl', (x - r.left) + 'px');
  }
  ['mouseenter', 'focus', 'touchstart'].forEach(function (ev) { el.addEventListener(ev, place, { passive: true }); });
});
