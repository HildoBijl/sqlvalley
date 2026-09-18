# Exercise instances

React-independent types and utilities for generated solo exercises, built on `@step-wise/exercise-definition`. This package has no dependency on the exercise manager, renderers, or application store.


## Definitions and instances

`ExerciseDefinition` specializes the upstream exercise contract to require a solo reducer and an explicit metadata version. It contains no React component. Building a definition from exercise specifications belongs to the relevant exercise-definition builder.

`ExerciseInstance` extends the upstream solo instance with `exerciseId`, `version`, `startedAt`, optional `draftInput`, and `submittedAt` on each `ExerciseEvent`. It retains `mode: 'solo'`, `parameters`, `initialState`, and `history`.


## Generation

`generateExerciseInstance(exerciseId, definition, context)` awaits parameter generation and initial-state generation, then returns a complete instance with an empty history. The caller chooses the definition and supplies transient execution capabilities through context. Context is not persisted in the instance.

`@sqlvalley/exercise-manager` owns selection policies, React lifecycle, renderer registration, and the storage connection. This package generates an instance of the chosen definition.


## Persistence

Application stores import the shared instance format and `normalizeExerciseInstance` directly from this package. Normalization accepts the current format, validates plain data, and discards invalid optional fields or history events. Invalid instances return `null`.

Historical format conversions belong to application-store migrations. This package extraction does not change the persisted format or require another migration. Pending submissions and generation status are transient manager state, not persisted instance fields.

Use `getCurrentState` from `@step-wise/exercise-definition` to read the latest state, falling back to the instance's saved initial state.
