# Design: Hebrew Calendar Grid View (Calendar Grid)

## Visual Highlights
* **Monthly Paper-Style Grid**: Renders a full-featured monthly Hebrew calendar layout. Visual structure maps Sundays (א) to Saturdays (ש) cleanly.
* **Hebrew Date Sync**: Title labels and days correspond directly to Hebrew calendar days (1 to 29/30) instead of Gregorian months, aligning beautifully with classical traditional reading habits.
* **Glowing Leining Day Rings**: Days containing active Torah/holiday readings are highlighted with a distinct, dashed glowing circular ring indicator.

## Interaction Model
1. **Flexible Navigation**: Top switcher enables swift jumps between Hebrew Months (Tishrei, Cheshvan, etc.) or shifting full Hebrew Years (updating the month layouts automatically).
2. **Day Click Detail Drawer**: Clicking any highlighted day cell reveals a gorgeous details card (drawer) at the bottom.
3. **High-Density Links**: The bottom drawer lists Gregorian date descriptions, Hebrew names, and high-density quick action buttons for Aliyot (קריאה), Maftir, or Haftarah.
