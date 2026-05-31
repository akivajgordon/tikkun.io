# Design: Kanban Month Board (Kanban Board)

## Visual Highlights
* **Horizontal Month Lanes**: Organizes the entire calendar year as a clean horizontal Kanban board where each column represents a Hebrew Month (Tishrei, Cheshvan, Kislev...).
* **RTL Column Flow**: Aligns columns chronologically flowing from Right to Left (Tishrei sits at the far right, and the year progresses to the left towards Elul).
* **Visual Cards**: Readings sit nested as task-like cards containing portion titles, Hebrew dates, and color-coded badges differentiating standard weekly portions (`פרשה` - light blue) from holidays (`חג/מועד` - warm yellow).
* **Scroll Indicators**: Allows smooth horizontal mouse dragging or standard trackpad swiping to traverse the calendar year.

## Interaction Model
1. **Card Hover Animation**: Cards lift slightly and display a blue focus border when hovered, providing instant feedback.
2. **Focus Lock**: Clicking a card highlights it permanently and triggers a slide-up bottom details drawer.
3. **Bottom Slide Drawer**: The drawer slides up smoothly from the bottom, housing date metadata and Aliyot shortcuts, keeping the main board visible above it.
4. **Smart Column Counter**: Column headers dynamically display a count showing the total number of readings inside each month.
