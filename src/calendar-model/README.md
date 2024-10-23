# Calendar-based Model

_For more details, see the [design doc](https://docs.google.com/document/d/17fsv4TVKUVNfSnh5wMu_FyDUKRkrtQo76KVLsa9QA1g/edit)_

This directory declares the model classes that specify how leinings are grouped and displayed (loosely following the MVVM pattern).  It is primarily consumed by the view-model/ directory.

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
