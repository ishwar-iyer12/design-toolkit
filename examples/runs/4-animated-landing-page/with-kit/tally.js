/* Tally landing page. No libraries. Everything here is added on top of a
   page that already reads and works without script. */
(function () {
  'use strict';

  var root = document.documentElement;
  var params = new URLSearchParams(window.location.search);
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  root.classList.add('js');

  /* Test clock, used to look at the middle of the animation.
     ?freeze=1500   pause the signature 1500ms in
     ?float=25      pause the idle float at 25% of its loop
     ?tilt=1,-1     hold the pointer tilt at a corner (x,y from -1 to 1) */
  var frozen = params.has('freeze') || params.has('float') || params.has('tilt');
  if (params.has('freeze')) {
    root.style.setProperty('--t', parseFloat(params.get('freeze')) + 'ms');
  } else if (frozen) {
    root.style.setProperty('--t', '60000ms');
  }
  if (frozen) { root.classList.add('is-frozen'); }

  /* will-change only while the signature runs. */
  if (!reduced && !frozen) {
    root.classList.add('sig-running');
    window.setTimeout(function () { root.classList.remove('sig-running'); }, 3600);
  }

  document.addEventListener('DOMContentLoaded', function () {
    setUpFloat();
    setUpTilt();
    setUpInvoice();
    setUpStart();
  });

  /* ---------- Idle float, with a pause control ---------- */

  function setUpFloat() {
    var stage = document.getElementById('stage');
    var toggle = document.getElementById('float-toggle');
    if (!stage || !toggle || reduced) { return; }

    if (params.has('float')) {
      root.style.setProperty('--float-t', (5 + 8 * parseFloat(params.get('float')) / 100) + 's');
    }
    root.classList.add('js-float');
    toggle.hidden = false;

    toggle.addEventListener('click', function () {
      var paused = root.classList.toggle('is-float-paused');
      toggle.setAttribute('aria-pressed', String(paused));
      toggle.textContent = paused ? 'Resume the float' : 'Pause the float';
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        root.classList.toggle('is-offscreen', !entries[0].isIntersecting);
      }).observe(stage);
    }
  }

  /* ---------- Pointer tilt: mouse only, capped at 8 degrees ---------- */

  function setUpTilt() {
    var stage = document.getElementById('stage');
    var tilt = document.getElementById('tilt');
    var MAX = 8;
    if (!stage || !tilt || reduced) { return; }

    function set(x, y) {
      x = Math.max(-1, Math.min(1, x));
      y = Math.max(-1, Math.min(1, y));
      tilt.style.setProperty('--tilt-y', (x * MAX).toFixed(2) + 'deg');
      tilt.style.setProperty('--tilt-x', (-y * MAX).toFixed(2) + 'deg');
    }

    if (params.has('tilt')) {
      var parts = params.get('tilt').split(',');
      set(parseFloat(parts[0]) || 0, parseFloat(parts[1]) || 0);
      return;
    }

    stage.addEventListener('pointermove', function (event) {
      if (event.pointerType !== 'mouse') { return; }
      var box = stage.getBoundingClientRect();
      set((event.clientX - box.left) / box.width * 2 - 1,
          (event.clientY - box.top) / box.height * 2 - 1);
    });
    stage.addEventListener('pointerleave', function () { set(0, 0); });
  }

  /* ---------- Sample invoice ---------- */

  function setUpInvoice() {
    var body = document.getElementById('lines-body');
    var form = document.getElementById('add-form');
    if (!body || !form) { return; }

    var empty = document.getElementById('lines-empty');
    var scroll = body.closest('.table-scroll');
    var stamp = document.getElementById('flat-stamp');
    var status = document.getElementById('flat-status');
    var addStatus = document.getElementById('add-status');
    var money = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });
    var VAT = 0.2;

    var lines = [
      { desc: 'Brand identity: discovery and strategy', qty: 12, unit: 'h', rate: 85 },
      { desc: 'Logo suite and wordmark, fixed fee', qty: 1, unit: '', rate: 2400 },
      { desc: 'Packaging: 250g bag, three origins', qty: 18, unit: 'h', rate: 85 },
      { desc: 'Revisions, round two', qty: 4, unit: 'h', rate: 85 }
    ];

    function cell(tag, text, className) {
      var el = document.createElement(tag);
      el.textContent = text;
      if (className) { el.className = className; }
      return el;
    }

    function render(newIndex) {
      body.textContent = '';
      lines.forEach(function (line, index) {
        var row = document.createElement('tr');
        var head = cell('th', line.desc);
        head.scope = 'row';
        row.appendChild(head);
        row.appendChild(cell('td', line.qty + (line.unit ? ' ' + line.unit : ''), 'num'));
        row.appendChild(cell('td', money.format(line.rate), 'num'));
        row.appendChild(cell('td', money.format(line.qty * line.rate), 'num'));

        var act = document.createElement('td');
        act.className = 'act';
        var remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'btn btn-quiet btn-small';
        remove.textContent = 'Remove';
        remove.setAttribute('aria-label', 'Remove line: ' + line.desc);
        remove.addEventListener('click', function () {
          lines.splice(index, 1);
          markDraft();
          render();
          addStatus.textContent = 'Removed “' + line.desc + '”.';
          var next = body.querySelectorAll('button')[Math.min(index, lines.length - 1)];
          (next || document.getElementById('empty-add')).focus();
        });
        act.appendChild(remove);
        row.appendChild(act);

        if (index === newIndex) { row.className = 'line-new'; }
        body.appendChild(row);
      });

      var none = lines.length === 0;
      scroll.hidden = none;
      empty.hidden = !none;

      var sub = lines.reduce(function (sum, line) { return sum + line.qty * line.rate; }, 0);
      document.getElementById('t-sub').textContent = money.format(sub);
      document.getElementById('t-vat').textContent = money.format(sub * VAT);
      document.getElementById('t-due').textContent = money.format(sub * (1 + VAT));
    }

    function markDraft() {
      stamp.hidden = true;
      status.textContent = 'Draft. You changed this invoice, so it has not been paid. The stamp appears when the client pays.';
    }

    var fields = [
      {
        input: document.getElementById('f-desc'),
        help: 'What the client is paying for.',
        check: function (value) {
          return value.trim() ? '' : 'Error: The description is empty. Say what the work was, such as “Icon set, 24 icons”.';
        }
      },
      {
        input: document.getElementById('f-qty'),
        help: 'Use 1 for a fixed fee.',
        check: function (value) {
          var n = Number(value);
          return value.trim() && isFinite(n) && n > 0 ? '' : 'Error: Enter a number above 0, such as 6 or 1.5.';
        }
      },
      {
        input: document.getElementById('f-rate'),
        help: 'Before VAT.',
        check: function (value) {
          var n = Number(value);
          return value.trim() && isFinite(n) && n > 0 ? '' : 'Error: Enter the rate as a number, such as 85. Leave out the £ sign.';
        }
      }
    ];

    function show(field, message) {
      var help = document.getElementById(field.input.id + '-help');
      help.textContent = message || field.help;
      help.classList.toggle('is-error', Boolean(message));
      if (message) {
        field.input.setAttribute('aria-invalid', 'true');
      } else {
        field.input.removeAttribute('aria-invalid');
      }
    }

    fields.forEach(function (field) {
      field.input.addEventListener('input', function () {
        if (field.input.hasAttribute('aria-invalid')) { show(field, field.check(field.input.value)); }
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var firstBad = null;
      fields.forEach(function (field) {
        var message = field.check(field.input.value);
        show(field, message);
        if (message && !firstBad) { firstBad = field.input; }
      });
      if (firstBad) {
        addStatus.textContent = '';
        firstBad.focus();
        return;
      }
      var qty = Number(fields[1].input.value);
      lines.push({
        desc: fields[0].input.value.trim(),
        qty: qty,
        unit: qty === 1 ? '' : 'h',
        rate: Number(fields[2].input.value)
      });
      markDraft();
      render(lines.length - 1);
      addStatus.textContent = 'Added “' + lines[lines.length - 1].desc + '” to the invoice.';
      form.reset();
      fields[0].input.focus();
    });

    document.getElementById('empty-add').addEventListener('click', function () {
      fields[0].input.focus();
    });

    if (params.get('state') === 'empty') { lines = []; markDraft(); }
    render();
    if (params.get('state') === 'error') {
      fields.forEach(function (field) { show(field, field.check('')); });
    }
  }

  /* ---------- Create account ---------- */

  function setUpStart() {
    var form = document.getElementById('start-form');
    if (!form) { return; }
    var input = document.getElementById('f-email');
    var help = document.getElementById('f-email-help');
    var done = document.getElementById('start-status');
    var helpText = help.textContent;

    function check(value) {
      value = value.trim();
      if (!value) { return 'Error: The email address is empty. Enter the one you want invoices sent from.'; }
      if (value.indexOf('@') < 1) { return 'Error: That address has no @ sign. It should look like maya@okaforstudio.example.'; }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) { return 'Error: The part after the @ is incomplete. It should end in something like .com or .co.uk.'; }
      return '';
    }

    function show(message) {
      help.textContent = message || helpText;
      help.classList.toggle('is-error', Boolean(message));
      if (message) {
        input.setAttribute('aria-invalid', 'true');
      } else {
        input.removeAttribute('aria-invalid');
      }
    }

    input.addEventListener('input', function () {
      if (input.hasAttribute('aria-invalid')) { show(check(input.value)); }
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var message = check(input.value);
      show(message);
      if (message) {
        done.textContent = '';
        input.focus();
        return;
      }
      done.textContent = 'This page is a design preview, so no account was created and nothing was sent to ' + input.value.trim() + '.';
    });

    if (params.get('state') === 'error') { show(check('maya.okaforstudio.co')); }
  }
}());
