# View Model

This directory declares the view models that specify exactly what each part of the UI should display (loosely following the MVVM pattern).

They wrap the model types from calendar-model/ and decide exactly what gets displayed.

## ScrollViewModel

`ScrollViewModel` wraps the model objects and calculates exactly what the scroll (the main view) should display.

This code takes the page URL (specifying a single `LeiningRun`) as input and calculates the pages (different for יום טוב) and עלייות to display in the scroll.

This class is mostly immutable (jumping to a new run requires creating a new instance), but tracks loaded pages internally to load more pages as the user scrolls.

The UI layer consumes the output of this class to render UI.

This class (and associated helper functions) has several purposes:

- Select the set of pages to render
- Fetch pages as the user scrolls
- Generate titles and navigation links for the header UI
- Calculate עלייה labels to show alongside the scroll

### Page Indices

The base `ScrollViewModel` class deals in abstract content indices &ndash; an index into a contiguous range of rendered content.

`FullScrollViewModel` simply renders every page of a scroll (this is used to render all of חומש for regular פרשיות, and to render מגילות).  Therefore, it translates content indices directly to page numbers within the scroll.

`HolidayViewModel` renders only the pages that contain a particular day's leining.  When multiple ספרי תורה are used, it will also render a message between those pages indicating how many עמודים are skipped between leinings (this can be useful to plan which ספרי תורה to scroll where, especially when sharing between multiple Minyanim).

Therefore, it maps the contiguous content indices to whatever pages from the scroll are rendered in this view, including the skip messages.

This logic is implemented in the `pageNumberFromContentIndex()` and `contentIndexFromPageNumber()`, which convert back and forth between these two indices.  `pageNumberFromContentIndex()` can return either a page number or a message to render for that particular content index.

Note: Page numbers (which correspond to JSON page files and values in the tables of contents) are 1-based, whereas content indices are 0-based.

These methods (and the array in `HolidayViewModel` that backs them) specify exactly what gets displayed when a יום טוב is selected.

Tip: We could easily change this to allow a single `ScrollViewModel` to contain multiple scrolls as well.  This would let us show the הפטרה for יום טוב by scrolling down past מפטיר, rather than clicking a navigation button.  To do this, `pageNumber` in these two methods would change to a tuple of page number and scroll.
