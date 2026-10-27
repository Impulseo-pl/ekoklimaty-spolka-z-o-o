// Skórka „kl" - menu w pigułce, pasek po przewinięciu, slider oferty, opinie
(function () {
  var body = document.body;
  var nav = document.querySelector('.kl-nav');
  var btn = document.querySelector('.kl-burger');
  var menu = document.querySelector('.kl-menu');
  if (btn && menu) {
    var setOpen = function (open) {
      body.classList.toggle('kl-menu-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    btn.addEventListener('click', function () { setOpen(!body.classList.contains('kl-menu-open')); });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  }

  // pasek: tło po zejściu z góry, chowa się przy przewijaniu w dół
  if (nav) {
    var last = window.scrollY || 0, tick = false;
    var upd = function () {
      var y = window.scrollY || 0;
      nav.classList.toggle('kl-solid', y > 30);
      if (!body.classList.contains('kl-menu-open')) {
        if (y > 300 && y - last > 6) nav.classList.add('kl-hide');
        else if (last - y > 6 || y <= 300) nav.classList.remove('kl-hide');
      }
      last = y; tick = false;
    };
    window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  }

  // slider oferty
  document.querySelectorAll('[data-slider]').forEach(function (sl) {
    var track = sl.querySelector('.kl-track');
    var bar = sl.querySelector('.kl-progress i');
    var step = function () {
      var c = track.querySelector('.kl-card');
      return c ? c.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0) : 300;
    };
    var prog = function () {
      var max = track.scrollWidth - track.clientWidth;
      var vis = track.clientWidth / track.scrollWidth;
      var p = max > 0 ? track.scrollLeft / max : 0;
      if (bar) { bar.style.width = (vis * 100) + '%'; bar.style.transform = 'translateX(' + (p * (1 / vis - 1) * 100) + '%)'; }
    };
    sl.querySelector('.kl-next').addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
    sl.querySelector('.kl-prev').addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
    track.addEventListener('scroll', prog, { passive: true });
    window.addEventListener('resize', prog, { passive: true });
    prog();
  });

  // opinie
  document.querySelectorAll('[data-quotes]').forEach(function (box) {
    var items = [].slice.call(box.querySelectorAll('.kl-q'));
    var i = 0;
    var show = function (n) {
      i = (n + items.length) % items.length;
      items.forEach(function (q, k) { q.classList.toggle('is-on', k === i); });
    };
    box.querySelector('.kl-qnext').addEventListener('click', function () { show(i + 1); });
    box.querySelector('.kl-qprev').addEventListener('click', function () { show(i - 1); });
  });
})();
