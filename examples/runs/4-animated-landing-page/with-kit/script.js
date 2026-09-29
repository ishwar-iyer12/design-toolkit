/* Tally landing page. No libraries. Everything here is added on top of a page that reads without it. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  /* ---------- Signature: replay, pause, off-screen pause, pointer tilt ---------- */

  var stage = document.getElementById('stage');
  var pad = document.getElementById('pad');
  var replay = document.getElementById('replay');
  var pause = document.getElementById('pause');
  var heroStamp = stage.querySelector('.stamp--hero');

  function startSignature() {
    if (reduced.matches) { return; }
    stage.classList.add('is-animating');
  }

  // will-change is removed when the last beat (the stamp) has landed
  heroStamp.addEventListener('animationend', function () {
    stage.classList.remove('is-animating');
  });
  startSignature();

  replay.addEventListener('click', function () {
    if (reduced.matches) { return; }
    stage.classList.add('is-reset');
    void stage.offsetWidth; // one reflow so the animations start from the top
    stage.classList.remove('is-reset');
    startSignature();
  });

  pause.addEventListener('click', function () {
    var paused = stage.classList.toggle('is-paused');
    pause.setAttribute('aria-pressed', String(paused));
    pause.textContent = paused ? 'Resume the float' : 'Pause the float';
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      stage.classList.toggle('is-offscreen', !entries[0].isIntersecting);
    }).observe(stage);
  }

  // Pointer tilt: at most 8 degrees, eased by the CSS transition, back to rest on leave.
  var TILT_MAX = 8;
  var tiltFrame = 0;

  stage.addEventListener('pointermove', function (event) {
    if (reduced.matches || !finePointer.matches || event.pointerType === 'touch') { return; }
    var x = event.clientX;
    var y = event.clientY;
    if (tiltFrame) { return; }
    tiltFrame = window.requestAnimationFrame(function () {
      tiltFrame = 0;
      var box = stage.getBoundingClientRect();
      var dx = Math.max(-1, Math.min(1, ((x - box.left) / box.width) * 2 - 1));
      var dy = Math.max(-1, Math.min(1, ((y - box.top) / box.height) * 2 - 1));
      pad.style.setProperty('--tilt-y', (dx * TILT_MAX).toFixed(2) + 'deg');
      pad.style.setProperty('--tilt-x', (dy * -TILT_MAX).toFixed(2) + 'deg');
    });
  });

  stage.addEventListener('pointerleave', function () {
    pad.style.removeProperty('--tilt-x');
    pad.style.removeProperty('--tilt-y');
  });

  /* ---------- The flat invoice ---------- */

  var DEPOSIT = 1600;
  var lines = [
    { desc: 'Brand identity: logo suite and colour system', qty: 1, rate: 3200 },
    { desc: 'Packaging illustration for bread bags, hours', qty: 14, rate: 95 },
    { desc: 'Revision round 3 (two rounds are included)', qty: 1, rate: 280 },
    { desc: 'Usage licence: exclusive, two years, print and web', qty: 1, rate: 600 }
  ];

  var body = document.getElementById('lines');
  var wrap = document.getElementById('lines-wrap');
  var empty = document.getElementById('lines-empty');
  var totals = document.getElementById('totals');
  var subEl = document.getElementById('t-sub');
  var dueEl = document.getElementById('t-due');
  var dueLabel = document.getElementById('t-due-label');
  var lineForm = document.getElementById('line-form');

  function money(n) {
    return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function quantity(n) {
    return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
  }

  function cell(text, className) {
    var td = document.createElement('td');
    td.textContent = text;
    if (className) { td.className = className; }
    return td;
  }

  function render(newIndex) {
    body.textContent = '';
    lines.forEach(function (line, index) {
      var tr = document.createElement('tr');
      if (index === newIndex) { tr.className = 'is-new'; }
      tr.appendChild(cell(line.desc));
      tr.appendChild(cell(quantity(line.qty), 'num'));
      tr.appendChild(cell(money(line.rate), 'num'));
      tr.appendChild(cell(money(line.qty * line.rate), 'num'));

      var td = cell('', 'remove');
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn btn--quiet';
      button.textContent = 'Remove';
      button.setAttribute('aria-label', 'Remove line: ' + line.desc);
      button.addEventListener('click', function () { removeLine(index); });
      td.appendChild(button);
      tr.appendChild(td);
      body.appendChild(tr);
    });

    var none = lines.length === 0;
    wrap.hidden = none;
    totals.hidden = none;
    empty.hidden = !none;

    // An invoice with no lines cannot be paid. The empty state beside the button says why.
    stampToggle.disabled = none;
    if (none) { setStamp(false); }

    var subtotal = lines.reduce(function (sum, line) { return sum + line.qty * line.rate; }, 0);
    var due = subtotal - DEPOSIT;
    subEl.textContent = money(subtotal);
    dueLabel.textContent = due < 0 ? 'Credit owed to client' : 'Amount due';
    dueEl.textContent = '$' + money(Math.abs(due));
  }

  function removeLine(index) {
    lines.splice(index, 1);
    render();
    // Keep keyboard focus somewhere sensible after the button it was on is gone
    var buttons = body.querySelectorAll('button');
    if (buttons.length) {
      buttons[Math.min(index, buttons.length - 1)].focus();
    } else {
      document.getElementById('empty-add').focus();
    }
  }

  document.getElementById('empty-add').addEventListener('click', function () {
    document.getElementById('f-desc').focus();
  });

  /* Errors sit next to their cause and replace the help text */
  function setError(input, message) {
    var help = document.getElementById(input.id + '-help');
    if (!help.dataset.help) { help.dataset.help = help.textContent; }
    if (message) {
      input.setAttribute('aria-invalid', 'true');
      help.className = 'error';
      help.textContent = 'Error: ' + message;
    } else {
      input.removeAttribute('aria-invalid');
      help.className = 'help';
      help.textContent = help.dataset.help;
    }
    return !message;
  }

  function parseNumber(value) {
    var cleaned = value.replace(/[$,\s]/g, '');
    if (cleaned === '' || !/^\d*\.?\d+$/.test(cleaned)) { return NaN; }
    return parseFloat(cleaned);
  }

  lineForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var desc = document.getElementById('f-desc');
    var qty = document.getElementById('f-qty');
    var rate = document.getElementById('f-rate');
    var q = parseNumber(qty.value);
    var r = parseNumber(rate.value);

    var okDesc = setError(desc, desc.value.trim() ? '' : 'Name the work, for example "Menu layout, 6 pages".');
    var okQty = setError(qty, q > 0 ? '' : 'Enter a number above zero, for example 6.');
    var okRate = setError(rate, r >= 0 ? '' : 'Enter an amount in dollars, for example 95.');

    if (!okDesc) { desc.focus(); return; }
    if (!okQty) { qty.focus(); return; }
    if (!okRate) { rate.focus(); return; }

    lines.push({ desc: desc.value.trim(), qty: q, rate: r });
    render(lines.length - 1);
    lineForm.reset();
    desc.focus();
  });

  ['f-desc', 'f-qty', 'f-rate', 'f-email'].forEach(function (id) {
    var input = document.getElementById(id);
    input.addEventListener('input', function () {
      if (input.hasAttribute('aria-invalid')) { setError(input, ''); }
    });
  });

  var flatStamp = document.getElementById('flat-stamp');
  var stampToggle = document.getElementById('stamp-toggle');
  function setStamp(stamped) {
    flatStamp.hidden = !stamped;
    stampToggle.setAttribute('aria-pressed', String(stamped));
    stampToggle.textContent = stamped ? 'Lift the stamp' : 'Stamp it paid';
  }
  stampToggle.addEventListener('click', function () { setStamp(flatStamp.hidden); });

  render();

  /* ---------- Get your pad ----------
     This page has no server behind it. The request below is simulated with a timer.
     Replace sendLink() with a real request before this page goes live. */

  var startForm = document.getElementById('start-form');
  var email = document.getElementById('f-email');
  var submit = document.getElementById('start-submit');
  var spinner = submit.querySelector('.spinner');
  var done = document.getElementById('start-done');
  var doneText = document.getElementById('start-done-text');
  var sending = false;

  function sendLink() {
    return new Promise(function (resolve, reject) {
      window.setTimeout(function () {
        if (navigator.onLine === false) { reject(new Error('offline')); } else { resolve(); }
      }, 900);
    });
  }

  function setSending(state) {
    sending = state;
    spinner.hidden = !state;
    submit.classList.toggle('is-loading', state);
    submit.setAttribute('aria-busy', String(state));
  }

  startForm.addEventListener('submit', function (event) {
    event.preventDefault();
    if (sending) { return; } // clicks are ignored while the request is out

    var value = email.value.trim();
    var message = '';
    if (!value) {
      message = 'Enter the email you use for client work.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      message = 'That address is incomplete. It needs a name, an @ and a domain, like mara@oyelaran.example.';
    }
    if (!setError(email, message)) { email.focus(); return; }

    setSending(true);
    sendLink().then(function () {
      setSending(false);
      startForm.hidden = true;
      doneText.textContent = 'Check ' + value + ' for a sign-in link. It opens your pad at invoice No. 0001.';
      done.hidden = false;
      done.focus();
    }, function () {
      setSending(false);
      setError(email, 'You are offline, so the link was not sent. Reconnect, then press "Send my sign-in link" again.');
      email.focus();
    });
  });
}());
