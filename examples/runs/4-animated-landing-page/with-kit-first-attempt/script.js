/* Tally landing page. No libraries. Everything here is added on top of a page
   that already reads and works as a document without it. */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  /* ------------------------------------------------------------------
     Signature: the invoice is dealt in as layers, flattens, gets stamped.
     Three beats, then it rests. Durations match the motion tokens:
     beat 600ms, scene 1200ms, stagger 60ms.
     ------------------------------------------------------------------ */
  var BEAT = 600;
  var SCENE = 1200;
  var TILT_MAX = 8; // degrees, depth.tilt-max

  var scene = document.getElementById('scene');
  var tilt = scene ? scene.querySelector('.tilt') : null;
  var toggle = document.getElementById('toggle-layers');
  var replay = document.getElementById('replay');
  var timers = [];

  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  function setApart(apart) {
    if (apart) { scene.setAttribute('data-state', 'apart'); }
    else { scene.removeAttribute('data-state'); }
    toggle.setAttribute('aria-pressed', apart ? 'true' : 'false');
    toggle.textContent = apart ? 'Flatten the layers' : 'Pull the layers apart';
  }

  function rest() {
    clearTimers();
    clearTimeout(window.__tallyFailSafe);
    scene.removeAttribute('data-beat');
    scene.removeAttribute('data-stamp');
    scene.classList.remove('is-predeal', 'is-moving');
    root.classList.remove('will-play');
  }

  function play() {
    clearTimers();
    clearTimeout(window.__tallyFailSafe); // the opening has started, so the fail-safe is not needed
    // Opening pose, with no transition into it.
    scene.classList.add('is-predeal', 'is-moving');
    scene.setAttribute('data-stamp', 'off');
    scene.removeAttribute('data-state');
    root.classList.remove('will-play');
    void scene.offsetWidth; // commit the pose before leaving it

    requestAnimationFrame(function () {
      // Beat 1: the layers are dealt in and hang apart.
      scene.setAttribute('data-beat', '1');
      scene.classList.remove('is-predeal');
      setApart(true);

      // Beat 2: they flatten into one sheet.
      later(function () {
        scene.setAttribute('data-beat', '2');
        setApart(false);
      }, SCENE);

      // Beat 3: the stamp lands.
      later(function () {
        scene.setAttribute('data-beat', '3');
        scene.removeAttribute('data-stamp');
      }, SCENE + SCENE);

      later(rest, SCENE + SCENE + BEAT);
    });
  }

  if (scene && toggle && replay) {
    toggle.hidden = false;
    replay.hidden = false;

    toggle.addEventListener('click', function () {
      var apart = scene.getAttribute('data-state') === 'apart';
      rest(); // a click during the opening ends it; nothing blocks input
      scene.classList.add('is-moving');
      setApart(!apart);
      later(function () { scene.classList.remove('is-moving'); }, BEAT);
    });

    replay.addEventListener('click', function () {
      if (reduceMotion.matches) { return; }
      play();
    });

    if (reduceMotion.matches) {
      rest(); // end state, no auto-play
    } else if ('IntersectionObserver' in window) {
      // Play once, and only when the invoice is on screen.
      var seen = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          seen.disconnect();
          play();
        }
      }, { threshold: 0.4 });
      seen.observe(scene);
    } else {
      rest();
    }

    // If the person turns reduced motion on while the page is open.
    var onMotionChange = function () { if (reduceMotion.matches) { rest(); resetTilt(); } };
    if (reduceMotion.addEventListener) { reduceMotion.addEventListener('change', onMotionChange); }

    // Pointer tilt. Fine pointers only; the design does not depend on it.
    scene.addEventListener('pointermove', function (event) {
      if (reduceMotion.matches || !finePointer.matches || event.pointerType === 'touch') { return; }
      var box = scene.getBoundingClientRect();
      var x = (event.clientX - box.left) / box.width - 0.5;   // -0.5 to 0.5
      var y = (event.clientY - box.top) / box.height - 0.5;
      x = Math.max(-0.5, Math.min(0.5, x));
      y = Math.max(-0.5, Math.min(0.5, y));
      tilt.style.setProperty('--tilt-y', (x * 2 * TILT_MAX).toFixed(2) + 'deg');
      tilt.style.setProperty('--tilt-x', (-y * 2 * TILT_MAX).toFixed(2) + 'deg');
    });
    scene.addEventListener('pointerleave', resetTilt);
  } else {
    root.classList.remove('will-play');
  }

  function resetTilt() {
    if (!tilt) { return; }
    tilt.style.removeProperty('--tilt-x');
    tilt.style.removeProperty('--tilt-y');
  }

  /* ------------------------------------------------------------------
     Builder: layers on and off, with an empty state.
     ------------------------------------------------------------------ */
  var boxes = Array.prototype.slice.call(document.querySelectorAll('[data-layer]'));
  var filled = document.getElementById('preview-filled');
  var empty = document.getElementById('preview-empty');
  var totalEl = document.getElementById('preview-total');
  var emptyAction = document.getElementById('empty-action');
  var pounds = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 });

  function renderBuilder() {
    var total = 0;
    var count = 0;
    boxes.forEach(function (box) {
      var line = document.querySelector('[data-line="' + box.getAttribute('data-layer') + '"]');
      if (!line) { return; }
      var wasHidden = line.hidden;
      line.hidden = !box.checked;
      line.classList.toggle('is-new', box.checked && wasHidden);
      if (box.checked) {
        total += Number(line.getAttribute('data-amount'));
        count += 1;
      }
    });
    totalEl.textContent = pounds.format(total);
    filled.hidden = count === 0;
    empty.hidden = count !== 0;
  }

  if (boxes.length && filled && empty && totalEl) {
    boxes.forEach(function (box) { box.addEventListener('change', renderBuilder); });
    emptyAction.addEventListener('click', function () {
      var hours = document.querySelector('[data-layer="hours"]');
      hours.checked = true;
      renderBuilder();
      hours.focus();
    });
    renderBuilder();
  }

  /* ------------------------------------------------------------------
     Sign-up form: error, loading and done states.
     NOT CONNECTED: there is no server behind this page. sendAddress() is
     the one place to replace with a real request.
     ------------------------------------------------------------------ */
  var form = document.getElementById('signup');
  var email = document.getElementById('email');
  var help = document.getElementById('email-help');
  var error = document.getElementById('email-error');
  var button = document.getElementById('signup-button');
  var label = document.getElementById('signup-label');
  var status = document.getElementById('signup-status');
  var spinner = button ? button.querySelector('.spinner') : null;

  function sendAddress(address) {
    // Placeholder. Replace with fetch() to the real sign-up endpoint.
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        if (navigator.onLine === false) { reject(new Error('offline')); }
        else { resolve(address); }
      }, 800);
    });
  }

  function showFieldError(message) {
    error.textContent = 'Error: ' + message;
    error.hidden = false;
    help.hidden = true;                       // the error replaces the help text
    email.setAttribute('aria-invalid', 'true');
    email.setAttribute('aria-describedby', 'email-error');
    email.focus();
  }

  function clearFieldError() {
    error.hidden = true;
    help.hidden = false;
    email.removeAttribute('aria-invalid');
    email.setAttribute('aria-describedby', 'email-help');
  }

  function check(address) {
    if (!address) { return 'enter your email address so we can send the sign-in link.'; }
    if (address.indexOf('@') === -1) { return 'this address has no @ sign. It should look like ines@vargastudio.example.'; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) { return 'the part after the @ is not complete. It should look like ines@vargastudio.example.'; }
    return '';
  }

  function setBusy(busy) {
    button.setAttribute('aria-busy', busy ? 'true' : 'false');
    button.style.minWidth = busy ? button.offsetWidth + 'px' : '';   // keeps its width
    spinner.hidden = !busy;
    label.textContent = busy ? 'Creating account' : 'Create my account';
  }

  if (form && email && button) {
    email.addEventListener('input', function () {
      if (!error.hidden && !check(email.value.trim())) { clearFieldError(); }
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (button.getAttribute('aria-busy') === 'true') { return; }   // clicks are ignored while loading

      var address = email.value.trim();
      var problem = check(address);
      status.hidden = true;
      status.classList.remove('is-error');
      if (problem) { showFieldError(problem); return; }

      clearFieldError();
      setBusy(true);
      sendAddress(address).then(function () {
        setBusy(false);
        status.textContent = 'Check your inbox. We sent a sign-in link to ' + address + '.';
        status.hidden = false;
      }, function () {
        setBusy(false);
        status.textContent = 'Error: we could not reach Tally, so no account was created. Check your connection and press the button again.';
        status.classList.add('is-error');
        status.hidden = false;
      });
    });
  }
})();
