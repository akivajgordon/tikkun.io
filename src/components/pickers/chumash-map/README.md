# Design: Chumash Map (Tile Grid)

## Visual Highlights
* **Structural Columns View**: Displays the entire Pentateuch (Torah) mapped as 5 distinct vertical columns (Bereshit, Shemot, Vayikra, Bamidbar, Devarim) representing the five books.
* **Compact Progress Tiles**: Each Parsha is represented as a clean grid tile containing:
  - Bold Parsha title in Hebrew.
  - Short Hebrew date display.
* **Aliyot Metadata popover**: Elegant overlay modal (popover) displaying complete, high-density details for the selected portion:
  - Traditional Aliyah division labels in Hebrew (Rishon, Sheni, etc.).
  - Exact chapter & verse ranges (formatted like `Ch:Vs - Ch:Vs`).

## Interaction Model
1. **Tile Click Detail Overlay**: Clicking any Parsha tile displays a sleek, center-aligned details popover without losing your current catalog location.
2. **Direct Aliyah Action Triggers**: Popover card footer includes primary action buttons that allow you to jump to the main Portion, Maftir, or Haftarah instantly.
3. **Year Switching**: Supports dynamic Hebrew year switcher at the top, instantly recalculating the Hebrew and English calendar dates on all tiles.
