# Design: Retro Terminal Console (Terminal HUD)

## Visual Highlights
* **CRT Terminal Aesthetics**: Replicates a vintage retro CLI shell featuring vibrant green-on-black monospace typography.
* **Command Input Prompt**: Active prompt block `guest@tikkun:~$` with focusing blinking input line, perfect for keyboard power users.
* **Clickable Link-to-Type Engine**: Every listed output item (Books, portions, holiday seasons) is rendered as an interactive green terminal-link. Clicking it automatically types and executes its command!
* **Clean Formatting Dividers**: Uses vintage ASCII divider banners to frame lists and display results cleanly.

## Interaction Model
1. **Full Command Line (CLI)**: Type traditional terminal commands:
   - `help` - Print list of instructions.
   - `ls` - List root catalogs.
   - `ls torah` / `ls holidays` / `ls megillot`.
   - `ls book <1-5>` - List portion titles inside specific Torah books.
   - `ls season <name>` - List readings inside Pesach, Chanukah, Rosh Chodesh, etc.
   - `search <query>` / `find <query>` - Run instant fuzzy match on titles, English transliterations, or dates.
   - `show <name>` - Render metadata details and yellow action jump URLs.
   - `clear` / `cls` - Flush console screen logs.
2. **Hybrid Click-Navigation**: Seamlessly switch between typing full queries or simply clicking on links to let the terminal type for you.
3. **History Buffer**: Press Up/Down arrow keys to instantly traverse command history logs.
4. **Shell Focus**: Clicking anywhere inside the terminal container instantly re-focuses the active text cursor.
