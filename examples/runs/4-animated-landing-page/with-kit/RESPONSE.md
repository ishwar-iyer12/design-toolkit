The Tally landing page is built. Open `index.html` from disk; it needs no server or build step.

**Files**

- `index.html`: the page
- `tally.css`: tokens and styles
- `tally.js`: the sample invoice, the forms, the pointer tilt and the pause control

**What is on the page**

- A hero with the 3D invoice on a cutting mat.
- "Three layers": letterhead, line items and total, explained in words.
- The same invoice laid flat, which you can edit. Removing every line shows the empty state. Submitting the form with blank fields shows the errors.
- A pricing table, four questions, and a sign-up form.

**The 3D animation**

It runs once on load, in three beats:

1. The view tilts from top-down to an angled view of the desk.
2. The invoice comes apart into three layers, each with its shadow on the layer below.
3. A "Paid" stamp lands on the paper.

It then rests in that pose and floats slightly, four seconds moving and four seconds still. "Pause the float" stops it. With a mouse, the object tilts up to 8 degrees towards the pointer.

**Things you should know**

- **I wrote all the content.** The skill says to ask for real content; I was told not to ask, so the copy, the plans and prices (Solo free, Studio £9 a month), the feature claims, and the example studio and client are invented. Replace them before this goes live.
- **The sign-up form is not connected to anything.** It checks the email address and then says no account was created.
- **I did not see the animation running in real time.** I froze it in headless Chrome and looked at stills: 13 points across the three beats, the float at its furthest point, the pointer tilt at all four corners, and the reduced-motion view. I found and fixed three things: the lifted layers covered the letterhead text and the last line item, the total's shadow hung off the edge of its layer, and the paper's shadow ran over the mat label. Easing and smoothness between the stills are unchecked.
- **Fonts load from Google Fonts.** Offline, the page falls back to system fonts. I did not look at the fallback rendering.
- **Test hooks are left in `tally.js`.** `?freeze=1500`, `?float=25`, `?tilt=1,-1`, `?state=empty` and `?state=error` on the URL hold the page in those states. Delete them if you do not want them.
- I checked layouts at 1440px and 390px wide. I did not test in Firefox or Safari, or with a screen reader.

**Report**

- Variant: showcase, as you asked. It fits a product home page that has to be remembered in the first five seconds.
- Concept: An invoice is a designer's last artboard, built in layers on a cutting mat, registered with crop marks and stamped when it is paid.
- Accent: drafting-ink blue (#2a3ea8) on the primary button, text links, and the total due figure. The support colour, stamp vermilion, marks the Paid stamp and the hard offset shadow under the flat invoice sheet. I replaced the variant's default green and peach to fit the concept.
- Smell test: passed. I changed one thing on the way: the headline ran into the 3D object, so I narrowed it to break over three lines.
- Signature: the invoice tilts into view, separates into letterhead, line items and total, and is stamped paid. It shows that Tally treats an invoice as layers you can change one at a time, and that the job ends with payment.
- Reduced motion: the finished pose, with the layers apart and the stamp down, with no movement. The float, the pointer tilt and the pause button are off.
- Motion smell test: passed on the frozen stills, with the three fixes above. Not watched in motion.
