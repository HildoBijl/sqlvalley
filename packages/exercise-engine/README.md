# Exercise engine

This package temporarily owns the SimpleExercise grading adapter and React presentation. Generic exercise lifecycle, contexts, instance generation, and storage contracts now belong to [@sqlvalley/exercise-manager](../exercise-manager/README.md).


## Current API

`buildSimpleExercise(specification)` adapts the existing specification to the upstream solo exercise contract and pairs it with the SimpleExercise renderer. It currently returns an `ExerciseRegistration` from `@sqlvalley/exercise-manager`. Separating definition building from presentation registration is deferred to the MonoExercise migration.

The package also exports SimpleExercise rendering specifications, component props, state helpers, and report types. It retains validation, feedback, solved/given-up behavior, controls, and dialogs. Input-exercise logic has not yet been replaced with `@step-wise/input-exercises`.

SimpleExercise specifications retain broad data types; authors must supply serializable parameters, input, and grading results. Completed states include `done: true`.


## Dependencies

The SimpleExercise renderer consumes `useExercise` and `useModuleContext` from `@sqlvalley/exercise-manager`. The manager accepts supplied renderers and never imports this package.

Consumers must import manager APIs directly from `@sqlvalley/exercise-manager`, including `ExerciseManager`, `ExerciseStorageProvider`, `ModuleContextProvider`, and `ExerciseRegistration`. Stores import the shared instance format through `@sqlvalley/exercise-manager/exerciseSelection`.


## Verification

Use the [manager's manual verification checklist](../exercise-manager/README.md#manual-verification) to check generation, grading, giving up, reloads, and admin controls.
