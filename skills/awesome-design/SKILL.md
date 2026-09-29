---
name: awesome-design
description: A library of DESIGN.md files describing the visual systems of well-known products. Use when asked to build UI "in the style of" a named product, or when a project needs a concrete visual reference to start from.
---

# Awesome design

This folder holds 74 DESIGN.md files from the awesome-design-md collection by VoltAgent, vendored under the MIT licence. Each one describes the colours, type, spacing and components of one product's public website. I wrote this SKILL.md; the files in `design-md/` are theirs. See `NOTICE.md` for what was changed.

## How to use it

1. List `design-md/` and find the folder that matches the product named in the request. Folder names are lowercase, for example `linear.app`, `stripe`, `notion`.
2. Read that `DESIGN.md` in full before writing code. The front matter holds the tokens. The prose explains how they are used.
3. If the project has no tokens yet, copy the chosen file to the project root as `DESIGN.md` and treat it as the reference.
4. If nothing matches, say so and offer the three closest. Do not blend several files into one.

## Limits

- These are descriptions of other companies' sites, written by a third party. They are a reference for style, not permission to copy a brand. Do not reproduce logos, product names or trademarked assets.
- Many of them name proprietary fonts. Use the open fallback the file suggests.
- The `taste` skill still applies. Where a DESIGN.md asks for gradients or shadows, keep them to the places that file names.
- The files were accurate when vendored. Sites change. The upstream project publishes current versions at https://getdesign.md.
