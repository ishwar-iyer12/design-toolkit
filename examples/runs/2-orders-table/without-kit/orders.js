/* Orders page, plain JavaScript, no build step.
 *
 * To connect real data, replace loadOrders() and the three functions under
 * "Mutations" (shipOrder, deliverOrder, refundOrder) with calls to your API.
 * Everything else reads from the `orders` array.
 */
(() => {
  'use strict';

  const CONFIG = {
    locale: undefined, // undefined = the browser's locale
    currency: 'USD',
    pageSize: 25,
  };

  /* ------------------------------------------------------------------ */
  /* Sample data                                                         */
  /* ------------------------------------------------------------------ */

  function loadOrders() {
    return createSampleOrders(86);
  }

  function createSampleOrders(count) {
    // Seeded so the list is the same on every load.
    let seed = 7411;
    const rand = () => {
      seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const pick = (list) => list[Math.floor(rand() * list.length)];
    const between = (min, max) => min + rand() * (max - min);

    const products = [
      ['Stoneware mug, sand', 'MUG-SND', 2400],
      ['Linen throw, oat', 'THR-OAT', 8900],
      ['Oak serving board', 'BRD-OAK', 5400],
      ['Beeswax candle, pair', 'CND-BWX', 1800],
      ['Wool blanket, charcoal', 'BLK-CHR', 14500],
      ['Cotton tea towels, set of 2', 'TWL-CTN', 2200],
      ['Enamel pitcher, white', 'PTC-WHT', 3800],
      ['Glass carafe, 1 l', 'CRF-1L', 3200],
      ['Seagrass basket, large', 'BSK-LRG', 4600],
      ['Brass wall hook', 'HK-BRS', 1200],
      ['Ceramic planter, 20 cm', 'PLT-20', 3400],
      ['Linen napkins, set of 4', 'NPK-LIN', 3600],
    ];
    const people = [
      'Amara Okafor', 'Daniel Reyes', 'Priya Natarajan', 'Tomás Herrera', 'Hannah Lindqvist',
      'Wei Zhang', 'Fatima Al-Sayed', 'Marcus Bell', 'Sofia Romano', 'Kenji Watanabe',
      'Leila Haddad', 'Owen Gallagher', 'Nia Thompson', 'Arjun Mehta', 'Claire Dubois',
      'Mateo Silva', 'Grace Kim', 'Ibrahim Yusuf', 'Elena Petrova', 'Jonah Fischer',
      'Rosa Delgado', 'Samir Khan', 'Alice Brennan', 'Noah Adeyemi',
    ];
    const places = [
      ['Portland', 'OR', '97209'], ['Austin', 'TX', '78704'], ['Brooklyn', 'NY', '11215'],
      ['Minneapolis', 'MN', '55408'], ['Denver', 'CO', '80205'], ['Oakland', 'CA', '94609'],
      ['Chicago', 'IL', '60647'], ['Asheville', 'NC', '28801'], ['Seattle', 'WA', '98103'],
      ['Providence', 'RI', '02906'],
    ];
    const streets = ['Alder St', 'Maple Ave', 'Juniper Ln', 'Cedar Rd', 'Holloway St', 'Mercer Ave', 'Birch Ct', 'Larkin St'];
    const cards = ['Visa', 'Mastercard', 'Amex'];

    const now = Date.now();
    const HOUR = 3600e3;
    const DAY = 24 * HOUR;
    const list = [];
    let at = now - between(0.2, 1.5) * HOUR;

    for (let i = 0; i < count; i++) {
      const number = 1000 + count - i;
      const name = pick(people);
      const place = pick(places);
      const ageDays = (now - at) / DAY;

      const items = [];
      const lineCount = 1 + Math.floor(rand() * rand() * 4);
      const used = new Set();
      while (items.length < lineCount) {
        const p = pick(products);
        if (used.has(p[1])) continue;
        used.add(p[1]);
        items.push({ name: p[0], sku: p[1], price: p[2], qty: rand() < 0.75 ? 1 : 2 });
      }
      const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
      const shipping = subtotal >= 10000 ? 0 : 800;
      const tax = Math.round(subtotal * 0.0725);

      let payment = 'paid';
      let fulfilment = 'unfulfilled';
      const r = rand();
      const r2 = rand();
      if (r < 0.05) {
        payment = r2 < 0.5 ? 'failed' : 'refunded';
        fulfilment = 'cancelled';
      } else if (ageDays < 1.5) {
        payment = r2 < 0.3 ? 'pending' : 'paid';
        fulfilment = payment === 'paid' && r > 0.85 ? 'shipped' : 'unfulfilled';
      } else if (ageDays < 5) {
        payment = r2 < 0.12 ? 'pending' : 'paid';
        if (payment === 'paid') fulfilment = r < 0.25 ? 'unfulfilled' : r < 0.8 ? 'shipped' : 'delivered';
      } else {
        fulfilment = r < 0.12 ? 'shipped' : 'delivered';
        if (r2 < 0.06) payment = 'refunded';
      }

      const order = {
        id: String(number),
        createdAt: at,
        customer: {
          name,
          email: name.toLowerCase().normalize('NFD').replace(/[^a-z ]/g, '').replace(/ /g, '.') + '@example.com',
        },
        address: {
          line1: `${Math.floor(between(12, 4800))} ${pick(streets)}`,
          city: place[0], region: place[1], postcode: place[2], country: 'United States',
        },
        items, subtotal, shipping, tax,
        total: subtotal + shipping + tax,
        payment, fulfilment,
        method: `${pick(cards)} ending ${String(Math.floor(between(1000, 9999)))}`,
        tracking: null,
        events: [{ at, text: 'Order placed' }],
      };

      // Build a plausible history that never runs past "now".
      let cursor = at;
      const step = (text) => {
        cursor = cursor + between(0.2, 0.7) * (now - cursor);
        order.events.push({ at: cursor, text });
      };
      if (payment === 'failed') step('Payment failed');
      if (payment === 'paid' || payment === 'refunded') {
        order.events.push({ at: at + 60e3 > now ? now : at + 60e3, text: `Payment captured · ${order.method}` });
      }
      if (fulfilment === 'shipped' || fulfilment === 'delivered') {
        order.tracking = '1Z' + String(Math.floor(between(1e9, 9.99e9)));
        step(`Shipped · tracking ${order.tracking}`);
      }
      if (fulfilment === 'delivered') step('Delivered');
      if (payment === 'refunded') step('Payment refunded');
      if (fulfilment === 'cancelled') step('Order cancelled');

      list.push(order);
      at -= between(2, 18) * HOUR;
    }
    return list;
  }

  /* ------------------------------------------------------------------ */
  /* State                                                               */
  /* ------------------------------------------------------------------ */

  const TABS = [
    { key: 'all', label: 'All', test: () => true },
    { key: 'to-fulfil', label: 'To fulfil', action: true, test: (o) => o.payment === 'paid' && o.fulfilment === 'unfulfilled' },
    { key: 'awaiting-payment', label: 'Awaiting payment', test: (o) => o.payment === 'pending' },
    { key: 'shipped', label: 'Shipped', test: (o) => o.fulfilment === 'shipped' && o.payment !== 'refunded' },
    { key: 'delivered', label: 'Delivered', test: (o) => o.fulfilment === 'delivered' && o.payment !== 'refunded' },
    { key: 'closed', label: 'Cancelled and refunded', test: (o) => o.fulfilment === 'cancelled' || o.payment === 'refunded' || o.payment === 'failed' },
  ];
  const RANGES = ['all', 'today', '7d', '30d'];
  const SORTS = ['date', 'customer', 'total'];

  const orders = loadOrders();
  const byId = new Map(orders.map((o) => [o.id, o]));

  const state = {
    tab: 'all',
    q: '',
    range: 'all',
    sort: 'date',
    dir: 'desc',
    page: 1,
    selected: new Set(),
    openId: null,
    confirmingRefund: false,
  };

  /* ------------------------------------------------------------------ */
  /* Formatting                                                          */
  /* ------------------------------------------------------------------ */

  const moneyFmt = new Intl.NumberFormat(CONFIG.locale, { style: 'currency', currency: CONFIG.currency });
  const timeFmt = new Intl.DateTimeFormat(CONFIG.locale, { hour: 'numeric', minute: '2-digit' });
  const dayFmt = new Intl.DateTimeFormat(CONFIG.locale, { day: 'numeric', month: 'short' });
  const dayYearFmt = new Intl.DateTimeFormat(CONFIG.locale, { day: 'numeric', month: 'short', year: 'numeric' });
  const fullFmt = new Intl.DateTimeFormat(CONFIG.locale, { dateStyle: 'medium', timeStyle: 'short' });
  const countFmt = new Intl.NumberFormat(CONFIG.locale);

  const money = (cents) => moneyFmt.format(cents / 100);
  const plural = (n, one, many) => `${countFmt.format(n)} ${n === 1 ? one : many}`;

  function startOfDay(ms) {
    const d = new Date(ms);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }

  function shortDate(ms) {
    const today = startOfDay(Date.now());
    const day = startOfDay(ms);
    if (day === today) return `Today, ${timeFmt.format(ms)}`;
    if (day === startOfDay(today - 1)) return `Yesterday, ${timeFmt.format(ms)}`;
    const sameYear = new Date(ms).getFullYear() === new Date().getFullYear();
    return (sameYear ? dayFmt : dayYearFmt).format(ms);
  }

  const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ESC[c]);

  const PAYMENT = {
    paid: ['Paid', 't-ok'],
    pending: ['Payment pending', 't-warn'],
    failed: ['Payment failed', 't-bad'],
    refunded: ['Refunded', 't-mute'],
  };
  const FULFILMENT = {
    unfulfilled: ['Unfulfilled', 't-warn'],
    shipped: ['Shipped', 't-info'],
    delivered: ['Delivered', 't-ok'],
    cancelled: ['Cancelled', 't-mute'],
  };

  function paymentStatus(o) {
    const [label, tone] = PAYMENT[o.payment];
    return `<span class="status ${tone}">${label}</span>`;
  }

  function fulfilmentStatus(o) {
    let [label, tone] = FULFILMENT[o.fulfilment];
    // Unfulfilled only needs attention once the order has been paid for.
    if (o.fulfilment === 'unfulfilled' && o.payment !== 'paid') tone = 't-mute';
    return `<span class="status ${tone}">${label}</span>`;
  }

  const canShip = (o) => o.payment === 'paid' && o.fulfilment === 'unfulfilled';
  const canDeliver = (o) => o.payment === 'paid' && o.fulfilment === 'shipped';
  const canRefund = (o) => o.payment === 'paid';

  /* ------------------------------------------------------------------ */
  /* Filtering                                                           */
  /* ------------------------------------------------------------------ */

  function matchesSearchAndRange(o) {
    if (state.range !== 'all') {
      const today = startOfDay(Date.now());
      const from = state.range === 'today' ? today
        : state.range === '7d' ? startOfDay(today - 6 * 864e5 + 36e5)
        : startOfDay(today - 29 * 864e5 + 36e5);
      if (o.createdAt < from) return false;
    }
    const q = state.q.trim().toLowerCase().replace(/^#/, '');
    if (!q) return true;
    return o.id.includes(q)
      || o.customer.name.toLowerCase().includes(q)
      || o.customer.email.toLowerCase().includes(q);
  }

  function getVisible() {
    const tab = TABS.find((t) => t.key === state.tab);
    const base = orders.filter(matchesSearchAndRange);
    const rows = base.filter(tab.test);
    const dir = state.dir === 'asc' ? 1 : -1;
    rows.sort((a, b) => {
      let diff = 0;
      if (state.sort === 'total') diff = a.total - b.total;
      else if (state.sort === 'customer') diff = a.customer.name.localeCompare(b.customer.name);
      if (diff === 0) return (a.createdAt - b.createdAt) * (state.sort === 'date' ? dir : -1);
      return diff * dir;
    });
    return { base, rows };
  }

  function getPage(rows) {
    const pages = Math.max(1, Math.ceil(rows.length / CONFIG.pageSize));
    state.page = Math.min(Math.max(1, state.page), pages);
    const start = (state.page - 1) * CONFIG.pageSize;
    return { pages, start, slice: rows.slice(start, start + CONFIG.pageSize) };
  }

  /* ------------------------------------------------------------------ */
  /* Rendering                                                           */
  /* ------------------------------------------------------------------ */

  const $ = (id) => document.getElementById(id);
  const el = {
    sub: $('page-sub'), tabs: $('tabs'), search: $('search'), range: $('range'),
    table: $('orders-table'), rows: $('rows'), empty: $('empty'), selectAll: $('select-all'),
    pager: $('pager'), pagerInfo: $('pager-info'), prev: $('prev-page'), next: $('next-page'),
    bulk: $('bulk'), bulkCount: $('bulk-count'), bulkShip: $('bulk-ship'),
    drawer: $('drawer'), drawerBody: $('drawer-body'), toast: $('toast'),
    exportBtn: $('export-btn'),
  };

  function render() {
    const { base, rows } = getVisible();
    const { pages, start, slice } = getPage(rows);

    const waiting = orders.filter(canShip).length;
    el.sub.textContent = waiting
      ? `${plural(waiting, 'order is', 'orders are')} paid and waiting to ship.`
      : 'Nothing is waiting to ship.';

    el.tabs.innerHTML = TABS.map((t) => {
      const n = base.filter(t.test).length;
      const current = t.key === state.tab;
      const flag = t.action && n > 0 ? ' needs-action' : '';
      return `<button type="button" class="tab${flag}" data-tab="${t.key}"${current ? ' aria-current="true"' : ''}>${t.label}<span class="tab-count">${countFmt.format(n)}</span></button>`;
    }).join('');

    el.rows.innerHTML = slice.map((o) => {
      const selected = state.selected.has(o.id);
      const units = o.items.reduce((sum, it) => sum + it.qty, 0);
      return `<tr data-id="${o.id}"${selected ? ' class="is-selected"' : ''}>
        <td class="c-check"><input type="checkbox" data-select="${o.id}" aria-label="Select order ${o.id}"${selected ? ' checked' : ''}></td>
        <td class="c-order"><button type="button" class="order-link" data-open="${o.id}" aria-haspopup="dialog">#${o.id}</button></td>
        <td class="c-date"><time datetime="${new Date(o.createdAt).toISOString()}" title="${esc(fullFmt.format(o.createdAt))}">${esc(shortDate(o.createdAt))}</time></td>
        <td class="c-customer"><span class="name">${esc(o.customer.name)}</span><span class="sub">${esc(o.customer.email)}</span></td>
        <td class="c-items">${plural(units, 'item', 'items')}</td>
        <td class="c-total num">${esc(money(o.total))}</td>
        <td class="c-pay">${paymentStatus(o)}</td>
        <td class="c-ful">${fulfilmentStatus(o)}</td>
      </tr>`;
    }).join('');

    const none = rows.length === 0;
    el.empty.hidden = !none;
    el.table.hidden = none;
    el.pager.hidden = none;
    el.exportBtn.disabled = none;

    document.querySelectorAll('th[data-sort]').forEach((th) => {
      if (th.dataset.sort === state.sort) th.setAttribute('aria-sort', state.dir === 'asc' ? 'ascending' : 'descending');
      else th.removeAttribute('aria-sort');
    });

    const onPage = slice.filter((o) => state.selected.has(o.id)).length;
    el.selectAll.checked = slice.length > 0 && onPage === slice.length;
    el.selectAll.indeterminate = onPage > 0 && onPage < slice.length;

    el.pagerInfo.textContent = none ? '' : `${countFmt.format(start + 1)} to ${countFmt.format(start + slice.length)} of ${countFmt.format(rows.length)}`;
    el.prev.disabled = state.page <= 1;
    el.next.disabled = state.page >= pages;

    renderBulk();
    syncUrl();
  }

  function renderBulk() {
    const n = state.selected.size;
    el.bulk.hidden = n === 0;
    if (!n) return;
    const ready = [...state.selected].filter((id) => canShip(byId.get(id))).length;
    el.bulkCount.textContent = `${countFmt.format(n)} selected`;
    el.bulkShip.textContent = ready ? `Mark ${countFmt.format(ready)} as shipped` : 'None ready to ship';
    el.bulkShip.disabled = ready === 0;
  }

  function renderDrawer() {
    const o = byId.get(state.openId);
    if (!o) return;

    let actions = '';
    if (state.confirmingRefund) {
      actions = `
        <p class="drawer-note">Refund ${esc(money(o.total))} to ${esc(o.method)}? This can't be undone.</p>
        <button type="button" class="btn btn-danger-solid" data-action="refund-confirm">Refund ${esc(money(o.total))}</button>
        <button type="button" class="btn" data-action="refund-cancel" data-focus>Keep payment</button>`;
    } else {
      if (canShip(o)) actions += '<button type="button" class="btn btn-primary" data-action="ship" data-focus>Mark as shipped</button>';
      if (canDeliver(o)) actions += '<button type="button" class="btn btn-primary" data-action="deliver" data-focus>Mark as delivered</button>';
      if (canRefund(o)) actions += '<button type="button" class="btn btn-danger" data-action="refund">Refund…</button>';
      if (o.payment === 'pending') actions += '<p class="drawer-note">Waiting for payment. This order can be shipped once payment is captured.</p>';
    }

    const items = o.items.map((it) => `
      <li>
        <span class="item-name">${esc(it.name)}</span>
        <span class="item-price num">${esc(money(it.price * it.qty))}</span>
        <span class="item-sub"><span class="sku">${esc(it.sku)}</span> · ${it.qty} × ${esc(money(it.price))}</span>
      </li>`).join('');

    const events = [...o.events].sort((a, b) => b.at - a.at).map((e) => `
      <li>${esc(e.text)}<time datetime="${new Date(e.at).toISOString()}">${esc(fullFmt.format(e.at))}</time></li>`).join('');

    el.drawerBody.innerHTML = `
      <header class="drawer-head">
        <div>
          <h2 class="drawer-title" id="drawer-title">#${o.id}</h2>
          <p class="drawer-meta">Placed ${esc(fullFmt.format(o.createdAt))}</p>
          <div class="drawer-status">${paymentStatus(o)}${fulfilmentStatus(o)}</div>
        </div>
        <button type="button" class="icon-btn" data-action="close" aria-label="Close order details">
          <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
        </button>
      </header>
      ${actions ? `<div class="drawer-actions">${actions}</div>` : ''}
      <section class="drawer-section">
        <h3>Items</h3>
        <ul class="items">${items}</ul>
        <dl class="totals">
          <dt>Subtotal</dt><dd>${esc(money(o.subtotal))}</dd>
          <dt>Shipping</dt><dd>${o.shipping ? esc(money(o.shipping)) : 'Free'}</dd>
          <dt>Tax</dt><dd>${esc(money(o.tax))}</dd>
          <dt class="grand">Total</dt><dd class="grand">${esc(money(o.total))}</dd>
        </dl>
      </section>
      <section class="drawer-section">
        <div class="facts">
          <div>
            <h3>Customer</h3>
            <p class="strong">${esc(o.customer.name)}</p>
            <p><a href="mailto:${esc(o.customer.email)}">${esc(o.customer.email)}</a></p>
          </div>
          <div>
            <h3>Ship to</h3>
            <p>${esc(o.address.line1)}<br>${esc(o.address.city)}, ${esc(o.address.region)} ${esc(o.address.postcode)}<br>${esc(o.address.country)}</p>
          </div>
          <div>
            <h3>Payment method</h3>
            <p>${esc(o.method)}</p>
          </div>
          <div>
            <h3>Tracking</h3>
            <p${o.tracking ? ' class="mono"' : ''}>${o.tracking ? esc(o.tracking) : (o.fulfilment === 'shipped' || o.fulfilment === 'delivered') ? 'No tracking number' : o.fulfilment === 'cancelled' ? 'Not shipped' : 'Not shipped yet'}</p>
          </div>
        </div>
      </section>
      <section class="drawer-section">
        <h3>History</h3>
        <ol class="timeline">${events}</ol>
      </section>`;

    const target = el.drawerBody.querySelector('[data-focus]') || el.drawerBody.querySelector('[data-action="close"]');
    target.focus();
  }

  /* ------------------------------------------------------------------ */
  /* Drawer                                                              */
  /* ------------------------------------------------------------------ */

  function openDrawer(id) {
    if (!byId.has(id)) return;
    state.openId = id;
    state.confirmingRefund = false;
    if (!el.drawer.open) el.drawer.showModal();
    document.documentElement.classList.add('is-locked');
    el.drawer.scrollTop = 0;
    renderDrawer();
  }

  el.drawer.addEventListener('close', () => {
    const id = state.openId;
    state.openId = null;
    state.confirmingRefund = false;
    document.documentElement.classList.remove('is-locked');
    // The table may have been re-rendered while the drawer was open.
    const trigger = el.rows.querySelector(`[data-open="${id}"]`);
    if (trigger) trigger.focus();
  });

  el.drawer.addEventListener('click', (e) => {
    if (e.target === el.drawer) { el.drawer.close(); return; }
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const o = byId.get(state.openId);
    const action = btn.dataset.action;

    if (action === 'close') { el.drawer.close(); return; }
    if (action === 'refund') state.confirmingRefund = true;
    if (action === 'refund-cancel') state.confirmingRefund = false;
    if (action === 'ship' && shipOrder(o)) toast(`#${o.id} marked as shipped`);
    if (action === 'deliver' && deliverOrder(o)) toast(`#${o.id} marked as delivered`);
    if (action === 'refund-confirm') {
      state.confirmingRefund = false;
      if (refundOrder(o)) toast(`${money(o.total)} refunded for #${o.id}`);
    }
    render();
    renderDrawer();
  });

  /* ------------------------------------------------------------------ */
  /* Mutations: swap these for API calls                               */
  /* ------------------------------------------------------------------ */

  function shipOrder(o) {
    if (!canShip(o)) return false;
    o.fulfilment = 'shipped';
    o.events.push({ at: Date.now(), text: 'Marked as shipped' });
    return true;
  }

  function deliverOrder(o) {
    if (!canDeliver(o)) return false;
    o.fulfilment = 'delivered';
    o.events.push({ at: Date.now(), text: 'Marked as delivered' });
    return true;
  }

  function refundOrder(o) {
    if (!canRefund(o)) return false;
    o.payment = 'refunded';
    o.events.push({ at: Date.now(), text: 'Payment refunded' });
    if (o.fulfilment === 'unfulfilled') {
      o.fulfilment = 'cancelled';
      o.events.push({ at: Date.now(), text: 'Order cancelled' });
    }
    return true;
  }

  /* ------------------------------------------------------------------ */
  /* CSV export                                                          */
  /* ------------------------------------------------------------------ */

  function csvCell(value) {
    let s = String(value);
    // Stop spreadsheet apps from running customer-supplied text as a formula.
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  }

  function exportCsv(list) {
    if (!list.length) return;
    const header = ['Order', 'Placed', 'Customer', 'Email', 'Items', 'Total', 'Currency', 'Payment', 'Fulfilment', 'Tracking'];
    const lines = list.map((o) => [
      o.id,
      new Date(o.createdAt).toISOString(),
      o.customer.name,
      o.customer.email,
      o.items.reduce((sum, it) => sum + it.qty, 0),
      (o.total / 100).toFixed(2),
      CONFIG.currency,
      o.payment,
      o.fulfilment,
      o.tracking || '',
    ].map(csvCell).join(','));
    const csv = '﻿' + [header.join(','), ...lines].join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast(`Exported ${plural(list.length, 'order', 'orders')}`);
  }

  /* ------------------------------------------------------------------ */
  /* Toast                                                               */
  /* ------------------------------------------------------------------ */

  let toastTimer;
  function toast(message) {
    // A modal dialog sits in the top layer, so the toast has to live inside it to be seen.
    const host = el.drawer.open ? el.drawer : document.body;
    if (el.toast.parentNode !== host) host.appendChild(el.toast);
    el.toast.textContent = message;
    el.toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.toast.classList.remove('is-visible'), 3200);
  }

  /* ------------------------------------------------------------------ */
  /* URL                                                                 */
  /* ------------------------------------------------------------------ */

  function readUrl() {
    const p = new URLSearchParams(location.search);
    const tab = p.get('status');
    if (TABS.some((t) => t.key === tab)) state.tab = tab;
    if (RANGES.includes(p.get('range'))) state.range = p.get('range');
    if (SORTS.includes(p.get('sort'))) state.sort = p.get('sort');
    if (p.get('dir') === 'asc' || p.get('dir') === 'desc') state.dir = p.get('dir');
    state.q = p.get('q') || '';
    state.page = parseInt(p.get('page'), 10) || 1;
  }

  function syncUrl() {
    const p = new URLSearchParams();
    if (state.tab !== 'all') p.set('status', state.tab);
    if (state.q.trim()) p.set('q', state.q.trim());
    if (state.range !== 'all') p.set('range', state.range);
    if (state.sort !== 'date' || state.dir !== 'desc') { p.set('sort', state.sort); p.set('dir', state.dir); }
    if (state.page > 1) p.set('page', String(state.page));
    const query = p.toString();
    try {
      history.replaceState(null, '', location.pathname + (query ? '?' + query : '') + location.hash);
    } catch (err) {
      /* Some browsers block this on file:// pages. The page works without it. */
    }
  }

  /* ------------------------------------------------------------------ */
  /* Events                                                              */
  /* ------------------------------------------------------------------ */

  // Changing what's listed clears the selection, so bulk actions only ever
  // apply to rows that are on screen.
  function changeView(patch) {
    Object.assign(state, patch);
    state.selected.clear();
    render();
  }

  el.tabs.addEventListener('click', (e) => {
    const tab = e.target.closest('[data-tab]');
    if (!tab) return;
    const key = tab.dataset.tab;
    changeView({ tab: key, page: 1 });
    const again = el.tabs.querySelector(`[data-tab="${key}"]`);
    if (again) again.focus();
  });

  el.search.addEventListener('input', () => changeView({ q: el.search.value, page: 1 }));
  el.range.addEventListener('change', () => changeView({ range: el.range.value, page: 1 }));

  document.querySelector('.orders thead').addEventListener('click', (e) => {
    const th = e.target.closest('th[data-sort]');
    if (!th || !e.target.closest('.sort-btn')) return;
    const key = th.dataset.sort;
    const dir = state.sort === key
      ? (state.dir === 'asc' ? 'desc' : 'asc')
      : (key === 'customer' ? 'asc' : 'desc');
    changeView({ sort: key, dir, page: 1 });
  });

  el.rows.addEventListener('click', (e) => {
    if (e.target.closest('input, a')) return;
    if (e.target.closest('.c-check')) {
      // A near miss on the checkbox should tick it, not open the order.
      const box = e.target.closest('.c-check').querySelector('input');
      box.checked = !box.checked;
      toggleSelect(box.dataset.select, box.checked);
      return;
    }
    const row = e.target.closest('tr[data-id]');
    if (!row) return;
    if (String(window.getSelection()).trim()) return; // the user is selecting text
    openDrawer(row.dataset.id);
  });

  el.rows.addEventListener('change', (e) => {
    if (e.target.matches('[data-select]')) toggleSelect(e.target.dataset.select, e.target.checked);
  });

  function toggleSelect(id, on) {
    if (on) state.selected.add(id); else state.selected.delete(id);
    render();
    const box = el.rows.querySelector(`[data-select="${id}"]`);
    if (box) box.focus();
  }

  el.selectAll.addEventListener('change', () => {
    const { slice } = getPage(getVisible().rows);
    slice.forEach((o) => {
      if (el.selectAll.checked) state.selected.add(o.id); else state.selected.delete(o.id);
    });
    render();
  });

  el.prev.addEventListener('click', () => { changeView({ page: state.page - 1 }); scrollToList(); });
  el.next.addEventListener('click', () => { changeView({ page: state.page + 1 }); scrollToList(); });

  function scrollToList() {
    const top = el.tabs.getBoundingClientRect().top;
    if (top < 0) window.scrollBy({ top: top - 16 });
  }

  $('clear-filters').addEventListener('click', () => {
    el.search.value = '';
    el.range.value = 'all';
    changeView({ tab: 'all', q: '', range: 'all', page: 1 });
    el.search.focus();
  });

  el.exportBtn.addEventListener('click', () => exportCsv(getVisible().rows));

  $('bulk-export').addEventListener('click', () => {
    exportCsv(orders.filter((o) => state.selected.has(o.id)));
  });

  $('bulk-clear').addEventListener('click', () => {
    state.selected.clear();
    render();
    el.selectAll.focus();
  });

  el.bulkShip.addEventListener('click', () => {
    const picked = [...state.selected].map((id) => byId.get(id));
    const shipped = picked.filter(shipOrder).length;
    const skipped = picked.length - shipped;
    state.selected.clear();
    render();
    toast(`${plural(shipped, 'order', 'orders')} marked as shipped` + (skipped ? ` · ${skipped} skipped (not ready to ship)` : ''));
    el.selectAll.focus();
  });

  const navToggle = $('nav-toggle');
  navToggle.addEventListener('click', () => {
    const open = $('site-nav').classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  /* ------------------------------------------------------------------ */
  /* Start                                                               */
  /* ------------------------------------------------------------------ */

  readUrl();
  el.search.value = state.q;
  el.range.value = state.range;
  render();
})();
