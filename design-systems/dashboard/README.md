# Dashboard

Pick this for internal tools, admin panels, analytics, monitoring: screens where someone compares many values and comes back every day.

Do not pick it for anything used mainly on a phone. The 24px hit target is for pointers.

## What changes from base

**Density.** Body text drops to 13px on a 20px line. Table rows come in three heights: 28, 32 and 40px. Default to 32. Let the person switch, and remember the choice.

**Numbers.** Every number that can be compared uses tabular figures and aligns right, so digits line up by place value. Keep the same number of decimals down a column. Units go in the header, not in every cell.

**Charts.** The categorical palette is the Okabe-Ito set, which stays distinguishable under the common forms of colour blindness. Six series at most. Past six, group the rest as "Other" or use small multiples.

**Accent.** Same accent as base, and it still gets three jobs only. Chart colours are data, not accents, and do not count.

## Table rules

- Left-align text and dates. Right-align numbers and row actions.
- Header text matches the alignment of its column.
- Sticky header, and a sticky first column when the table scrolls sideways.
- Negative numbers use a minus sign and, where it matters, `danger.600`. Never brackets alone.
- Empty cells show "n/a" in `text-muted`. A blank cell looks like a loading failure.
- Totals sit in a footer row with a `border-strong` line above.

## Chart colour rules

- Assign colours in palette order, and keep a series the same colour everywhere it appears.
- Several palette colours are below 3:1 against white (orange is 2.25:1, sky blue 2.31:1). So never use them for text, and always give lines and bars a direct label or a legend with a shape.
- Use the sequential ramp for magnitude and the diverging pair for values around a midpoint. Do not use the categorical set for either.
- Red and green are not "bad" and "good" here. If a chart needs good and bad, say so in a label.
- Grid lines are `neutral.200` and horizontal only. Axis text is `neutral.600`, caption size.
- No 3D, no gradient fills under lines, no drop shadows on bars.

## Rules for the agent

- Show the data first. Filters and controls go above it in one row, not in a sidebar of cards.
- A stat tile holds one number, one label, and one comparison. No icon.
- Design the loading, empty and error state of every panel. Panels fail one at a time.
- Keyboard first: rows are reachable with arrow keys, and the main actions have shortcuts.
