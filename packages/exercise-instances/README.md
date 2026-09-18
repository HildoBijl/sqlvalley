# Exercise instances

React-independent types and utilities for SQL Valley?s generated solo input exercises, built on `@step-wise/exercise-definition` and `@step-wise/input-exercises`. This package has no dependency on the exercise manager, renderers, or application store.


## Definitions and instances

Definitions use the types from `@step-wise/exercise-definition` directly. This package does not define a separate definition type. Metadata uses the upstream optional `version`, defaulting to `1` when omitted. Generated instances store the resolved version explicitly.

`ExerciseInstance` extends the upstream solo instance with `exerciseId`, `version`, `startedAt`, optional `draftInput`, and `submittedAt` on each `ExerciseEvent`. It retains `mode: 'solo'`, `parameters`, `initialState`, and `history`. All exercises in SQL Valley have input, so `draftInput` uses `InputExerciseRawInput` directly. Each draft contains named fields with typed input values, matching submitted input.


## Generation

`generateExerciseInstance(exerciseId, definition, context)` accepts the upstream `Exercise` type and uses its metadata, parameter-generation function, and initial-state function; no reducer is required for generation. It awaits parameter generation and initial-state generation, then returns a complete instance with an empty history. The caller chooses the definition and supplies transient execution capabilities through context. Context is not persisted in the instance.

`@sqlvalley/exercise-manager` owns selection policies, React lifecycle, renderer registration, and the storage connection. This package generates an instance of the chosen definition.


## Persistence

Application stores import the shared instance format and `normalizeExerciseInstance` directly from this package. Normalization accepts the current format, validates plain data and the draft field envelopes, and discards invalid optional fields or history events. Exercise-specific input adapters validate the meaning of individual field values. Invalid instances return `null`.

Historical format conversions belong to application-store migrations. This package extraction does not change the persisted format or require another migration. Pending submissions and generation status are transient manager state, not persisted instance fields.

Use `getCurrentState` from `@step-wise/exercise-definition` to read the latest state, falling back to the instance's saved initial state.
