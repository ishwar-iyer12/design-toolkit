I built the Tally landing page with the taste skill and the marketing variant. Open `index.html`; it works from a file:// URL, with styles in `styles.css`.

**What is on the page**

1. Hero: the headline "The invoice is the final deliverable.", one paragraph, one action, and a real invoice on a yellow sheet, marked up with Tally's notes.
2. Line items: a three-row comparison of a spreadsheet against Tally, for revision rounds, usage licences and deposits.
3. Late payers: a yellow band with the reminder timeline, day 0 to day 44.
4. Day one: the empty state of the invoice list and the error for a bounced address, on a grey fill.
5. Pricing: a table, Free against Studio at £9 a month. It becomes a stacked list on a phone.
6. Questions: five, in open-and-close rows.
7. Start: an email form with the same action as the hero.

**Things you should know**

- I wrote all the content myself, because there was none to read. The designer, the client, the prices, the fees, the plan limits and the company address are invented. Replace them with the real ones before this goes anywhere.
- There is no testimonial. The variant says social proof uses real names and real numbers or is left out, and I had neither.
- The form is not connected to anything. Submitting a valid address shows "Workspace link sent", but no email is sent. It needs a real endpoint.
- The typefaces load from Google Fonts, so the page needs a connection to look right. Offline it falls back to the system font. To ship it, host the font files yourself.
- The accent and support colours are my own, not the variant's defaults of burnt orange and sage. The variant asks for both to come from the concept. White on the magenta measures about 6.8:1.
- The design system's component rules give the accent's third job to the current nav item. I gave it to the proof notes instead, and left the nav neutral, to stay at three.
- I looked at the page in headless Chrome at 1280px and at 390px. I did not test it in Firefox or Safari, or with a screen reader. The form's error message relies on `:user-invalid`, which older browsers do not support.

- Variant: marketing, because this is a landing page read once by someone deciding whether to care.
- Concept: the invoice is the last thing a designer delivers, so it is proofed like a print job, with crop marks, slug lines and a proofreader's notes.
- Accent: proof magenta (#b0174f), marking the primary button, text links, and the proof notes on the invoice.
- Smell test: passed. Two things changed on the way: I removed a testimonial I had planned, and the phone-width pricing table became a stacked list.
