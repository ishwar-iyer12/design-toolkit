I built the settings page from your mockup as plain HTML and CSS: open `index.html`, which loads `styles.css`. I rendered it at 1440 × 900 and it lines up with the mockup to within a few pixels; the phone layout I checked at 500px wide.

Three things differ from the mockup:

- **Typo fixed:** the subtitle in the mockup reads "imediately"; the page says "immediately".
- **Dropdowns:** Language, Time zone and Week starts on are dropdowns with a small chevron, not plain text boxes. The options in each list are placeholders I made up, so swap in your real ones.
- **Typeface:** the page uses serif fonts already on the viewer's machine (Charter, then Sitka Text, Cambria, Georgia). On Windows the letters come out slightly wider than in the mockup. If you tell me the exact font, I'll add it.

The mockup only shows the desktop view, so the rest is my own choice: below 760px the sidebar becomes a top bar, and I added hover and keyboard focus styles.

Nothing is wired up yet. Save changes submits to nowhere, Cancel resets the fields to their original values, and the avatar is an empty circle as in the mockup.
