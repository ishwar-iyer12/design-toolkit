I built the Tally landing page as three files with no build step and no libraries. Open `index.html` directly from disk. Only the web fonts load from the network, and the page falls back to system fonts without them.

- `index.html`
- `styles.css`
- `script.js`

## What is on the page

1. **Hero with the 3D animation.** An invoice pad drops onto a cutting mat, is dealt into three sheets at three heights (ledger sheet, pink carbon copy, top copy), and a PAID stamp comes down on the top copy. It then rests in a tilted 3D pose, and the top sheet floats slightly. "Stamp it again" replays it and "Pause the float" stops the loop. On a desktop the pad tilts up to 8 degrees towards the pointer.
2. **One invoice, three sheets.** What each sheet is for.
3. **The top copy, laid flat.** The same invoice, readable, and editable: remove lines, add a line, stamp it paid.
4. **The small print, in your favour.** Deposits, revision rounds, usage licences, late fees, kill fees.
5. **Two pads.** Pricing.
6. **Get your pad.** Email sign-up.

## Things you should know

- **All the content is invented.** The skills say to ask for real content. I was told not to ask questions, so I wrote it myself. That includes the prices ($0 and $9 a month), the 2.9% plus 30 cents card fee, the three-invoices-a-month free limit, every feature claim, the sample studio and client (Oyelaran Studio, Fennel & Rye Bakery), and the `hello@tally.example` address. Replace these with the real ones before anyone sees the page.
- **The sign-up form is not connected to anything.** `sendLink()` in `script.js` is a 900ms timer. It shows the "Link sent" confirmation but sends no email. It needs a real request before the page goes live.
- **I changed the default colours.** The showcase defaults are deep green and peach. I used ink blue (`#23308f`) and carbon-copy pink (`#f5b5bc`) because they fit the concept. The variant allows this.
- **What I checked.** I took headless Chrome screenshots at 1440px, 1280px and 500px wide, ten seconds after load, and screenshots of the invoice empty state, the form errors, an added line and the stamp. All rendered as intended after fixes.
- **What I did not check.** I could not get Chrome to emulate reduced motion, so that path is written but not seen. I did not test the pointer tilt, the replay and pause buttons, keyboard tabbing, the offline error, a screen reader, or any browser other than Chrome. I did not measure frame rate.
- **Small known flaws.** In the hero the stamp overlaps the end of the client name on the illustrated invoice. Below 960px the section links in the nav are hidden and only "Get your pad" remains. The opening animation plays on load and cannot be stopped during its three seconds; the float after it can.

## Report

- Variant: showcase, as you asked. It is the one landing page that has to be remembered, and it is the variant that permits depth, a second colour and a signature animation.
- Concept: a carbon-copy invoice pad on a designer's cutting mat, where the top copy goes to the client, the carbon copy stays with you, and a rubber stamp says PAID. It appears in the hero, in the recurring motifs (perforated dashed rules, the pink sheet showing from under panels, the stamp), and in the wording ("tear it off", "top copy", "scratch pad").
- Accent: ink blue `#23308f`, marking the primary button, text links, and the PAID stamp. The support colour, carbon pink `#f5b5bc`, marks the carbon copy sheet and the hard offset shadow. The focus ring uses the accent hue and is not counted.
- Smell test: passed, after changes. I moved the stamp twice because it covered the amounts, then the empty-state button. I made the invoice table scroll on narrow screens instead of crushing the first column. Two points are judgement calls: the page uses three font weights (400, 500, 650) where the rule says two are usually enough, and the sizes of the illustrated sheets (300 by 440px) are object dimensions, not spacing steps.
- Signature: the pad is dealt into three sheets and stamped PAID, in three beats (1200ms, 1200ms, 600ms). It shows how the product works: one invoice becomes three records, and ends paid.
- Reduced motion: the finished rest pose, with all three sheets fanned out and the stamp in place. Nothing floats, the pointer tilt is off, and the replay and pause buttons are hidden. Not verified in a browser, as noted above.
- Motion smell test: passed on the screenshots I could take. The ten-second still reads as 3D (35 degrees on X, 25 on Z, three separated layers with shadows on a gridded mat), and the object fills more than half the hero width. Items that depend on watching it move (frame rate, the feel of the stamp) are unverified.
