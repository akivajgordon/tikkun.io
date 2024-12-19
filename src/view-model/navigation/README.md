# Navigation View Models

This directory defines view models that relate to navigating or selecting leinings, as opposed to the actual scroll.

It consumes the model classes in calendar-model/.

## Top Bar

The top bar shows the run and עליות displayed in the current screen, and offers links to navigate to all other runs in this LeiningInstance, as well as the next and previous LeiningInstances in the calendar year.

`TopBarTracker` also includes logic to resolve the current run based on the lines currently in the viewport.
