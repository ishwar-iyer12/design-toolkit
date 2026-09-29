The Tally landing page is built: open `index.html` in a browser (it works straight from the file system, no build step).

**The 3D animation.** The hero is an invoice drawn in real 3D with CSS transforms. On load the pieces fly in and assemble: three sheets stack, the line items settle as raised slabs, and a "Paid" stamp lands. After that it sways gently, tilts to follow the pointer, and pulls apart into separate layers as you scroll. It pauses when off screen, and visitors who have reduced motion switched on get a still version.

**The rest of the page**
- How it works, in three steps
- Six features specific to design work, such as revision rounds, licences as line items and deposits
- A scope creep calculator with three sliders that works out unbilled revision hours per year
- Two pricing plans
- FAQ
- Email sign-up

**What I checked.** I screenshotted the page in headless Chrome at desktop and phone widths and checked the assembled pose of the invoice. I could not watch the motion itself in headless Chrome, so the intro, pointer tilt and scroll behaviour are untested by eye; give those a look in your browser.

**Before this goes live**
- The sign-up form is not connected to anything. It validates the email and shows a thank-you message, but nothing is sent or stored.
- All product details are my invention: the prices ($0 and $14 a month), the plan limits, the feature descriptions and the FAQ answers. Replace them with the real ones.
- The typefaces (Archivo and Martian Mono) load from Google Fonts; offline, the page falls back to system fonts.

Files are in `runs/4-before`:
- index.html
- styles.css
- script.js
