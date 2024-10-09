# Calendar-based Model

_For more details, see the [design doc](https://docs.google.com/document/d/17fsv4TVKUVNfSnh5wMu_FyDUKRkrtQo76KVLsa9QA1g/edit)_

This package declares the model and view-model that power the rest of the UI (loosely following the MVVM pattern).

## Model Structure

We represent leinings as a hierarchical structure:

- A `LeiningDate` can contain one or more leinings (usually just one during שחרית; rarely a second during מנחה or מעריב).
  - We currently do not list שבת מנחה as a separate leining in the UI, even on יום טוב.
- A `LeiningInstance` describes a single leining, but can contain multiple ספרי תורה, and possibly also a הפטרה.
- A `LeiningRun` describes a single contiguous (or near-contiguous) group of עליות leined from a single ספר תורה.
  - Each `LeiningRun` exactly corresponds to a leining from a single ספר תורה (or קלף).
  - For example, we use a separate `LeiningRun` for מפטיר (when not the end of the פרשה), for שביעי when three ספרי תורה are used, and for the הפטרה.
  - But we don't declare a separate `LeiningRun` for minor skips like תענית ציבור.
  - In particular, a הפטרה is _always_ a single `LeiningRun` (even שבת שובה).

## View Model

`ScrollViewModel` wraps the above model objects and calculates exactly what the scroll (the main view) should display.

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
