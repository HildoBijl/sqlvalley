# Navigation

Navigation combines curriculum, learning components, and application state into pages. Only the router is exported through `@/navigation`.

- `router.tsx`: routes and error/not-found pages.
- `paths.ts`: learning overview paths and labels, plus module URL construction.
- `useLearningNavigationContext.ts`: shared tree-history selection and return destinations.
- `layout`: the header, settings menu, and outlet loading/error boundaries.
- `pages`: the home page and one skill-tree overview page configured by tree ID.
- `pages/modulePage`: `ModulePage` supplies the provider and layout; `ModulePageContent` shares the header, tabs, and content for concepts and skills. The content component selects `StaticPractice` or `InteractivePractice` from learning and renders an independent completion button and one shared completion dialog.

`/module/:moduleId` is the route for both concepts and skills. `ModulePage` validates the ID and supplies the module provider, loading boundary, and container, and renders the shared content component. Module type and available content determine practice, the header icon, progress, and completion behavior. Data Explorer remains skill-only. The old `/concept/...` and `/skill/...` routes have no redirects. Stateful module pages are keyed by ID so completion dialogs reset when navigating to another module. Tab selection uses only available tabs, with precedence URL ? stored preference ? default; unrelated query parameters are preserved. Interactive exercise availability is loaded before selecting tabs.

Curriculum owns tree layouts and follow-up module selection. Learning owns reusable presentation; navigation supplies content, progress, and callbacks. Video tabs remain commented out until video content is introduced.

The retired playground prototype and its route have been removed.

Module-page hooks live in `pages/modulePage/hooks`, with a local barrel export, and separate responsibilities:

- `useModuleData`: presentation, content, tables, and exercise loading.
- `useModuleProgress`: completion status, exercise counts, and persistence actions.
- `useModuleNavigation`: overview and next-module destinations for both concepts and skills.
- `useModulePageTabs`: tab availability and selection through `useModuleTabSelection`.
- `useCompletionDialog`: dialog visibility and notification when completion changes from false to true; it does not read or write the store.

Both module types offer story, summary, and next-module actions when available. Manual completion only updates progress; the dialog opens when completion transitions from false to true.
