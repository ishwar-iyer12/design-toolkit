# Before and after

Three prompts, each run twice in Claude Code on 29 September 2026: once with no skills loaded, once with the kit. Same model, same machine, fresh session for every run, no follow-up questions allowed. What follows is a written description of what came back, with numbers counted from the output files.

One run per cell is a small sample. Treat this as a record of six runs, not as a benchmark.

I expected the runs without the kit to be bad. They were not. They were inventive and mostly honest about their gaps. What the kit changed was discipline: fewer sizes, a real grid, no effects, stated divergences. It also exposed a bug in the kit, which is at the end.

## 1. A landing page

**Without the kit**

```text
Build a landing page for Tally, an invoicing tool for freelance designers.
```

The page had a concept: carbonless invoice books, with white, canary and pink sheets and carbon-blue ink. The headline was "Bill like you design." The hero showed a sample invoice on a stack of sheets, stamped as paid. Six features were laid out like invoice line items, followed by three steps, two plans, five questions and a sign-up form.

It did not invent testimonials, and it said the prices and features were made up. It also said it had not opened the page in a browser.

Counted from the CSS:

| What | Count |
| --- | --- |
| Distinct font sizes | 17 |
| Spacing values off the 4px grid | 11 (2, 5, 6, 10, 11, 14, 18, 22, 26, 30 and 34px) |
| Shadow declarations | 10, mostly hard offset "paper" shadows |
| Gradients | 2 |
| Blur effects | 2 |
| Colour families | 3 |
| Centred text rules | 2 |

So: not the gradient hero and three cards I was braced for. A page with a point of view, built on values chosen one at a time.

**With the kit**

```text
Use the taste skill with the marketing variant. Build a landing page for Tally, an invoicing tool for freelance designers.
```

The headline was "Invoice the revisions you used to give away." Each section answered one buyer question: a real invoice in the hero, a table of six things designers do for free, the empty state of a new account, payment methods, two plans of unequal height, four questions, a sign-up form. One primary action, "Create your first invoice", repeated down the page. No icons.

| What | Count |
| --- | --- |
| Distinct font sizes | 5, plus the small-screen display size |
| Spacing values off the 4px grid | 0 |
| Shadows, gradients, blur | 0 |
| Centred text rules | 0 |
| Raw values outside the tokens | 3, each declared and explained |

It reported its own gaps: no loading state, three font weights where two are usual, and a form error that depends on a newer CSS selector.

What it got wrong: it reported three uses of the accent and had four. The input border turned accent on focus. It was following my component rules, which contradicted the skill. That is the bug described below.

## 2. A data table

**Without the kit**

```text
Make an orders page for the admin panel.
```

This run built the most features of the six. Status tabs with counts, search, a date range, sorting, paging, an order drawer, bulk actions, CSV export, filters kept in the URL, a dark mode, and a phone layout where rows become cards. Numbers were right-aligned in tabular figures. It tested in a browser at two widths and listed what it had not tested.

Where it fell short:

- One empty state, for filters that match nothing. No state for a shop with no orders, for a failed request, or for loading.
- 7 font sizes, from 10px to 26px.
- 10 spacing values off the grid.
- 36 distinct colours across light and dark.
- 4 inline icons.

**With the kit**

```text
Use the taste skill with the dashboard variant. Make an orders page for the admin panel. Columns: order, customer, placed, items, total, status.
```

Fewer features, more finish. Four states were built: loading, never had orders, filtered to nothing, and failed to load with "Try again". Each can be previewed from the URL.

The table has rows at 32px with a switch to 28 or 40 that remembers the choice. Text is left-aligned, numbers right-aligned in tabular figures, currency in the header. The header, the first column and the totals row stick. Rows can be reached with arrow keys, and `/` focuses search.

| What | Count |
| --- | --- |
| Distinct font sizes | 4 |
| Spacing values off the 4px grid | 1 (a 2px value) |
| Gradients, blur | 0 |
| Shadows | 1, the popover token |
| Icons | 0 |

It noticed the accent conflict that the first run missed, left the input border neutral, and said why. It also flagged a choice for me: the totals row sums refunded and failed orders too.

Not checked by the run: phone width, zoom at 200%, a screen reader, the CSV download.

## 3. A screenshot to match

For this one I drew a settings page mockup and rendered it to a PNG at 2880 by 1800. Both runs got the image only. I know the true values, so I could score them, and I diffed each result against the source pixel by pixel.

**Without the kit**

```text
Build this. (settings-mockup.png attached)
```

The layout was right. Column width, avatar size, input height, radius and the gap between fields all matched. It listed three differences itself: it fixed a typo in the mockup, it turned three text boxes into dropdowns, and it used a different serif.

What it did not mention:

| Element | Source | Built |
| --- | --- | --- |
| Body text | 14px | 15px |
| Brand name | 18px | 19px |
| Page heading | 26px | 28px |
| Section label | 11px | 12px |
| Page colour | #f6f3ec | #f5f2eb |
| Button green | #2f6b4f | #2d6a4f |

Its reply said the page matched "to within a few pixels". My diff: 2.3% of pixels differ clearly, and 84% differ at all, mostly because the page colour is one step off everywhere.

**With the kit**

```text
Use image-to-code on settings-mockup.png. Plain HTML and CSS.
```

It measured before writing: image size, scale, nine sampled colours, four type sizes, six spacing values. It built, rendered, compared, and corrected three times (heading 28 to 26px, brand 17 to 18px, radius 2 to 3px).

My diff: 3 pixels out of 5,184,000 differ.

The stylesheet opens with a divergence table of 18 rows. Every row is an addition or missing information: hover, focus, disabled and error states, link targets, behaviour at other widths. Nothing visible in the source was changed.

It kept the typo and flagged it. It kept the text boxes as text boxes, because the mockup shows no chevron. It listed three contrast failures in the source (3.23:1, 4.32:1 and 1.93:1) and left them as drawn, for the designer to decide.

A caveat: my mockup used Georgia, which is installed on this machine. A mockup in a proprietary typeface would not match this closely.

## What the runs found wrong with the kit

`components.md` told the agent to turn an input border accent on focus. With a primary button, links and a current nav item, that is a fourth use of the accent, and the taste skill allows three. One run followed the component rule and miscounted. The other caught it.

I fixed it after these runs. The input border now moves to the text colour on focus. `components.md` names the three default jobs for the accent, and the taste skill says the focus ring is not counted and tells the agent to count before it reports.

The runs above used the kit as it was before that fix.
