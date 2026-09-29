The orders page is built: a dense, sortable table with your six columns, filters in one row above it, and a totals row pinned at the bottom. It runs on sample data, because there is no orders API in the project to read from.

Open `index.html` in a browser. There is no build step.

## What is in it

- **Table**: order, customer, placed, items, total, status. Items and total are right-aligned with tabular figures, and the currency sits in the header as "Total (USD)". The header row and the order column stay pinned when the table scrolls.
- **Filters**: search by order number or customer, status, and placed date.
- **Row height**: compact, default or relaxed (28, 32 or 40px). The choice is remembered in the browser.
- **Export CSV**: downloads the rows currently shown. It is the one primary action on the page.
- **Keyboard**: `/` jumps to search, `E` exports, the up and down arrows move between rows, and Enter opens the focused order.
- **States**: loading, no orders yet, no orders match the filters, and failed to load. Add `?state=loading`, `?state=empty` or `?state=error` to the URL to see the ones the sample data does not reach.

## What I made up

You gave me the columns but no content, so these are my inventions and need replacing or confirming:

- The shop, "Fernhill Coffee Roasters", and its 34 orders in `orders-data.js`.
- The seven statuses: Awaiting payment, Payment failed, Paid, Roasting, Shipped, Delivered, Refunded.
- The other five nav items (Products, Customers, Subscriptions, Discounts, Settings).
- The shop link that the "No orders yet" state copies.

## What is not real yet

- **Data**: `loadOrders()` in `app.js` returns the sample orders. Swap it for a request to your API. Placed times are generated relative to when the page loads, so the date filters always match something.
- **Links**: order numbers and nav items point at hash URLs (`#/orders/FH-10482`). Those pages do not exist.
- **Error text**: it says the orders service did not respond. Once real requests are in, it should report the actual failure.

## Decisions for you

- **Totals row**: it sums every row shown, including refunded and failed-payment orders, and says so ("all statuses"). If you want revenue instead, those statuses should be left out.
- **Input focus**: the kit's component notes say a focused input's border turns accent. I left the border neutral and rely on the focus ring, because that would have been a fourth use of the accent.

## Checked and not checked

I loaded the page in a browser at 1280px wide and confirmed sorting, filtering, clearing filters, row height, arrow-key movement, the totals, and the empty, filtered and error states. I did not test at phone width, at 200% zoom, with a screen reader, or in any browser other than Chromium. The CSV download and the copy-link button were not exercised.

## Files

All in `runs/2-after/`:

- `index.html`
- `styles.css`
- `tokens.css` (base tokens plus the dashboard overrides, copied from the kit)
- `app.js`
- `orders-data.js`

---

- Variant: dashboard, as you asked. It fits: an admin table that someone scans and compares every day with a pointer and a keyboard.
- Accent: `accent.600` (#22548f), marking the primary button (Export CSV), the current nav item's indicator, and the order number links.
- Smell test: passed. Two things I changed on the way: the focused-row indicator is an inset ring drawn in the focus-ring colour rather than a drop shadow, and the row-height control was rebuilt after its label sat out of line with the other filters.
