The Tally landing page is built as two files, plain HTML and CSS with no JavaScript. I have not opened it in a browser yet, so the layout is untested.

The look comes from carbonless invoice books: a white top copy, a canary second copy and a pink third copy, with carbon-blue ink. The hero shows a sample invoice on that stack of sheets, stamped as paid.

The page runs in this order:

1. **Hero:** the headline "Bill like you design." with a "Start free" button.
2. **What it does:** six features laid out like invoice line items, such as deposits, revision rounds and licensing.
3. **How it works:** three steps from quote to invoice to receipt.
4. **Pricing:** two plans, Solo and Studio.
5. **Questions:** five collapsible answers.
6. **Sign-up:** an email field and button.

It adapts to phone widths, where the header links are hidden and only the logo and button remain.

## Before it goes live

- **Product details are invented.** I made up the features, the plan names, the prices (£0 and £12 per month), the three-client free limit, the 30-day trial and the FAQ answers. Replace them with the real ones.
- **The sign-up form is not connected.** It submits nowhere, and the Privacy and Terms links are empty.
- **Fonts load from Google Fonts.** Offline, the page falls back to system fonts.

I left out testimonials, customer logos and usage numbers rather than invent them.

## Files

Both are in this folder:

- index.html
- styles.css
