I built the Tally landing page as three files in plain HTML and CSS. I have not seen it rendered: the browser check could not capture a screenshot, so the layout is checked by reading the code only. The page loaded without errors apart from a missing favicon.

## Files

- `index.html`: the page
- `styles.css`: layout and components
- `tokens.css`: the kit's base tokens with the marketing overrides applied

## What is on the page

The headline is "Invoice the revisions you used to give away." Each section answers one buyer question:

| Section | Question it answers |
| --- | --- |
| Hero, with a real invoice showing a billed third revision round and a usage licence | What is it? |
| Table of six things designers do for free | What does it do that my spreadsheet does not? |
| The Invoices view in a new account | What will I see when I sign up? |
| Payment methods and exports | Does it work with how I get paid? |
| Two plans, Solo at £0 and Studio at £9 a month | What does it cost? |
| Four questions | What about my situation? |
| Email sign-up form | How do I start? |

The one primary action is "Create your first invoice". It appears in the hero and on the sign-up form, and as a secondary button inside the empty-state view.

## Things you need to know

- **All product facts are invented.** You gave me no content, so I wrote it: prices, plan limits, the Stripe, Wise, Xero and FreeAgent integrations, the reminder schedule, and the names on the sample invoice. Replace anything that is not true of Tally before this goes live.
- **There is no testimonial section.** The marketing variant says social proof uses real names and real numbers or is left out, and I have none.
- **The form has nowhere to send.** It posts to `/sign-up`, which does not exist. The links to `/sign-in`, `/pricing`, `/terms` and `/privacy` are also placeholders, as is the address `help@tally.example`.
- **The loading state is not built.** There is no JavaScript, so the sign-up button does not show progress after a click. Disabled styles exist but nothing uses them.
- **The form error relies on `:user-invalid`.** In browsers without it, the person sees only the browser's own validation message.
- **Three font weights are used, not two.** Headings are bold, and buttons, labels and table headers are medium, as the kit's component rules ask.

## Report

- Variant: marketing, as you asked. It fits a page read once by someone deciding whether to care.
- Accent: burnt orange `accent.600` (#b93a0a), marking the primary button, text links and the focus ring.
- Smell test: passed, with one gap on item 11. The empty state and the form error state are present; the loading state is missing.
