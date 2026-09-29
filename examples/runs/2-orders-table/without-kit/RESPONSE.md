The orders page is built and runs by opening `orders.html` in a browser. It uses sample data for now, so nothing is connected to your real orders yet.

I checked it in a browser at desktop and phone widths, in light and dark mode: filtering, selecting, the order drawer, marking as shipped and the refund confirmation all work. The CSV download itself and keyboard-only use were not tested.

## What's on the page

- **Status tabs** with counts: All, To fulfil, Awaiting payment, Shipped, Delivered, Cancelled and refunded.
- **Search** by order number, customer or email, plus a date range filter.
- **Sortable list** by date, customer or total, 25 orders per page.
- **Order details** open in a side panel: items, totals, customer, address, tracking and history.
- **Actions**: mark as shipped, mark as delivered, and refund (with a confirmation step).
- **Bulk actions**: select rows to mark them as shipped or export them.
- **Export CSV** of whatever the current filters show.

Filters are kept in the URL, so a filtered view can be bookmarked or shared.

## Choices I made that you may want to change

- **The data is made up.** 86 sample orders are generated in the browser, and changes are lost on reload. To connect real data, replace `loadOrders()` and the three functions under "Mutations" in `orders.js`.
- **Sidebar navigation is a placeholder.** I had no existing admin panel to match, so the links other than Orders go nowhere and the brand just says "Admin".
- **Currency is US dollars**, set in `CONFIG` at the top of `orders.js`. Dates follow the browser's locale.
- **Order model**: I assumed each order has a separate payment status and fulfilment status. If yours uses a single status, the tabs and status labels will need adjusting.
- **Look and feel** is my own; there was no existing style to follow.

## Files

- `orders.html`
- `orders.css`
- `orders.js`
