# Curriculum - Configuration and tools

This folder contains the module tree, curriculum configuration, and reusable tools for defining modules. Concrete module content and its dynamic registries live in `src/modules`.

The curriculum does not import concrete modules. Navigation combines the curriculum definition with the content, provider, and exercise registries exported by `src/modules`.

Import public tools from `@/curriculum`. Internal files use relative imports to keep loading and hot-reload dependencies independent.

- `moduleDefinition.ts` and `modulePresentation.ts`: module IDs, prerequisites, names, and descriptions.
- `buildModuleExercises.ts`: builds exercise registrations with curriculum defaults. Modules load the resulting registrations through their own exercise registry.
- `database`: table introductions and the curriculum-specific `SqlModuleProvider`.
- `database/storyDatabaseSource.ts`: application-owned story overlays around the neutral mock-data source, including the finale-only `record_changes` table. `storyCases.ts` defines controlled reference facts and `storyPreviewRows.json` copies the required baseline relationships into the small preview.
- `exercises`: the story exercise authoring helper, shared module scripts, and current-version distinct-family selection/completion. Concrete exercises still live under their respective modules.
- `schemas`: shared lesson content describing the SQL Valley, Companies, and Shopping datasets.
- `skillTreeVisualizations`: SQL, relational-algebra, and Datalog layouts plus their shared registry. Navigation owns paths and menu labels.

Generic query figures and `useTheoryPageDatabase` live in `@/learning`; they consume the current database context without looking up curriculum modules.

Follow-up module selection lives in `@sqlvalley/progress`. Navigation validates the stored goal and supplies the curriculum tree, allowed module IDs, and completion state to `getNextModuleId`.

The exercise HMR registry in `src/modules` must stay independent of runtime exercise imports. Vite injects its import into exercise builder modules; update that path when moving the registry.

See [the exercise review guide](../../markdown%20material/06_exercise_review_guide.md) for the implemented set, story evidence contract, versioning rules and verification commands.
