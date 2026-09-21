# Input exercise components

React presentation for solo input exercises. Exercise definitions and reducers come from @step-wise/input-exercises; the active instance and controls come from @sqlvalley/exercise-manager through `useCurrentExerciseInstance()` and `useExerciseSessionContext()`.


## Public API

MonoExercise accepts a MonoExerciseRenderSpec with native editor input, conversions to and from upstream raw input, and problem, input, solution, and optional output components. Drafts and submitted answers use the same structured input fields, supporting multiple fields per exercise. The renderer converts drafts back to native editor input when restoring them. MonoExercise wraps its contents in `InputExerciseProvider`. Input components register their field names and types through `useInputField(name, type)`; solution insertion uses the definition's `valueOperations.toInputValue`. Missing drafts display `initialInput`; previously submitted input is not restored as a draft. The shared instance and context use `InputExerciseRawInput` for drafts, so both restoring and setting drafts are checked against the upstream input format. Feedback is restored from stored reports; solved and given-up states use the upstream MonoExerciseState.

The package exports rendering specifications, component props, and feedback/report types. It does not build definitions or generate instances.

The exercise controls read `admin.showControls` from the exercise context. When enabled, this package renders the exercise selector and Show Solution button using `admin.exerciseIds` and `admin.selectExerciseById` from the session context and solution handling from the input provider. Tools are disabled while `submitting` is true; Show Solution is also disabled when no solution is available. Showing a solution fills the draft without submitting an answer.

MonoExercise validates the general instance history and state before using mono-specific helpers. The manager hooks do not assert renderer-specific types.


## Shared input provider

`InputExerciseProvider` runs inside an exercise manager. It exposes `instance.draftInput` directly as `input` through `useInputExerciseContext()`. Missing or cleared drafts yield `undefined`; input components display an empty value for absent fields. `setInput(input)` accepts a value or an updater such as `setInput(current => ({ ...current, ...fields }))` and writes directly to exercise storage; it does not maintain a second copy of form state.

```tsx
<InputExerciseProvider>
	<ExerciseContents />
</InputExerciseProvider>
```

The hook also returns `solution` and optional `insertSolution()`. The provider displays loading and error notes in place of its children, so children do not need to handle solution loading or failures. Solutions are resolved asynchronously using the definition's upstream solution helpers, deserialized parameters, stored input dependency, and module context. Draft edits do not recompute input dependencies: the reducer owns those updates. Obsolete results are ignored. Solution failures are displayed by the provider.

Solution insertion fills mounted, registered fields whose names occur in the solution and preserves other draft fields. Fields unregister on unmount; each field name may be registered only once at a time. `insertSolution` is exposed only when the manager's `showAdminControls` flag is enabled. It does not submit an answer and is blocked during submission. Definitions without `getSolution` render normally with `solution` and `insertSolution` set to `undefined`. Subject-specific solution fields must be narrowed by consumers.

MonoExercise uses this provider internally; custom renderers can also wrap their contents with it.

Use `useInput()` to read only the current draft input, or `useSolution()` to read only the resolved solution. Both require an `InputExerciseProvider` and may return `undefined` when that value is absent.

`useInputField(name, type)` returns `{ value, setValue }`. `value` is the raw input value (or `undefined`); `setValue` accepts a domain value and converts it through the definition's value operations. Field registration stores metadata only, not another copy of the input.

```tsx
const { value, setValue } = useInputField('query', 'SQL')
return <textarea value={typeof value?.value === 'string' ? value.value : ''} onChange={event => setValue(event.target.value)} />
```
