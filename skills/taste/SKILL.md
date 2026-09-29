---
name: taste
description: Design rules to apply before writing any UI, and a smell test to run on the result. Use when building or restyling a page, component, screen, dashboard or landing page, or when output looks templated.
---

# Taste

Apply these rules before you write markup or styles. Then run the smell test on what you wrote. Fix every failure before you show the work.

## Before you start

1. Find the design system. Look for `design-systems/` in the kit this skill came from (two folders above this file). If the project has its own tokens, those win.
2. Pick one variant and say which: `base`, `editorial` for reading, `dashboard` for dense data, `marketing` for landing pages. Read its README.
3. Load its `tokens.json`. Variant values override `base`. Use token names in code, not raw values.
4. Get real content. Ask for it, or read it from the project. If none exists, write plausible specific content for this product. Never lorem ipsum, never "Feature one".

## Rules

**Colour**

- Pick one accent colour. Use it for at most three things, and name them before you start. Example: primary button, current nav item, links.
- Everything else is neutral. Status colours (danger, warning, success) are for status only.
- The focus ring may use the accent hue and does not count as one of the three. Any other use does, including a border that turns accent on focus.
- Count the accent uses in your CSS before you report. If the design system's component rules would push you past three, follow this rule and say so.
- No gradients. No glassmorphism or background blur. No drop shadows. The exception: the variant's `effects` block allows it, and then only where it says.
- Separate surfaces with a 1px border or a change in fill, not a shadow.

**Type**

- Five sizes at most: caption, body, lead, title, display. Do not invent a sixth.
- Create hierarchy with size and weight first, then colour. Two weights are usually enough.
- Never centre body text. Left-align it (or start-align for right-to-left languages). A short headline may be centred.
- Keep lines of text between 45 and 75 characters.

**Spacing**

- Every margin, padding and gap is a multiple of 4px and uses a named step: hair 4, tight 8, snug 12, base 16, roomy 24, wide 32, section 48, block 64, page 96.
- Space inside a group is smaller than space between groups.
- If you need a value that is not a step, the layout is wrong. Change the layout.

**States**

- Design the empty state and the error state first. Then loading. The happy path comes last.
- An empty state says what will appear, how to make it appear, and offers the action.
- An error says what happened and what to do next, in plain words, next to the cause.
- Every interactive element gets hover and focus-visible states. Also pressed and disabled where they apply.
- Never remove a focus outline without replacing it.

**Content**

- Content decides the layout. Write the words, then arrange them.
- Buttons are verbs that name the result.
- Icons must carry meaning the text does not. If removing the icon loses nothing, remove it.
- Let content set the height. Do not pad or truncate cards to match each other.

## Smell test

Run this on your own output. Answer each question honestly. A "yes" means rework, not a note.

1. Does it look like every other AI landing page?
2. Is there a hero with a gradient, followed by three cards?
3. Are the icons decorative?
4. Is every card the same height?
5. Is any body text centred?
6. Is the accent on more than three kinds of element?
7. Are there more than five font sizes, or any spacing value off the 4px grid?
8. Is there a shadow, gradient or blur the variant did not ask for?
9. Is any text placeholder: lorem ipsum, "John Doe", "Your title here"?
10. Does any interactive element lack a hover or focus state?
11. Is the empty state or error state missing?
12. Could you swap the product name for a competitor's and change nothing else?

## Report

End your response with three lines:

- Variant: which one you used, and why.
- Accent: the colour and the three things it marks.
- Smell test: "passed", or which items failed and what you changed.
