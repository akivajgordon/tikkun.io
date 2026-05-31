# Design: Collapsible Book List (Classic Overhaul)

## Visual Highlights
* **Structured & Organized**: Vertically stacked grouped sections for the Five Books of Torah, Holidays (חגים), and Megillot (מגילות).
* **Clean & Native Controls**: Uses collapsible panels (accordions) with smooth directional arrows, ensuring a tidy screen that scales nicely from mobile to desktop.
* **Dual Calendars**: Displays both the traditional Hebrew Date (e.g. "כ״ה בתשרי") and the Gregorian date side-by-side in muted text.

## Interaction Model
1. **Accordions**: Clicking a Torah Book (e.g. "ספר בראשית") or Holidays expands or collapses the list, keeping the UI focused and highly manageable.
2. **Year Navigation**: A dedicated year switcher bar allows switching Hebrew Years dynamically (re-rendering all calendar events on the fly).
3. **Date Jumper**: Includes a simple native date selector input. Picking a date searches the calendar models and instantly navigates directly to that date's leining.
4. **Leining Shortcuts**: Each item lists high-density quick links for **קריאה** (Main reading), **מפטיר** (Maftir), and **הפטרה** (Haftarah) without needing to navigate multiple submenus.
