The settings page is built in plain HTML and CSS, and it matches the mockup almost pixel for pixel. I rendered it in Chrome at 1440 x 900 (2x) and differenced it against `settings-mockup.png`: 3 of about 5.2 million pixels differ, all antialiasing inside two glyphs.

That match was checked on this machine only, which has Georgia installed. On a machine without it, the page falls back to Times New Roman and the text metrics will shift.

## The three largest divergences

Nothing visible in the mockup was changed, so all three are things the image could not show.

1. **Interactive states are my additions.** Hover, focus, pressed, disabled and error styles are derived from the mockup's palette. The error red (`#a63a2b`) is the one colour that does not come from the mockup.
2. **Language, Time zone and Week starts on are plain text inputs.** The mockup draws them as plain boxes with no chevron, so I did not build them as dropdowns.
3. **Only the 1440 px width is verified.** I added no breakpoints: the sidebar stays at 232 px and the form is capped at 640 px and shrinks with the window. Narrow screens are untested.

The full divergence table is at the top of `styles.css`.

## Things I kept as drawn that you may want to change

- The subtitle reads "imediately" in the mockup. I reproduced it exactly; it looks like a typo for "immediately".
- The subtitle colour (`#8d8778` on `#f6f3ec`) has a contrast of 3.23:1, below the 4.5:1 minimum for text.
- The sidebar link colour (`#6f6a5f` on `#ebe6da`) is 4.32:1, just under 4.5:1.
- The input border (`#b9b19d` on `#f6f3ec`) is 1.93:1, below the 3:1 minimum for controls.

## Assumptions

- The image is 2880 x 1800 at 2x, so 1440 x 900 CSS px.
- The typeface is Georgia. The old-style numerals in "UTC+05:30" suggested it and the render comparison confirmed it.
- The avatar is an empty 56 px circle with an accessible label, since the mockup shows no photo or initials.
- Cancel is a button with no behaviour attached, and the nav links and form action point to `#`. The destinations are not in the image.

## Measured values

| Item | Value |
| --- | --- |
| Sidebar | 232 px wide, 20 px side padding, 1 px right border |
| Nav items | 36 px high, 4 px apart, 3 px accent bar on the current item |
| Main content | starts 72 px from the sidebar |
| Form | 640 px wide; two-column row has a 12 px gutter |
| Inputs and buttons | 38 px high, 3 px radius, 1 px border on inputs |
| Type | title 26 px bold, logo 18 px bold, body and labels 14 px, section labels 11 px uppercase with 0.08em spacing |

## Files are in the output directory

- index.html
- styles.css
- render.png
