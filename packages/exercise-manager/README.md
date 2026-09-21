# Exercise manager

Runs solo exercises using `@step-wise/exercise-definition`, with React presentation and application storage supplied separately. Exercise renderers are supplied by consumers; the manager uses the upstream input type for drafts and does not own grading logic or input UI.


## Definitions and registrations

Generic exercise types use the Step-Wise order: `Action, State, Parameters`. The shared context and its hooks return general exercise types without caller-supplied type arguments. Consumers narrow specific action, state, and parameter types with type guards.

`ExerciseRegistration['definition']` uses the upstream `AnyExercise` type. Registrations have no generic parameters; exercise builders retain their specific types. The manager checks for `processSoloAction` before generation and submission and reports an error for exercises without solo support. Metadata version is optional and defaults to `1` when generating or matching saved instances. Definitions contain no React components.

`ExerciseRegistration` pairs an `exerciseId` and logical `definition` with a props-free `Component`. Pass registrations to `ExerciseManager` through its `exercises` prop. `ExerciseControls.setDraftInput` accepts structured raw input; solution handling belongs to the input renderer. Passing `undefined` clears a draft.

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
	Component: ExampleExercise,
}
```

`ExampleExercise` is an application-provided component that reads `useExerciseSessionContext()`. `ExerciseSessionContext` contains `currentExercise: { definition, instance }`, `skillId`, transient `submitting` status, and controls. Its `admin` object contains `showControls`, the available `exerciseIds`, and `selectExerciseById`. Regular controls include action submission, draft updates, and starting another exercise; renderers decide how to display the admin tools. Actions must have a string `type`; parameters, state, and reports follow the upstream plain-data contract. The execution context is transient and comes from `ModuleContextProvider`.

Import `useCurrentExercise()` to read the definition and instance together, or `useCurrentExerciseInstance()` to read only the instance. These hooks are exported from `@sqlvalley/exercise-manager` and require an enclosing manager. They read context; they do not subscribe to the application store.

The manager awaits parameter generation, initial-state generation, and action processing. It uses `isStateDone` for completion. Reducer `updateSkills` callbacks are normalized with `ensureSetup`; only correct pure-skill outcomes are collected. Their skill IDs are committed alongside the action after the reducer succeeds and the submission is confirmed current. Combined setups and incorrect outcomes do not increment counters. Reducers are responsible for reporting each successful outcome once. Generation and submission hooks own separate error states. Submission errors are scoped to the affected exercise instance and cleared when another submission starts or dismissed explicitly. Errors replace the exercise UI. Generation errors offer a retry of the same exercise registration; submission errors offer a return to the saved exercise and draft without generating another instance. Results from obsolete generation requests or submissions to a replaced instance are ignored.


## Exercise instances and storage

The React-independent [`@sqlvalley/exercise-instances`](../exercise-instances/README.md) package defines `ExerciseInstance`, extending the upstream `SoloExerciseInstance` with `exerciseId`, `version`, `startedAt`, optional `draftInput`, and `submittedAt` on each `ExerciseEvent`. It is available through `@sqlvalley/exercise-instances`, including for application stores.

`generateExerciseInstance(exerciseId, definition, context)` from that package awaits parameter and initial-state generation and returns a complete instance with `mode: 'solo'` and an empty `history`. Generating an instance is separate from building its definition or pairing that definition with a renderer.

`ExerciseManager` receives an application-owned `ExerciseStorage` implementation through its required `storage` prop. The caller subscribes to its store and supplies the current instance (or `undefined`) through the required `currentExerciseInstance` prop. The manager renders from that prop and uses storage reads to check the latest data during asynchronous operations. Its `startExercise(skillId, exerciseInstance)` stores the generated instance. Submissions append history events containing `action`, `state`, an optional `report`, and `submittedAt`. Upstream `getCurrentState(exerciseInstance)` returns the latest state, falling back to the stored `initialState`.

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

- `exerciseSessionContext/`: renderer registration, React context, and access hooks.
- `exerciseManager/`: the rendering component.
- `exerciseManager/exerciseSession/`: `useExerciseSession` coordinates `useExerciseGeneration` (selection, generation, retries) and `useExerciseSubmission` (actions, skill updates, drafts). A shared operation guard prevents overlapping generation and submission.
- `exerciseManager/types.ts`: the public `ExerciseStorage` contract and `ExerciseManagerProps` component props.
- `exerciseManager/exerciseSession/types.ts`: session options and shared operation types.
- `moduleContext/`: subject-specific execution context, provider, and access hook.

`ModuleProviderComponent` accepts `moduleId` and `children`. Applications select the provider per module and mount it around page content independently of exercise loading.

The manager renders the supplied component and provides its exercise context. Its internal `useExerciseSession` hook owns the lifecycle and actions, including fresh storage reads and guards against obsolete asynchronous results. Callers must remount it when `skillId` changes: set `key={skillId}` on `ExerciseManager` or on a surrounding component, such as the module provider. The manager retains its exercise-instance key to reset renderer state when a new exercise starts within the same skill. The application owns its concrete storage adapter and persistence migrations.


## Exercise selection

Automatic selection calls `selectExercise` from `@sqlvalley/exercise-instances` with the skill's history from `ExerciseStorage.getHistory` (oldest first, including the current instance). Pass `selectionOptions={{ dontRepeatBefore: 3, minimumChoices: 2 }}` to `ExerciseManager` to override the defaults in code.

Compatible saved instances are restored directly. Replacing an outdated version preserves the selected exercise ID, and explicit admin selections bypass repeat avoidance. History is read from the store when choosing, so the learning store needs no new persisted fields or migration.

The manager displays loading UI during generation or while module resources are unavailable. During action submission, the exercise stays mounted and receives `submitting: true` so its editor and controls can be disabled.
