# Accessibility

These are minimums, checked before anything ships. The targets come from WCAG 2.2 level AA, with a few places where I ask for more.

## Contrast

| What | Minimum ratio |
| --- | --- |
| Body text, below 24px regular or 19px bold | 4.5:1 |
| Large text, 24px regular or 19px bold and above | 3:1 |
| Control boundaries, icons that carry meaning, focus rings | 3:1 |
| Disabled text | No minimum, but never the only copy of information |

Measured ratios for the base tokens, so nobody has to guess:

| Pair | Ratio | Passes |
| --- | --- | --- |
| `text` (#1a1a18) on `page` (#ffffff) | 17.43 | Body text |
| `text` on `surface-sunken` (#f4f4f2) | 15.83 | Body text |
| `text-muted` (#5c5b56) on `page` | 6.81 | Body text |
| `text-muted` on `surface-sunken` | 6.18 | Body text |
| White on `accent` (#22548f) | 7.68 | Body text |
| White on `accent-hover` (#1c4473) | 9.89 | Body text |
| `focus-ring` (#2f69ad) on `page` | 5.61 | Non-text |
| `border-strong` (#76756f) on `page` | 4.62 | Non-text |
| `border` (#e6e5e2) on `page` | 1.26 | Fails. Dividers only. |
| `text-disabled` (#a3a29c) on `page` | 2.56 | Fails. Disabled only. |
| `danger.600` (#b3261e) on `page` | 6.54 | Body text |
| `warning.600` (#8a5a00) on `page` | 5.93 | Body text |
| `success.600` (#1e7a3c) on `page` | 5.38 | Body text |

Two consequences. Inputs and secondary buttons use `border-strong`, not `border`. And if you change a colour token, you recompute this table.

Colour never carries meaning alone. An error has a text label. A chart series has a direct label or a pattern. A required field says "required".

## Focus rings

- Every focusable element shows a ring on `:focus-visible`: 2px solid `focus-ring`, offset 2px.
- Never write `outline: none` without a replacement in the same rule.
- The ring must not be clipped. Check `overflow: hidden` on parents.
- On an accent or dark background, the ring is white with the same width and offset.
- Focus order follows reading order. If you need `tabindex` above 0, the markup order is wrong.
- A focused element is never hidden behind a sticky header or a toast.

## Hit targets

- 44 by 44px minimum for anything tapped with a finger. The visible control can be smaller if padding extends the target.
- 24 by 24px is the floor for dense pointer-only UI, such as the dashboard variant.
- At least 8px between adjacent targets.
- Small controls on touch screens are a bug even when they look fine on a laptop.

## Reduced motion

`tokens.css` sets the three motion durations to 0ms under `prefers-reduced-motion: reduce`. That covers transitions that use the tokens. You still have to handle the rest:

- No parallax, no scroll-triggered animation, no auto-playing video.
- Replace movement with an opacity change or nothing at all.
- Loading spinners may keep spinning. They show that work is happening.
- Nothing flashes more than three times per second, under any setting.

## Checks I run before calling it done

1. Tab through the whole page with the mouse unplugged. Can I reach and operate everything?
2. Zoom to 200%. Does anything overlap or disappear?
3. Turn on reduced motion. Does anything still move?
4. Read the page with styles off. Does the order make sense?
5. Run a screen reader over the form. Is every field announced with its label and its error?
