# Exercise manager

Runs solo exercises using `@step-wise/exercise-definition`, with React presentation and application storage supplied separately. Exercise renderers are supplied by consumers; the manager uses the upstream input type for drafts and does not own grading logic or input UI.


## Definitions and registrations

`ExerciseRegistration['definition']` selects the upstream `Exercise` fields the manager needs and requires `processSoloAction`. Group processing is omitted from this contract. Metadata version is optional and defaults to `1` when generating or matching saved instances. Definitions contain no React components.

`ExerciseRegistration` pairs an `exerciseId` and logical `definition` with a props-free `Component`. It also supplies the application's `isSolved` predicate for completion counts and an optional `getSolutionInput` admin helper. Pass registrations to `ExerciseManager` through its `exercises` prop. The admin solution helper returns `InputExerciseRawInput`, matching the instance draft and `ExerciseControls.setDraftInput`. Passing `undefined` clears a draft.

```tsx
import type { ExerciseRegistration } from '@sqlvalley/exercise-manager'

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

`ExampleExercise` is an application-provided component that reads `useExercise()`. Its context contains the logical definition, `exerciseInstance`, transient `pending` status, controls, and skill identity. Actions must have a string `type`; parameters, state, and reports follow the upstream plain-data contract. The execution context is transient and comes from `ModuleContextProvider`.

The manager awaits parameter generation, initial-state generation, and action processing. It uses `state.done === true` for completion and the registration's `isSolved` predicate to increment solved counts only on the transition to solved. Errors are shown in the exercise UI. Results from obsolete generation requests or submissions to a replaced instance are ignored.


## Exercise instances and storage

The React-independent [`@sqlvalley/exercise-instances`](../exercise-instances/README.md) package defines `ExerciseInstance`, extending the upstream `SoloExerciseInstance` with `exerciseId`, `version`, `startedAt`, optional `draftInput`, and `submittedAt` on each `ExerciseEvent`. It is available through `@sqlvalley/exercise-instances`, including for application stores.

`generateExerciseInstance(exerciseId, definition, context)` from that package awaits parameter and initial-state generation and returns a complete instance with `mode: 'solo'` and an empty `history`. Generating an instance is separate from building its definition or pairing that definition with a renderer.

`ExerciseStorageProvider` receives an application-owned `ExerciseStorage` implementation. Its `startExercise(skillId, exerciseInstance)` stores the generated instance. Submissions append history events containing `action`, `state`, an optional `report`, and `submittedAt`. Upstream `getCurrentState(exerciseInstance)` returns the latest state, falling back to the stored `initialState`.

The manager restores valid instances directly without regenerating parameters or initial state. Pending submissions and generation status remain transient React state; they are not stored and cannot leave a reloaded exercise stuck in a pending state.

The learning-store v7 to v8 migration converts legacy events into history, supplies the empty initial state used by legacy SimpleExercises, and adds `done: true` to solved/given-up states. The same migration renames instance `createdAt` to `startedAt` and event `timestamp` to `submittedAt`. Existing parameters, reports, drafts, timestamp values, and solved counts are retained. `normalizeExerciseInstance` validates only the current format; historical conversions stay in store migrations. The v8 to v9 migration adapts legacy SQL actions to the structured input and state format used by `@step-wise/input-exercises`.

Solo input rendering now lives in [`@sqlvalley/input-exercise-components`](../input-exercise-components/README.md).


## Manual verification

- Open a SQL exercise and check that generation finishes.
- Submit invalid and incorrect SQL; check validation and grading feedback.
- Solve an exercise; check completion and the solved count.
- Give up; check that the solution appears without increasing the solved count.
- Start another exercise; check that feedback and dialogs reset.
- Reload before and after submitting; check restoration of input and feedback.
- In admin mode, switch exercises and show the solution.
- Navigate away during asynchronous work; check that it does not update another exercise.


## Package structure

- `exerciseContext/`: renderer registration, React context, and `useExercise`.
- `components/`: the manager and its internal admin tools.
- `storage.ts` and `storageContext.tsx`: application storage contract and injection.
- `moduleContext.tsx`: subject-specific execution context.

The manager provides the exercise context and renders the supplied component directly. The application owns its concrete storage adapter and persistence migrations.
