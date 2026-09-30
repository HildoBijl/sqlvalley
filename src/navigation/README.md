# Navigation

Navigation combines curriculum, learning components, and application state into pages. Only the router is exported through `@/navigation`.

- `router.tsx`: routes, the survey redirect, and error/not-found pages.
- `paths.ts`: learning overview paths and labels, plus module URL construction.
- `useLearningNavigation.ts`: shared tree-history selection and return destinations.
- `layout`: the header, settings menu, and outlet loading/error boundaries.
- `pages`: the home page and one skill-tree overview page configured by tree ID.
- `pages/modulePages`: separate concept and skill pages, a shared module layout, tab synchronization, static practice, and skill completion handling.

Module IDs are validated before mounting page state. Stateful module pages are keyed by ID so completion dialogs reset when navigating to another module. Tab selection uses only available tabs, with precedence URL ? stored preference ? default; unrelated query parameters are preserved. Interactive exercise availability is loaded before selecting tabs.

Curriculum owns tree layouts and follow-up module selection. Learning owns reusable presentation; navigation supplies content, progress, and callbacks. Video tabs remain commented out until video content is introduced.

The retired playground prototype and its route have been removed.
