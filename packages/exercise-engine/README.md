# Exercise engine

Runs solo exercises using `@step-wise/exercise-definition`, with React presentation and application storage supplied separately. The package currently also contains the SimpleExercise renderer and grading adapter.


## Definitions and registrations

`ExerciseDefinition` specializes the upstream `Exercise` type: `processSoloAction` is required, group processing is omitted, and metadata includes an explicit version. Definitions contain no React components.

`ExerciseRegistration` pairs an `exerciseId` and logical `definition` with a props-free `Component`. It also supplies the application's `isSolved` predicate for completion counts and an optional `getSolutionInput` admin helper. Pass registrations to `ExerciseManager` through its `exercises` prop.

```tsx
import type { ExerciseRegistration } from '@sqlvalley/exercise-engine'

const exercise: ExerciseRegistration = {
	exerciseId: 'example',
	definition: {
		metadata: { version: 1 },
		generateParameters: async ({ example, context }) => ({ target: example ? 1 : 2 }),
		getInitialState: async ({ parameters, context }) => ({ attempts: 0 }),
		processSoloAction: async ({ parameters, state, action, context }) => {
			const solved = action.answer === parameters.target
			return { state: { attempts: Number(state.attempts) + 1, solved, done: solved } }
		},
	},
	isSolved: state => state.solved === true,
	Component: ExampleExercise,
}
```

`ExampleExercise` is an application-provided component that reads `useExercise()`. Its context contains the logical definition, current data, controls, and skill identity. Actions must have a string `type`; parameters, state, and reports follow the upstream plain-data contract. The execution context is transient and comes from `ModuleContextProvider`.

The manager awaits parameter generation, initial-state generation, and action processing. It uses `state.done === true` for completion and the registration's `isSolved` predicate to increment solved counts only on the transition to solved. Errors are shown in the exercise UI. Results from obsolete generation requests or submissions to a replaced instance are ignored.


## Transitional SimpleExercise support

`buildSimpleExercise` returns an `ExerciseRegistration`. It adapts the existing specification to `generateParameters`, `getInitialState`, and `processSoloAction`, retaining validation, feedback reports, and solved/given-up behavior. Completed states additionally contain `done: true`.

The current specification and persisted store retain their older broad data types. The adapter narrows these at the upstream boundary; authors must provide serializable parameters, input, and grading results. Input-exercise logic has not yet been replaced with `@step-wise/input-exercises`, and the SimpleExercise names remain until that migration.


## Storage boundary

`ExerciseStorageProvider` receives an application-owned `ExerciseStorage` implementation. Existing stored instances still use `events` and `resultingState`; this phase does not migrate persisted history or require resetting progress.

Initial state is held in memory for the active instance and regenerated when restoring it. Until the storage migration persists initial state, `getInitialState` must return a reproducible result for the same parameters. Existing SimpleExercises return an empty object. Draft input and subsequent states continue to be persisted as before.


## Manual verification

- Open a SQL exercise and check that generation finishes.
- Submit invalid and incorrect SQL; check validation and grading feedback.
- Solve an exercise; check completion and the solved count.
- Give up; check that the solution appears without increasing the solved count.
- Start another exercise; check that feedback and dialogs reset.
- Reload before and after submitting; check restoration of input and feedback.
- In admin mode, switch exercises and show the solution.
- Navigate away during asynchronous work; check that it does not update another exercise.
