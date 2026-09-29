# Credits and licences

Everything in this repository is mine and under the MIT licence in `LICENSE`, except what is listed here. Each vendored folder keeps the original licence file and a `NOTICE.md` with the full list of changes.

## Vendored

### web-design-guidelines

- Where: `skills/web-design-guidelines/`
- By: Vercel
- Sources: https://github.com/vercel-labs/agent-skills (the `SKILL.md`) and https://github.com/vercel-labs/web-interface-guidelines (the `command.md` it reads)
- Versions: agent-skills at commit `063bee94c3f4df8453406c830b0a7df0f2860278`, web-interface-guidelines at commit `e3d624baaf29dc1fc645aff3e38f03e564d2d6b1`
- Licence: MIT. web-interface-guidelines ships a LICENSE file, kept in the folder. agent-skills has no LICENSE file; its README states MIT.
- Changed: one fallback sentence added to `SKILL.md`. In `command.md`, eight dashes replaced with other punctuation, one check mark removed, one word replaced. No rule was altered.

### awesome-design

- Where: `skills/awesome-design/design-md/`
- By: VoltAgent
- Source: https://github.com/VoltAgent/awesome-design-md
- Version: commit `f6961238d5cddcf8042a74a70fc400ec67181abb`
- Licence: MIT, copyright 2026 VoltAgent. LICENSE file kept in the folder.
- Changed: 74 DESIGN.md files taken, README files left out. Punctuation, pictographs and a few words were replaced by script, about 6,300 edits in total, including a rename of some token names. No colour, size or spacing value was changed. Counts are in the folder's `NOTICE.md`.
- Added: `SKILL.md`, written by me, so agents can find and use the files.

The DESIGN.md files describe the websites of third-party companies. Product names and trademarks belong to their owners. Nothing here is endorsed by them.

## Looked at, not copied

### image-to-code (taste-skill)

- Source: https://github.com/Leonxlnx/taste-skill, `skills/image-to-code-skill/`, seen at commit `ce26fc25c0e5e8cab638f883de62d9a86ee5e45b`
- Licence: MIT, copyright 2026 Leonxlnx. Redistribution would have been allowed.
- Decision: not vendored. That skill is about generating reference images and then building from them. Mine is about matching an image you already have. They share a name and little else, so `skills/image-to-code/SKILL.md` is written from scratch and copies nothing from it.
- If you want theirs as well, clone that repository and link its skill folder into your skills directory under a different name.

The same repository has a skill called taste-skill. My `skills/taste/` was written without reference to it. The name overlap is a coincidence of the obvious word.

## Referenced

- **Okabe-Ito palette.** The six chart colours in `design-systems/dashboard/tokens.json` are from the colour-blind-safe palette by Masataka Okabe and Kei Ito (Color Universal Design, https://jfly.uni-koeln.de/color/). Colour values only.
- **WCAG 2.2.** The contrast and target-size minimums in `design-systems/base/accessibility.md` follow the W3C Web Content Accessibility Guidelines, https://www.w3.org/TR/WCAG22/. Restated in my own words, with the ratios for my tokens computed by me.
- **Source Serif 4 and Source Sans 3.** Named in the editorial variant. Both are by Adobe under the SIL Open Font Licence 1.1. The font files are not included.
