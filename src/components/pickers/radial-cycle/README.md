# Design: Radial Cycle Wheel (Radial Cycle)

## Visual Highlights
* **The Calendar Wheel**: Represents the Hebrew calendar year as a continuous 360-degree circle, matching the cyclical nature of Torah study.
* **Annular Month Ring**: The outer ring splits the year into distinct colorful segments representing the Hebrew months (Tishrei to Elul) arranged in counter-clockwise chronological order.
* **Orbiting Readings**: Readings (Shabbat portions and holidays) sit nested along an inner concentric orbit as interactive celestial nodes. Holidays are color-coded yellow to contrast with standard blue weekly portions.
* **Concentric Connection**: Dotted radial spokes expand outwards from the center to cleanly define month boundaries.
* **Mobile-Responsive Stacking**: Automatically adapts to narrow screen viewports by stacking the visual wheel above the reading details.

## Interaction Model
1. **Interactive Orbit Nodes**: Hovering over a reading node displays an instant SVG `<title>` tooltip showing the reading name and Hebrew date.
2. **Focus Lock**: Clicking any node highlights it with a red pulsing lock indicator and populates the left/right details slate with comprehensive metadata, portion information, and Aliyot shortcuts.
3. **Smart Quadrant Zooming**:
   - **Zoom In**: Clicking on any outer **Month segment** calculates its corresponding quadrant (`q1` to `q4`) and smoothly animates the SVG `viewBox` to zoom in.
   - **Dynamic Typography Labels**: When zoomed into a quadrant, the individual names of the portions inside that quadrant dynamically fade into view next to each node, allowing immediate reading.
   - **Zoom Out**: Clicking anywhere inside the **Center circle** (`מחזור השנה`) resets the zoom and returns the camera smoothly to the full year circular layout.
4. **Year Calibration**: Fully supports the global year switcher to redraw month divisions and recalculate Gregorian offsets for leap years.
