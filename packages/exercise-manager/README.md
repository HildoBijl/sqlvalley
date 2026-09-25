# Exercise manager

Runs solo exercises from `@step-wise/exercise-definition`: selects and generates exercises, restores saved instances, processes actions, and renders the supplied exercise component. The application supplies storage and subscribes to its updates.


## Set up ExerciseManager

Set up exercise "registrations" by pairing up exercise definitions with respective exercise React components.

```tsx
import { type ExerciseRegistration, ExerciseManager } from '@sqlvalley/exercise-manager'

const exercises: ExerciseRegistration[] = [
	{ exerciseId: 'example', definition: exampleDefinition, Component: ExampleExercise },
]

// Inside your application component:
<ExerciseManager
	key={skillId}
	skillId={skillId}
	exercises={exercises}
	storage={exerciseStorage}
	currentExerciseInstance={currentExerciseInstance}
/>
```

The definition must support `processSoloAction`. The parent reads `currentExerciseInstance` from its store through a reactive hook, passing `undefined` when none exists. Key the manager or an ancestor by skill ID so navigation starts a fresh session.

Implement the exported `ExerciseStorage` interface to connect your store:

- `getCurrentInstance(skillId)` returns the current instance or `undefined`.
- `getExerciseHistory(skillId)` returns instances oldest first, including the current one.
- `startExercise(skillId, instance)` stores a generated instance.
- `submitAction(skillId, action, state, report, solvedSkillIds)` saves an action's outcome and applies the collected skill updates.
- `setDraftInput(skillId, input)` saves structured draft input; `undefined` clears it.

The manager restores compatible instances and generates replacements when needed. It displays loading and error messages. Optional `selectionOptions={{ dontRepeatBefore: 3, minimumChoices: 2 }}` controls repeat avoidance; these are the defaults. Set `showAdminControls` to enable admin UI in renderers that support it.


## Access the exercise session

Every exercise component receives the session as props, typed as `ExerciseSessionContextValue`. The same data is available through `useExerciseSessionContext()` in the component and its descendants, so components can use either approach:

```tsx
import { useExerciseSessionContext } from '@sqlvalley/exercise-manager'

function ExampleExercise() {
	const { currentExercise, submitting, controls } = useExerciseSessionContext()
	return <div>
		<p>Exercise: {currentExercise.instance.exerciseId}</p>
		<button disabled={submitting} onClick={controls.startNewExercise}>
			Next exercise
		</button>
	</div>
}
```

The context provides:

- `skillId` for reference (usually unused).
- `context`: the inner resource context, also available through `useExerciseContext()`.
- `currentExercise: { definition, instance }` to access exercise parameters and state.
- `submitting`, for disabling controls while an action is processed.
- `controls`: `submitAction(action)`, `setDraftInput(input)`, and `startNewExercise()`.
- `admin`: `showControls`, `exerciseIds`, and `selectExerciseById(id)`.

Use `useCurrentExercise()`, `useCurrentExerciseInstance()`, or `useExerciseDefinition()` when only that data is needed. `useLastInputEvent()` memoizes the latest input event (including its report), skipping other action types, and returns `undefined` before any input submission. Exercise-specific types should be checked and narrowed by the renderer. The manager provides the controls; the exercise component decides how to display them. The exported `ExerciseSelection` component renders the exercise selector within an exercise session and disables it during submission. Render it when `admin.showControls` is enabled. `RegenerateExerciseButton` starts a fresh instance of the current exercise ID, regenerating its parameters. It is visible only in admin mode and disabled during submission.


## Supply exercise context

Pass an optional `resources` prop with `{ loading, error?, context }`. The exported `ExerciseResources<Context>` union allows context to be absent while loading or after failure, and requires it on success. The manager waits while resources load and displays initialization errors. Omit `resources` for exercises without shared resources.

Only the inner `resources.context` reaches `generateParameters`, `getInitialState`, and `processSoloAction` as their `context` argument. Exercise components read it through `useExerciseContext()` and narrow it to their resource-specific type.

```tsx
<ExerciseManager
	key={skillId}
	skillId={skillId}
	exercises={exercises}
	storage={exerciseStorage}
	currentExerciseInstance={currentExerciseInstance}
	resources={{ loading: false, context: { database } }}
/>
```

`ModuleContextProvider` remains useful for sharing resources across a module page, including theory components. The application explicitly connects it to the manager:

```tsx
import { ExerciseManager, useModuleContext } from '@sqlvalley/exercise-manager'

function Practice() {
	const resources = useModuleContext()
	return <ExerciseManager {...exerciseManagerProps} resources={resources} />
}
```

Render this component inside `<ModuleContextProvider value={resources}>`. The module provider shares the complete wrapper; `useExerciseContext()` returns only its inner context. The manager does not read module context automatically; callers can obtain its context from any source.
