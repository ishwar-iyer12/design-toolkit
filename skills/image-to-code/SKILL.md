---
name: image-to-code
description: Turn a screenshot or mockup into code that matches it. Use when given an image of a UI and asked to build, rebuild or match it. Measures first, then writes, then records every divergence from the source.
---

# Image to code

The goal is fidelity. You are reproducing a design someone already made, not improving it. Save opinions for the divergence table.

## 1. Measure before writing

Do not write code yet. Look at the image and write down:

- Canvas: the image width and height in pixels, and the likely device scale (1x, 2x, 3x). Divide by the scale to get CSS pixels.
- Grid: the content width, the number of columns, the gutter, the outer margins.
- Regions: header, nav, main, sidebars, footer, with the size of each.
- Repeated elements: measure one, then check two others. Differences are information.

If the image is too small or too compressed to measure, say so and ask for a better one. Do not guess quietly.

## 2. Extract the palette and type sizes first

**Palette.** List every distinct colour with its hex value and its job: page, surface, border, text, muted text, accent, status. Sample from flat areas, away from antialiased edges. Merge values that differ by compression noise. Expect fewer than twelve.

**Type.** List every distinct text size with its weight, line height and letter spacing. Measure cap height or x-height and convert; do not estimate from "looks like 16". Name the typeface if you can identify it. If you cannot, say what you chose in its place and why.

Turn both lists into variables before any component code exists. If the project has tokens already, map each measured value to the nearest token and record the difference.

## 3. Reproduce spacing, not just layout

Getting the boxes in the right order is the easy half. The spacing is what makes it look like the source.

- Measure the padding inside every container and the gaps between siblings.
- Write the measured values down as a spacing scale. Most designs use five to eight values.
- Check vertical rhythm: distance from heading to body, body to action, section to section.
- Check alignment: which edges line up across regions? Reproduce the shared edges.
- Check radii, border widths and icon sizes the same way.

## 4. Build

- Use semantic elements. A screenshot cannot show them, so infer: nav, main, headings in order, buttons versus links.
- Use the real text from the image, exactly. Mark any text you could not read.
- Add the states the image cannot show: hover, focus-visible, pressed, disabled, empty, error. Derive them from the palette you extracted, and list them as additions.
- Images and icons you do not have become labelled placeholders with the measured size. Do not substitute a stock icon and call it done.
- Pick breakpoints only where you have evidence. For widths you were not shown, keep the proportions and say so.

## 5. Record every divergence

Put a comment block at the top of the output with a divergence table. One row for each place the code differs from the source, however small.

```
/*
DESIGN DIVERGENCE
Source: checkout-mockup.png (2880 x 1800 at 2x, so 1440 x 900 CSS px)

| Element         | Source value       | Implemented value    | Reason                                   |
| --------------- | ------------------ | -------------------- | ---------------------------------------- |
| Body text       | #8a8a8a on #ffffff | #6b6b6b on #ffffff   | Source is 3.45:1, below the 4.5:1 floor  |
| Card padding    | 22px               | 24px                 | Snapped to the project 4px grid          |
| Heading font    | Unidentified serif | Source Serif 4       | Could not identify; closest open match   |
| Promo code link | No focus state     | 2px outline, offset 2| State not shown in source; added         |
| Footer          | Cropped in image   | Not implemented      | Not enough of it visible to measure      |
*/
```

Rules for the table:

- If you changed it, it has a row. "Close enough" is a divergence.
- The reason names the cause: accessibility, a project token, missing information, a technical limit.
- Things you added that the source does not show are divergences too.
- If there are no divergences, write "None found" and list what you checked.
- Never fix the source design without a row. The designer may have meant it.

## 6. Compare

Render the result at the source size and compare region by region. If you can take a screenshot, overlay it on the source. Fix what differs, or add a row.

Then tell the person the three largest divergences in plain words, so they do not have to read the table to find out.
