(function () {
  "use strict";

  var SHOP_URL = "https://fernhillcoffee.example/shop";
  var DENSITY_KEY = "fernhill.orders.density";
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var STATUS_ORDER = ["Awaiting payment", "Payment failed", "Paid", "Roasting", "Shipped", "Delivered", "Refunded"];
  var STATUS_TONE = {
    "Awaiting payment": "warning",
    "Payment failed": "danger",
    "Delivered": "success"
  };

  var $ = function (id) { return document.getElementById(id); };
  var table = $("table"), rows = $("rows"), totals = $("totals");
  var tableWrap = $("table-wrap"), toolbar = $("toolbar");
  var message = $("message"), messageTitle = $("message-title");
  var messageBody = $("message-body"), messageAction = $("message-action");
  var search = $("search"), statusSelect = $("status"), placedSelect = $("placed");
  var clearButton = $("clear"), count = $("count");
  var exportButton = $("export"), exportHint = $("export-hint");

  var orders = [];
  var visible = [];
  var sort = { key: "placed", dir: "descending" };
  var onMessageAction = null;

  /* Preview a state without a backend: index.html?state=loading | empty | error */
  var forcedState = new URLSearchParams(window.location.search).get("state");

  /* ---------- Data ---------- */

  /* Swap this for a fetch() to the orders API. It must resolve to an array of
     { number, customer, placed: Date, items, total, status }. */
  function loadOrders() {
    if (forcedState === "loading") return new Promise(function () {});
    if (forcedState === "error") {
      forcedState = null; /* so "Try again" can succeed in the preview */
      return Promise.reject(new Error("timeout"));
    }
    if (forcedState === "empty") return Promise.resolve([]);
    var now = Date.now();
    return Promise.resolve(window.SAMPLE_ORDERS.map(function (o) {
      return {
        number: o[0], customer: o[1], placed: new Date(now - o[2] * 60000),
        items: o[3], total: o[4], status: o[5]
      };
    }));
  }

  /* ---------- Formatting ---------- */

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  function formatPlaced(d) {
    return pad(d.getDate()) + " " + MONTHS[d.getMonth()] + " " + d.getFullYear() +
      ", " + pad(d.getHours()) + ":" + pad(d.getMinutes());
  }

  function formatMoney(n) {
    return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  /* ---------- States ---------- */

  function showMessage(kind, title, body, actionLabel, action) {
    message.dataset.kind = kind;
    messageTitle.textContent = title;
    messageBody.textContent = body;
    messageAction.textContent = actionLabel;
    onMessageAction = action;
    message.hidden = false;
    tableWrap.hidden = true;
    if (kind === "error") message.setAttribute("role", "alert");
    else message.removeAttribute("role");
  }

  function showTable() {
    message.hidden = true;
    tableWrap.hidden = false;
  }

  function setExportable(n) {
    exportButton.disabled = n === 0;
    exportHint.hidden = n !== 0;
  }

  function renderLoading() {
    showTable();
    toolbar.hidden = false;
    totals.hidden = true;
    tableWrap.setAttribute("aria-busy", "true");
    count.textContent = "Loading orders…";
    setExportable(0);
    exportHint.hidden = true;
    rows.textContent = "";
    var widths = ["64px", "144px", "112px", "24px", "48px", "72px"];
    for (var i = 0; i < 12; i++) {
      var tr = el("tr");
      widths.forEach(function (w, c) {
        var td = el("td", c === 3 || c === 4 ? "num" : "");
        var bar = el("span", "skeleton");
        bar.style.width = w;
        td.appendChild(bar);
        tr.appendChild(td);
      });
      rows.appendChild(tr);
    }
  }

  function renderError() {
    tableWrap.removeAttribute("aria-busy");
    toolbar.hidden = true;
    count.textContent = "";
    setExportable(0);
    exportHint.hidden = true;
    showMessage(
      "error",
      "Error: orders did not load",
      "The orders service did not respond. Nothing was changed on your orders. Check your connection, then load them again.",
      "Load orders again",
      start
    );
  }

  function renderNeverHadOrders() {
    toolbar.hidden = true;
    count.textContent = "";
    setExportable(0);
    showMessage(
      "empty",
      "No orders yet",
      "Orders appear here as soon as a customer checks out. Share your shop link to get the first one.",
      "Copy shop link",
      copyShopLink
    );
  }

  /* ---------- Filtering and sorting ---------- */

  function filtersActive() {
    return search.value.trim() !== "" || statusSelect.value !== "" || placedSelect.value !== "all";
  }

  function applyFilters() {
    var q = search.value.trim().toLowerCase();
    var status = statusSelect.value;
    var range = placedSelect.value;
    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    return orders.filter(function (o) {
      if (status && o.status !== status) return false;
      if (range === "today" && o.placed.getTime() < startOfToday) return false;
      if ((range === "7" || range === "30") &&
          o.placed.getTime() < now.getTime() - Number(range) * 86400000) return false;
      if (q) {
        var hay = (o.number + " " + (o.customer || "")).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });
  }

  function compare(a, b) {
    var x = a[sort.key], y = b[sort.key], result;
    if (sort.key === "status") {
      result = STATUS_ORDER.indexOf(x) - STATUS_ORDER.indexOf(y);
    } else if (sort.key === "customer") {
      /* orders with no customer go last in either direction */
      if (x === null || y === null) return x === y ? 0 : (x === null ? 1 : -1);
      result = x.localeCompare(y);
    } else if (typeof x === "string") {
      result = x.localeCompare(y);
    } else {
      result = x - y;
    }
    if (result === 0) result = a.placed - b.placed;
    return sort.dir === "ascending" ? result : -result;
  }

  /* ---------- Render ---------- */

  function renderRow(o, index) {
    var tr = el("tr");
    tr.tabIndex = index === 0 ? 0 : -1;

    var th = el("td");
    var link = el("a", "order-link", o.number);
    link.href = "#/orders/" + o.number;
    link.tabIndex = -1; /* the row is the tab stop; Enter on the row opens the order */
    th.appendChild(link);
    tr.appendChild(th);

    tr.appendChild(o.customer === null
      ? el("td", "muted", "n/a")
      : el("td", "wrap", o.customer));

    var placed = el("td");
    var time = el("time", "", formatPlaced(o.placed));
    time.dateTime = o.placed.toISOString();
    placed.appendChild(time);
    tr.appendChild(placed);

    tr.appendChild(el("td", "num", String(o.items)));
    tr.appendChild(el("td", "num", formatMoney(o.total)));

    var status = el("td");
    var tone = STATUS_TONE[o.status];
    status.appendChild(el("span", "status" + (tone ? " status-" + tone : ""), o.status));
    tr.appendChild(status);
    return tr;
  }

  function render() {
    tableWrap.removeAttribute("aria-busy");
    if (orders.length === 0) { renderNeverHadOrders(); return; }

    toolbar.hidden = false;
    clearButton.hidden = !filtersActive();
    visible = applyFilters().sort(compare);
    setExportable(visible.length);

    Array.prototype.forEach.call(table.querySelectorAll("thead th"), function (th) {
      if (th.dataset.key === sort.key) th.setAttribute("aria-sort", sort.dir);
      else th.removeAttribute("aria-sort");
    });

    if (visible.length === 0) {
      count.textContent = "0 of " + orders.length + " orders";
      showMessage(
        "filtered",
        "No orders match these filters",
        "None of your " + orders.length + " orders fit the search, status and date you chose. Widen one of them, or clear all three.",
        "Clear filters",
        clearFilters
      );
      return;
    }

    showTable();
    rows.textContent = "";
    var fragment = document.createDocumentFragment();
    var items = 0, amount = 0;
    visible.forEach(function (o, i) {
      fragment.appendChild(renderRow(o, i));
      items += o.items;
      amount += o.total;
    });
    rows.appendChild(fragment);

    var label = visible.length === 1 ? "1 order" : visible.length + " orders";
    count.textContent = visible.length === orders.length
      ? label
      : visible.length + " of " + orders.length + " orders";
    $("total-count").textContent = label + " shown, all statuses";
    $("total-items").textContent = String(items);
    $("total-amount").textContent = formatMoney(amount);
    totals.hidden = false;
  }

  /* ---------- Actions ---------- */

  function clearFilters() {
    search.value = "";
    statusSelect.value = "";
    placedSelect.value = "all";
    render();
    search.focus();
  }

  function toast(text, duration) {
    var node = el("div", "toast", text);
    node.setAttribute("role", "status");
    var host = $("toasts");
    while (host.children.length >= 3) host.removeChild(host.firstChild);
    host.appendChild(node);
    var timer;
    function arm() { timer = setTimeout(function () { node.remove(); }, duration || 5000); }
    node.addEventListener("mouseenter", function () { clearTimeout(timer); });
    node.addEventListener("mouseleave", arm);
    arm();
  }

  function copyShopLink() {
    var done = function () { toast("Shop link copied: " + SHOP_URL); };
    var failed = function () {
      messageBody.textContent =
        "Error: the browser blocked copying. Select and copy the link yourself: " + SHOP_URL;
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(SHOP_URL).then(done, failed);
    } else {
      failed();
    }
  }

  function csvCell(value) {
    var s = value === null ? "" : String(value);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }

  function exportCsv() {
    if (exportButton.disabled) return;
    var lines = [["order", "customer", "placed", "items", "total_usd", "status"].join(",")];
    visible.forEach(function (o) {
      lines.push([
        o.number, o.customer, o.placed.toISOString(), o.items, o.total.toFixed(2), o.status
      ].map(csvCell).join(","));
    });
    var today = new Date();
    var name = "orders-" + today.getFullYear() + "-" + pad(today.getMonth() + 1) + "-" + pad(today.getDate()) + ".csv";
    var url = URL.createObjectURL(new Blob([lines.join("\r\n")], { type: "text/csv;charset=utf-8" }));
    var a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast("Exported " + (visible.length === 1 ? "1 order" : visible.length + " orders") + " to " + name);
  }

  /* ---------- Density ---------- */

  function setDensity(value, remember) {
    table.dataset.density = value;
    if (remember) {
      try { localStorage.setItem(DENSITY_KEY, value); } catch (e) { /* storage blocked: choice lasts this visit */ }
    }
  }

  function restoreDensity() {
    var saved = null;
    try { saved = localStorage.getItem(DENSITY_KEY); } catch (e) { /* storage blocked */ }
    var input = saved && toolbar.querySelector('input[name="density"][value="' + saved + '"]');
    if (input) {
      input.checked = true;
      setDensity(saved, false);
    }
  }

  /* ---------- Keyboard ---------- */

  function focusRow(row) {
    if (!row) return;
    Array.prototype.forEach.call(rows.children, function (r) { r.tabIndex = -1; });
    row.tabIndex = 0;
    row.focus();
  }

  rows.addEventListener("keydown", function (event) {
    var row = event.target.closest("tr");
    if (!row || event.target !== row) return;
    var next = null;
    if (event.key === "ArrowDown") next = row.nextElementSibling;
    else if (event.key === "ArrowUp") next = row.previousElementSibling;
    else if (event.key === "Home") next = rows.firstElementChild;
    else if (event.key === "End") next = rows.lastElementChild;
    else if (event.key === "Enter") {
      var link = row.querySelector(".order-link");
      if (link) link.click();
      return;
    } else return;
    event.preventDefault();
    focusRow(next);
  });

  document.addEventListener("keydown", function (event) {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    var tag = event.target.tagName;
    if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") {
      if (event.key === "Escape" && event.target === search && search.value) {
        search.value = "";
        render();
      }
      return;
    }
    if (event.key === "/" && !toolbar.hidden) {
      event.preventDefault();
      search.focus();
      search.select();
    } else if (event.key === "e" || event.key === "E") {
      exportCsv();
    }
  });

  /* ---------- Wiring ---------- */

  STATUS_ORDER.forEach(function (s) {
    var option = el("option", "", s);
    option.value = s;
    statusSelect.appendChild(option);
  });

  toolbar.addEventListener("submit", function (event) { event.preventDefault(); });
  search.addEventListener("input", render);
  statusSelect.addEventListener("change", render);
  placedSelect.addEventListener("change", render);
  clearButton.addEventListener("click", clearFilters);
  exportButton.addEventListener("click", exportCsv);
  messageAction.addEventListener("click", function () { if (onMessageAction) onMessageAction(); });

  toolbar.addEventListener("change", function (event) {
    if (event.target.name === "density") setDensity(event.target.value, true);
  });

  table.querySelector("thead").addEventListener("click", function (event) {
    var button = event.target.closest(".sort");
    if (!button) return;
    var key = button.parentElement.dataset.key;
    if (sort.key === key) {
      sort.dir = sort.dir === "ascending" ? "descending" : "ascending";
    } else {
      sort.key = key;
      sort.dir = (key === "placed" || key === "items" || key === "total") ? "descending" : "ascending";
    }
    render();
    button.focus();
  });

  function start() {
    renderLoading();
    loadOrders().then(function (result) {
      orders = result;
      render();
    }, renderError);
  }

  restoreDensity();
  start();
})();
