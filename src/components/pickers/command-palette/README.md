# Design: Command Palette / HUD (Search-First)

## Visual Highlights
* **Sleek Modal Interface**: Inspired by modern launcher HUDs (like Alfred, Spotlight, or Raycast) that hover elegantly over the content with a distinct drop shadow and rounded corners.
* **Visual Badges**: Each search result has a distinct color-coded capsule representing its catalog category:
  - `תורה` (Green) for weekly portions.
  - `חג` (Gold) for holiday readings.
  - `מגילה` (Red) for Megillah scrolls.
* **Prominent Quick Cards**: Three beautiful high-contrast card widgets right below the input for instantaneous access to **השבת הקרובה** (This Shabbat), **השבת הבאה** (Next Shabbat), and **החג הקרוב** (Upcoming Holiday) before typing any keys.

## Interaction Model
1. **Keyboard-Driven**: Fully navigable with standard keyboard inputs:
   - **Up/Down Arrow keys** highlight search results smoothly.
   - **Enter** triggers selection of the highlighted item instantly.
   - Focus is automatically placed into the search field upon open.
2. **Fuzzy Search Engine**: Leverages the app's custom `fuzzy` regex indexer to look up parsha names in Hebrew or English, Gregorian dates (months or weekdays), and traditional Hebrew dates dynamically.
3. **High-Density Shortcuts**: Displays clear quick-jump shortcuts on each row for the main Torah reading, Maftir, or Haftarah.
