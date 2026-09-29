# Before and after

Three prompts. For each one: what an agent tends to return with no guidance, and what the same prompt returns once the kit's rules apply. These are written descriptions, not screenshots, so you can compare them against your own runs.

The "before" descriptions are the pattern I kept getting. The "after" descriptions are what the rules in `skills/taste/SKILL.md` and the variant tokens require. Your results will differ in detail. Run the prompts yourself.

## 1. A landing page

**Prompt**

```text
Build a landing page for Tally, an invoicing tool for freelance designers.
```

**Before**

A full-width hero with a purple to blue gradient behind a centred headline, "Invoicing Made Simple". Two buttons side by side, "Get Started" and "Learn More", the same size. Below that, three cards in a row, each with a rounded icon in a tinted circle, a two-word title, and two lines of centred grey text. Every card is the same height. Then three more cards for testimonials, with names like "Sarah J., Designer". Soft shadows on all of it. A final gradient band repeats the first headline.

Nothing on the page says what Tally does differently. Swap the name and it sells a calendar app.

**After**

Prompt, with the kit installed:

```text
Use the taste skill with the marketing variant. Build a landing page for Tally, an invoicing tool for freelance designers.
```

The agent asks what Tally does that others do not, or reads it from the project. The page opens on a white background with a left-aligned headline at 64px: "Send the invoice before you close the file." Two sentences follow, then one burnt orange button, "Create your first invoice". To the right sits a real invoice as the product renders it.

The sections differ from each other. A wide comparison of a tracked project and the invoice built from it. A plain pricing table with three rows. One quote, attributed to a named studio, with the number of invoices they sent. Sections sit 96px apart. No gradient, no shadow, no icons.

The accent appears on the primary button, the links, and the highlighted pricing row. The report at the end says so.

## 2. A data table

**Prompt**

```text
Make an orders page for the admin panel.
```

**Before**

Four stat cards across the top, each with an icon, a large number, and a green "+12%" badge with no period attached. Below, a table inside a card with a shadow. Rows are 64px tall, so nine orders fit on a laptop screen. Amounts are left-aligned in a proportional font, which makes 1,204.00 and 98.50 hard to compare. Status is a row of coloured pills: green, yellow, red, blue, purple. No empty state. If the request fails, the table is blank.

**After**

```text
Use the taste skill with the dashboard variant. Make an orders page for the admin panel. Columns: order, customer, placed, items, total, status.
```

The agent builds three states before the table: no orders yet ("Orders appear here after a customer checks out", with a link to the storefront), no matches for the current filter (with "Clear filters"), and failed to load (with "Try again" and the error in plain words).

Then the table. Rows are 32px, with a control to switch to 28 or 40. Text is 13px. Order, customer and placed align left. Items and total align right in tabular figures, with two decimals on every total and the currency in the header. Status is text with a small shape before it, and only "Refunded" and "Failed" take a colour. The header sticks. Rows have a hover fill and can be reached with arrow keys.

One filter row sits above the table. There are no stat cards, because nobody asked a question they would answer.

## 3. A screenshot to match

**Prompt**

```text
Build this. (settings-mockup.png attached)
```

**Before**

The layout is right at a glance: sidebar on the left, form on the right. Then the differences add up. The sidebar is 256px where the mockup has 232. Body text is 16px where the mockup has 14. The grey is a framework default, not the one in the image. Spacing between fields is even throughout, though the mockup groups them in threes. The save button turned blue. None of this is mentioned. The response says the page matches the design.

**After**

```text
Use image-to-code on settings-mockup.png. Plain HTML and CSS.
```

The agent starts with measurements: a 2880 by 1800 image at 2x, so 1440 by 900 in CSS pixels. Sidebar 232px. Content column 640px. It lists nine colours and four type sizes with their jobs, and turns them into variables before writing any markup.

Spacing follows the source: 12px between fields in a group, 32px between groups. The text is copied exactly, including a typo in the mockup, which is flagged.

The stylesheet opens with a divergence table of five rows. Muted text was darkened from 3.9:1 to 4.6:1 for contrast. Focus states were added because the mockup shows none. The typeface could not be identified and a named substitute was used. The avatar is a labelled placeholder at the measured size. The mobile layout is an assumption, since only one width was supplied.

The response ends with the three largest of those in plain words.
