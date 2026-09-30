# Curriculum - Configuration and tools

This folder contains the module tree, curriculum configuration, and tools that apply them. Dynamically loaded module content lives in `src/modules`.

The content loader supplies lazy components matching learning's `ModuleContent` contract. Pages select the module and pass its content to navigation's `ModuleContentTab`; learning does not import the curriculum registry. Static practice has a separate component contract.

Import public tools from `@/curriculum`. Internal files use relative imports to keep loading and hot-reload dependencies independent.

- `moduleDefinition.ts` and `modulePresentation.ts`: module IDs, prerequisites, names, and descriptions.
- `content`: lazy module content and provider registries. Static practice has its own props contract.
- `exercises`: builds registrations with module defaults and loads them through `useModuleExercises(moduleId, { enabled })`, returning `{ exercises, loading, error }`. Loader and HMR helpers remain private.
- `database`: table introductions and the curriculum-specific `SqlModuleProvider`.
- `schemas`: shared lesson content describing the SQL Valley, Companies, and Shopping datasets.
- `skillTreeVisualizations`: SQL, relational-algebra, and Datalog layouts plus their shared registry. Navigation owns paths and menu labels.

Generic query figures and `useTheoryPageDatabase` live in `@/learning`; they consume the current database context without looking up curriculum modules.

Follow-up module selection lives in `@sqlvalley/progress`. Navigation validates the stored goal and supplies the curriculum tree, allowed module IDs, and completion state to `getNextModuleIds`.

The exercise HMR registry must stay independent of runtime exercise imports. Vite injects its import into exercise builder modules; update that path when moving the registry.
