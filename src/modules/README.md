# Modules

Each folder matches a module ID in the curriculum. Its `index.ts` exports `ModuleProvider` first, followed by the available named content components: `Theory`, `Summary`, `Story`, and optionally `Video` or `Practice`.

The module registry discovers these index files through a Vite glob. Opening a module loads its complete page-level implementation as one operation, after which navigation can switch sections without another lazy module load. Learning renders the supplied components; navigation selects the active tab. Video components remain available even while video tabs are disabled in navigation.


## Drawings

Module illustrations use `@step-wise/drawing`. Use `Drawing` for fixed dimensions and `MeasuredDrawing` for layouts sized from named targets. Target hooks must run inside the drawing, so measured figures separate their outer view from their content component. `useFigureTarget` and `useFigureTextBounds` from `@/learning` support table and query annotations. Set `strokeWidth={2}` explicitly on arrows.


## Interactive exercises

Put one exercise spec in each file under `exercises/`, with a stable, unique `exerciseId`. Export the spec as default, using `SQLMonoExerciseSpec` or `defineSQLMonoExercise` for parameter inference.

The folder's `exercises/index.ts` imports all specs and exports a default `buildExercises(skillId)` function that calls `buildModuleExercises` from `@/curriculum`. Exercise builders are discovered separately from module indexes, so exercises remain outside the page-level module bundle until they are needed.


## Static exercises

Export a named `Practice` component from `Practice.tsx` and re-export it from the module index. Use `ManualExerciseSet` from `@/learning` with `{ problem, solution }` entries. Navigation supplies the completion action separately.

Use one practice format per skill: interactive exercises or static practice. Concept modules do not require exercises.
