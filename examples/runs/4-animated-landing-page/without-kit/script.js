(function () {
  'use strict';

  /* ---------- 3D invoice ---------- */
  var hero = document.getElementById('hero');
  var rig = document.getElementById('rig');
  var stamp = document.getElementById('stamp');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var BASE_RX = 54, BASE_RZ = -31;
  var INTRO_MS = 1700;

  if (reduce || !rig) {
    if (stamp) stamp.classList.add('is-down');
  } else {
    var pointer = { x: 0, y: 0 };      // target, -1..1
    var eased = { x: 0, y: 0 };        // smoothed
    var scrollP = 0;
    var visible = true;
    var running = false;
    var startTime = null;
    var stamped = false;

    var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
    var easeOut = function (t) { return 1 - Math.pow(1 - t, 4); };

    window.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });

    var readScroll = function () {
      var h = hero.offsetHeight || 1;
      scrollP = clamp(window.scrollY / (h * 0.8), 0, 1);
    };
    window.addEventListener('scroll', readScroll, { passive: true });
    readScroll();

    var frame = function (now) {
      if (!running) return;
      if (startTime === null) startTime = now;
      var t = now - startTime;

      var intro = easeOut(clamp(t / INTRO_MS, 0, 1));
      if (!stamped && t > INTRO_MS * 0.8) {
        stamped = true;
        stamp.classList.add('is-down');
      }

      eased.x += (pointer.x - eased.x) * 0.06;
      eased.y += (pointer.y - eased.y) * 0.06;

      var sway = Math.sin(t / 2600);
      var bob = Math.sin(t / 1900);

      var rx = BASE_RX - eased.y * 9 - scrollP * 10 + (1 - intro) * 18;
      var rz = BASE_RZ + eased.x * 16 + sway * 3 + scrollP * 28 - (1 - intro) * 70;
      var ex = 1 + bob * 0.12 + scrollP * 2.6 + (1 - intro) * 7;

      rig.style.setProperty('--rx', rx.toFixed(2) + 'deg');
      rig.style.setProperty('--rz', rz.toFixed(2) + 'deg');
      rig.style.setProperty('--ex', ex.toFixed(3));

      requestAnimationFrame(frame);
    };

    var sync = function () {
      var should = visible && !document.hidden;
      if (should && !running) { running = true; requestAnimationFrame(frame); }
      else if (!should) { running = false; }
    };

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        sync();
      }).observe(hero);
    }
    document.addEventListener('visibilitychange', sync);
    sync();
  }

  /* ---------- Scope creep calculator ---------- */
  var rate = document.getElementById('rate');
  var hours = document.getElementById('hours');
  var projects = document.getElementById('projects');
  if (rate && hours && projects) {
    var money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
    var update = function () {
      var r = +rate.value, h = +hours.value, p = +projects.value;
      document.getElementById('o-rate').textContent = money.format(r);
      document.getElementById('o-hours').textContent = h + ' h';
      document.getElementById('o-projects').textContent = p;
      document.getElementById('o-total').textContent = money.format(r * h * p);
    };
    [rate, hours, projects].forEach(function (el) { el.addEventListener('input', update); });
    update();
  }

  /* ---------- Signup (placeholder: not connected to a backend) ---------- */
  var form = document.getElementById('signup');
  if (form) {
    var msg = document.getElementById('signup-msg');
    var email = document.getElementById('email');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var value = email.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        msg.textContent = 'Enter a valid email address, like you@studio.example.';
        email.setAttribute('aria-invalid', 'true');
        email.focus();
        return;
      }
      email.removeAttribute('aria-invalid');
      msg.textContent = 'Thanks. We\'ll email ' + value + ' with a link to set up your workspace.';
      form.reset();
    });
  }

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
