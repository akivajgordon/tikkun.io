# Design: Timeline Card Picker (Timeline Flow)

## Visual Highlights
* **Horizontal Split Layout**: Split-pane design with a sticky vertical Hebrew month indicator on the side, and a cards stream on the main pane.
* **Visual Cards**: Each reading is presented as a clean card featuring:
  - Large, high-contrast day numbers of the week (perfect for finding dates).
  - Glowing badges/tags for special readings (e.g. "חג/מועד", "שבת מיוחדת").
  - Dual English/Hebrew date labels.
* **High Density Actions**: Elegant action buttons embedded directly on cards, distinguishing primary readings (קריאה) from supplementary ones (הפטרה, מפטיר) using solid vs. bordered visual styles.

## Interaction Model
1. **Side Panel Navigation**: The side navigation bar displays all active Hebrew months of the year. Clicking a month instantly scrolls the main timeline pane to the first reading of that month with smooth animation.
2. **Scroll-Spy Highlighting**: As you scroll down the timeline cards list, the side nav month buttons dynamically light up in blue to reflect which month you are currently browsing.
3. **Year Switcher**: Easily switch years using the bottom switcher, instantly recalculating dates for all cards and side navigation months.
