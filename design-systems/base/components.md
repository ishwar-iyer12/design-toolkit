# Components

Rules for the eight components I reach for most. Every value is a token from `tokens.json`. If a number you need is not a token, the design is wrong or the tokens are, and you should fix one of them.

## Rules that apply to all of them

- Every interactive element has five states: default, hover, focus-visible, pressed, disabled. Build all five before moving on.
- Loading is a state too. A control that starts a request shows progress in place and keeps its width.
- Padding inside a component is smaller than the gap between components. Inside uses `tight` to `base`. Between uses `roomy` and up.
- One primary action per view.

## Button

| Size | Height | Horizontal padding | Text |
| --- | --- | --- | --- |
| small | 28px | `snug` (12px) | caption, medium weight |
| medium | 36px | `base` (16px) | body, medium weight |
| large | 44px | `roomy` (24px) | body, medium weight |

Three kinds: primary (accent fill, white text), secondary (1px `border-strong`, no fill), quiet (text only). Danger is a secondary button with `danger.600` text and border, never a red fill sitting next to a primary.

States:

- Hover: primary moves to `accent-hover`. Secondary and quiet get a `surface-sunken` fill.
- Focus-visible: 2px `focus-ring` outline with a 2px offset. Never remove it.
- Pressed: primary moves to `accent-pressed`. No scale transform.
- Disabled: `text-disabled` on `surface-sunken`, `cursor: not-allowed`, and say why nearby.
- Loading: label stays, a 16px spinner sits before it, clicks are ignored.

Labels are verbs that name the result: "Save draft", "Send invoice". Not "Submit", not "OK". Icon and label are separated by `tight`. Buttons in a row are separated by `snug`.

## Input

Height matches the button sizes so they line up in a row. Border is 1px `border-strong`, because the lighter `border` token fails the 3:1 minimum for control boundaries. Radius is `medium`.

- The label sits above the field, `hair` gap, body size, medium weight. Placeholder text is not a label.
- Help text sits below in caption size, `text-muted`.
- Hover: border moves to `neutral.700`.
- Focus-visible: the focus ring, plus the border moves to `accent`.
- Error: border `danger.600`, message below in `danger.600` with a text prefix such as "Error:". The message replaces the help text and says how to fix the problem.
- Disabled: `surface-sunken` fill, `text-disabled`. Read-only is different: normal text, no border change, no fill.

Fields in a form are separated by `roomy`. Groups of fields by `section`.

## Card

A card groups content that belongs to one thing. It is not a way to decorate a paragraph.

- Padding `roomy`. Radius `large`. Border 1px `border`. No shadow.
- Title in lead size, body below with a `tight` gap, actions at the bottom with a `base` gap.
- Cards in a grid take the height of their content. Do not force equal heights by padding short ones, and do not truncate long ones to match.
- If the whole card is a link, the whole card gets hover (`surface` fill) and focus states, and there are no other links inside it.
- Never nest a card inside a card.

## Table

- Row height 44px by default. Cell padding `snug` horizontal.
- Header row: caption size, medium weight, `text-muted`, sentence case, 1px `border-strong` below.
- Rows are separated by 1px `border`. No zebra stripes and row borders at once: choose one.
- Text aligns left. Numbers align right and use `font-variant-numeric: tabular-nums`. Headers align with their column.
- Row hover: `surface` fill. Selected row: `accent.50` fill with a 2px `accent` bar on the left edge.
- Sortable headers are buttons, with a visible sort direction and `aria-sort`.
- Long text wraps to two lines, then truncates with a title attribute. Never truncate numbers.
- Below 640px, either scroll horizontally with the first column pinned or switch to a stacked list. Do not shrink the text.

## Modal

Use a modal only when the person must decide something before continuing. For everything else, use a page or an inline panel.

- Widths: 400px for confirmations, 560px for forms. Padding `roomy`. Radius `large`. Shadow `modal`.
- Backdrop is `neutral.950` at 50% opacity. No blur.
- Title in title size, body below with `snug` gap, actions right-aligned at the bottom with the primary action last.
- Focus moves into the modal on open, is trapped while open, and returns to the trigger on close.
- Escape closes it. Clicking the backdrop closes it unless there is unsaved input.
- Opens in `base` duration with opacity only. With reduced motion, it appears without a transition.

## Nav

- Top bar height 56px, or a side rail 240px wide. Not both.
- Items are body size, medium weight, `text-muted` by default, `text` on hover.
- The current item has `text` colour, a 2px `accent` indicator, and `aria-current="page"`. Colour alone is not enough.
- At most seven top-level items. More than that and the grouping is the problem.
- The first focusable element on the page is a "Skip to content" link.
- Item padding `snug` horizontal, `tight` vertical, with a minimum hit target of 44px.

## Empty state

Design this before the populated view. A new account sees it first.

- One sentence that says what will appear here. One sentence that says how to make it appear. One button that does it.
- Text is left-aligned, maximum width 48ch, sitting where the content would start.
- No illustration unless it explains something. No "Nothing here yet".
- Distinguish the three cases: never had data, filtered to nothing (offer "Clear filters"), and failed to load (that is an error state).

Example: "No invoices yet. Invoices appear here after you bill a client. [Create invoice]"

## Toast

- For confirmations of something the person just did. Errors that need action go inline, next to the cause.
- Width up to 360px. Padding `snug` vertical, `base` horizontal. Radius `medium`. Shadow `popover`.
- Bottom left on desktop, bottom full-width on small screens. Stack upward with a `tight` gap, three at most.
- Stays for 5 seconds, pauses on hover and on focus. Any toast with an action ("Undo") stays for 10 seconds.
- Announced through `role="status"`. Never steal focus.
- One line of text. If it needs two, it is not a toast.
