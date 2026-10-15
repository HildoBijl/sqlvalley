# SQL Valley source code

SQL Valley is split into reusable packages, application-specific foundations, educational code, and page composition. This separation should make two questions easy to answer:

- Where can I find the code responsible for a feature?
- Where should new code be added?

The main dependency direction is:

```text
packages
   ↓
application core
   ↓
learning → curriculum → modules
   ↓
navigation → App.tsx → main.tsx
```

Code should only depend on layers above it in this diagram. In particular, reusable packages must not know about SQL Valley, curriculum must not import concrete modules, and general learning components must not know about the module tree.


## App-independent tools: `packages`

Reusable tools live in [packages/](../packages/), outside `src`. Each package has a focused responsibility and exposes an intentional public API through its root `index.ts`.

Examples include exercise infrastructure, SQL execution and grading, mock data, module-tree logic, progress planning, drawing utilities, and the skill-tree visualization. These packages should not import application code from `src`.

Look in `packages` when you are searching for:

- Logic or components that could be reused by another application.
- Domain tools that do not need SQL Valley's curriculum, routes, stores, or theme configuration.
- Foundational implementations consumed by several unrelated parts of the app.

Read the README of the relevant package before changing its architecture or public API. Package dependencies should continue to flow from foundational utilities toward higher-level tools.


## App-dependent foundations

The first layer inside `src` contains functionality that belongs specifically to the SQL Valley application but is not educational content.

- [settings.ts](./settings.ts) defines application-wide constants such as the app name, version, and theme colors.
- [index.css](./index.css) defines global browser and document styling.
- [store/](./store/) owns persisted application state, including learner progress, preferences, and skill-tree settings. It also contains the shared persistence and migration infrastructure.
- [ui/](./ui/) contains shared SQL Valley presentation: the Material UI theme, document elements, alerts, status components, mathematical rendering, and application glyphs. Import its public API through `@/ui`.

Put code here when it is broadly useful throughout SQL Valley but still depends on application-specific styling, storage, or conventions. Educational concepts and module-aware behavior belong in the next layer instead.


## Educational code

Educational code is divided by how much it knows about the curriculum.

### General learning tools: `learning`

[learning/](./learning/) contains educational components that do not know which modules exist or how they depend on one another. This includes learning-page layout, notation, completion UI, practice containers, data exploration, and reusable query figures.

Use `learning` for a component that understands teaching or practice but could be used unchanged in a different curriculum. Import its public API through `@/learning`.

See the [learning README](./learning/README.md) for its components and content contracts.

### Curriculum configuration: `curriculum`

[curriculum/](./curriculum/) contains everything that is aware of SQL Valley's module tree and shared curriculum configuration. It defines module dependencies and presentation, skill-tree layouts, curriculum schemas, database-specific lesson support, and defaults for building exercises.

Curriculum may use general learning tools, but it must not import concrete content from `modules`. This keeps the dependency direction one-way and allows navigation to combine definitions and content without a cycle. Import its public API through `@/curriculum`.

See the [curriculum README](./curriculum/README.md) for the current registries and responsibilities.

### Concrete content: `modules`

[modules/](./modules/) contains the actual content for each curriculum module. Every module has its own folder and may provide theory, summary, story, video, practice, or exercises through its local `index.ts`.

The root of `modules` also owns the dynamic module and exercise loading registries. Keeping those registries beside the content makes module discovery and lazy loading explicit while leaving curriculum independent of concrete imports.

Look here when changing what learners read, watch, or practise in a specific module. Shared educational presentation should be extracted to `learning`; shared module-aware configuration should be extracted to `curriculum`.


## Page composition and application startup

The final layer combines all lower layers into routes and pages.

- [navigation/](./navigation/) defines routing, shared page layout, and user-facing pages. It is allowed to combine application state, learning tools, curriculum definitions, and dynamically loaded module content. Only its router is exposed through `@/navigation`.
- [App.tsx](./App.tsx) installs global providers and renders the router.
- [main.tsx](./main.tsx) is Vite's browser entry point and mounts the application.
- [vite-env.d.ts](./vite-env.d.ts) provides Vite-specific TypeScript declarations.

See the [navigation README](./navigation/README.md) for route and module-page composition details.


## Where should new code go?

Use the lowest appropriate layer:

1. If it is independent of SQL Valley, add it to an existing package or create a focused package.
2. If it is general SQL Valley configuration, storage, or presentation, use `settings.ts`, `store`, or `ui`.
3. If it is educational but module-independent, use `learning`.
4. If it knows about the module tree or shared curriculum, use `curriculum`.
5. If it is content for one particular module, use that folder in `modules`.
6. If it combines these pieces into a route or page, use `navigation`.

Avoid placing reusable logic directly in a higher layer merely because that is where its first caller happens to live. Moving shared responsibilities downward keeps imports predictable and prevents dependency cycles.


## Finding your way around

Choose an entry point based on what you want to understand:

- To follow application startup, read [main.tsx](./main.tsx), [App.tsx](./App.tsx), and then [navigation/](./navigation/).
- To understand a visible page, start with its component in `navigation/pages` and follow its imports downward.
- To understand the learning model, start with [curriculum/moduleDefinition.ts](./curriculum/moduleDefinition.ts) and the [curriculum README](./curriculum/README.md).
- To edit lesson content, open the relevant folder in [modules/](./modules/).
- To find reusable mechanics, search [packages/](../packages/) and read the owning package's README.
- To understand persisted state, start with the [store README](./store/README.md).
