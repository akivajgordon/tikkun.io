# Design: Miller Columns / Cascade Picker (Miller Columns)

## Visual Highlights
* **macOS Finder-Inspired Columns**: Displays cascading vertical layout panels placed side-by-side, enabling a clear hierarchical tree navigation.
* **RTL Cascades**: Fits natively with Hebrew layouts, cascading smoothly from Right (highest tier: Categories) to Left (lowest tier: Reading details).
* **Static Breadcrumbs**: Highly structured, making it impossible to get lost in sub-menus because the parent choices are always fully visible to the right.
* **Permanent Details Slate**: Selected readings show up instantly in a dedicated light-grey detail slate on the left-most column.

## Interaction Model
1. **Cascading Selection**:
   - **Column 1 (Right)**: Select catalog category (`תורה וחומשים`, `מועדים וחגים`, `מגילות המועדים`).
   - **Column 2 (Center-Right)**: Select Book (Genesis...) or Holiday Season (Pesach, High Holidays...).
   - **Column 3 (Center-Left)**: Select the specific reading or portion.
   - **Column 4 (Left)**: Lists Hebrew/English date metadata, Aliyot summary, and direct action links.
2. **Fluid Column Populating**: Clicking any item in a column instantly refreshes all downstream columns to the left with zero latency.
3. **Year Switcher**: A convenient year control bar at the top instantly recalibrates Gregorian & Hebrew date listings across all columns.
