# Recorded runs

The files behind `examples/before-after.md`. Ten runs in Claude Code on 29 September 2026, one folder each. Open any `index.html` (or `orders.html`) in a browser to see the result.

| Folder | Prompt | Kit |
| --- | --- | --- |
| `1-landing-page/without-kit` | Build a landing page for Tally, an invoicing tool for freelance designers. | None |
| `1-landing-page/with-kit` | Same, with "Use the taste skill with the marketing variant." | `taste` |
| `2-orders-table/without-kit` | Make an orders page for the admin panel. | None |
| `2-orders-table/with-kit` | Same, with the dashboard variant and six named columns. | `taste` |
| `3-screenshot/without-kit` | Build this. (settings-mockup.png attached) | None |
| `3-screenshot/with-kit` | Use image-to-code on settings-mockup.png. Plain HTML and CSS. | `image-to-code` |
| `4-animated-landing-page/without-kit` | Build a landing page for Tally. Give it a cool 3D animation. | None |
| `4-animated-landing-page/with-kit-first-attempt` | Same, with the taste and motion skills and the showcase variant. | `taste` and `motion`, before the motion skill was revised |
| `4-animated-landing-page/with-kit-second-attempt` | The same prompt again. | `taste` and `motion`, after one revision. Has a bug: the stamp vanishes for a moment as it lands |
| `4-animated-landing-page/with-kit` | The same prompt, third time. | `taste` and `motion`, after two revisions |

Each folder has a `RESPONSE.md`: the reply the agent gave with the code. Read those too. They show what each run admitted and what it left out.

`3-screenshot/settings-mockup.png` is the source image both screenshot runs were given.

## What I changed after the runs

The output is as the runs wrote it, apart from these edits, made so the files meet the writing rules of this repository and do not point at real domains:

| File | Change |
| --- | --- |
| `1-landing-page/without-kit/index.html` | Dash in the page title replaced with a colon. Placeholder email moved to a `.example` domain. |
| `1-landing-page/with-kit/index.html` | Sample email in an error message moved to a `.example` domain. |
| `2-orders-table/without-kit/orders.css` | Dash in the opening comment replaced with a comma. |
| `2-orders-table/without-kit/orders.js` | Dashes in two comments replaced. The dash in the pager range ("1 to 25 of 86") replaced with "to". |
| `1-landing-page/without-kit/RESPONSE.md` | A local folder path replaced with "this folder". |
| `4-animated-landing-page/without-kit/index.html` | Dash in the page title replaced with a colon. |
| `4-animated-landing-page`, script files and one `index.html` | Sample emails moved to `.example` domains. |

Nothing in the runs with the kit needed a punctuation edit.

Left out: the browser logs the runs produced, one comparison render, and a second copy of the mockup.

## Reading them fairly

- One run per prompt and condition. A second run would differ.
- Runs 1 to 3 used the kit as it was before the accent fix described at the end of `before-after.md`. Run 4 used it after.
- The four pages in run 4 load fonts from Google Fonts.
- The third attempt in run 4 keeps the test hooks its run used to freeze the animation: add `?freeze=1500` to the address to stop it 1500ms in.
- The GIFs are 560 pixels wide at 10 frames a second. The pages are smoother than that.
- The landing page without the kit loads fonts from Google Fonts. Offline it falls back to system fonts and looks different from the screenshot.
- The screenshots in `examples/screenshots/` are the top 1440 by 900 pixels of each page, taken on a machine set to dark mode. That is why the orders page without the kit is dark: it supports both and followed the system.
