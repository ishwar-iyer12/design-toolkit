# Notice

This folder vendors two files from two Vercel repositories.

| File | Source | Commit | Licence |
| --- | --- | --- | --- |
| `SKILL.md` | https://github.com/vercel-labs/agent-skills (`skills/web-design-guidelines/SKILL.md`) | 063bee94c3f4df8453406c830b0a7df0f2860278 (28 August 2026) | MIT, as stated in that repository's README. It ships no LICENSE file. |
| `command.md` | https://github.com/vercel-labs/web-interface-guidelines | e3d624baaf29dc1fc645aff3e38f03e564d2d6b1 (17 August 2026) | MIT, copyright 2025 Vercel Labs |

`LICENSE` in this folder is the original licence file from web-interface-guidelines. The guidelines are Vercel's work, not mine.

## What was changed

`SKILL.md`: one sentence added under "Guidelines Source", pointing to the local `command.md` as a fallback when the fetch fails. Nothing else.

`command.md`: punctuation and one word, to fit the writing rules of this repository. No rule was added, removed or reworded beyond this.

| Change | Count |
| --- | --- |
| Dash between clauses, replaced with a comma | 6 |
| Dash after a code span, replaced with a colon | 1 |
| Dash in the range of heading levels, replaced with "to" | 1 |
| Check mark removed before "pass" in the sample output | 1 |
| One adjective in the opening instruction replaced with "complete" | 1 |

The skill fetches the current guidelines from the source on every run, so the snapshot only matters offline.
