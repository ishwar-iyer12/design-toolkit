The Tally landing page is built: `index.html`, `styles.css` and `script.js`. Open `index.html` directly; there is no build step, and the only thing loaded from the network is the two web fonts.

## What the 3D animation is

The hero is invoice 0042 for a brand identity job. When the page opens:

1. The invoice's layers (work, total) are dealt in and hang above the sheet at different heights.
2. They flatten into one page.
3. A Paid stamp lands on it.

Then it rests. "Pull the layers apart" lets the person separate and flatten the layers themselves, "Replay from the start" runs the opening again, and the sheet tilts up to 8 degrees under a mouse pointer.

It is CSS 3D transforms only, with no WebGL and no library.

## What I checked, and what I could not

I checked still frames in headless Chrome at 1440px and 390px wide:

- the flat, stamped invoice
- the layers pulled apart
- the reduced-motion view
- the empty state in the builder
- the email error in the form

I could not watch the animation in motion. Headless Chrome did not advance the transitions reliably, so the timing and feel of the three beats are untested by eye. Please open the page and watch it once. The opening did not start in one headless run, so I added a fallback: if it has not started within four seconds, the finished invoice is shown.

Keyboard, screen reader and 200% zoom checks were not run.

## Things you need to know

- **All content is invented.** The skill says to ask for real content; I was told not to ask, so I wrote it. That covers the headline, the features (revision rounds, licences, deposits, kill fees, reminders on day 1, 7 and 14), the prices (Solo £0, Studio £9 a month), the three-invoice free limit, "about four minutes", and the sample names Ines Varga Studio and Fernhill Pottery. Replace anything that is not true of Tally.
- **The sign-up form is not connected to anything.** It validates the address, shows a loading state for 0.8 seconds, then says a sign-in link was sent. No email is sent. `sendAddress()` in `script.js` is the one function to replace.
- **The accent is not the variant's default.** I changed deep green to a selection blue (`#1f3fae`, 8.8:1 against white) to fit the concept. The peach support colour is the default.
- **One value sits outside the tokens.** Flat layers rest 1px and 2px above the sheet so the browser stacks them in the right order. It is a rendering fix, not a spacing value.
- **The easing tokens have no ease-in-out curve.** The motion skill asks for one on moves between two places. I used `standard`.
- **No scroll reveals.** The only motion besides the hero is hover states and a 160ms fade when an invoice line comes back.

## Report

- Variant: showcase, as you asked. It fits because this is the one product home page that has to be remembered.
- Concept: an invoice is the last artboard in the project file, a stack of layers that flatten into one page you send.
- Accent: selection blue `#1f3fae`, marking the primary button, links, and the mark on a layer that is switched on (tick box, bar and row fill). The support colour, stamp ink, marks the Paid stamp and the hard offset shadow under a sheet.
- Smell test: passed. The concept appears in the hero, in the layer tags on every section and on the invoice, and in the wording (layers, flatten, artboard).
- Signature: the invoice dealt in as layers, flattened and stamped. It shows that Tally builds an invoice from separate layers of work and ends with getting paid.
- Reduced motion: the flat, stamped invoice with no opening animation, no tilt and no replay button. The layers button still works and swaps states instantly.
- Motion smell test: passed on reading the code, with the caveat above that I did not see it move. The opening plays once without being asked, lasts three seconds and stops on the first click of the layers button.
