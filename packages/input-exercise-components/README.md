# Input exercise components

React presentation for solo input exercises. Exercise definitions and reducers come from @step-wise/input-exercises; the active instance and controls come from @sqlvalley/exercise-manager through `useCurrentExerciseInstance()` and `useExerciseSessionContext()`.


## Public API

`MonoExercise` accepts `MonoExerciseProps` containing `Problem`, `InputArea`, `Solution`, and optional `InputVisualization` components. It wraps these in `InputExerciseProvider`. Fields use `useInputField(name, { type, validate })` to read and update draft editor states; missing string values display as empty strings. Submission normalizes each registered field into its typed InputValue. Value conversion belongs to the fields and the definition's `valueOperations`. Feedback is restored from stored reports.

MonoExercise renders the Problem section, input area, feedback and buttons, input visualization, and finally the Solution section after completion. It owns shared section headings, spacing, rounded backgrounds, and solution collapse controls. The problem section uses the standard heading "Exercise". Supplied components contain subject-specific content, not section wrappers. Story slots are deferred until story mode is implemented.

```tsx
const componentProps = {
	Problem: ProblemContent,
	InputArea: InputEditor,
	InputVisualization: InputPreview,
	Solution: SolutionContent,
}

<MonoExercise {...componentProps} />
```

Solution components read the definition's resolved solution through `useSolution()`, sharing it with admin solution insertion. Input areas remain visible but disabled during submission and after completion.

The package exports component props and feedback/report types. It does not build definitions or generate instances.

`ExerciseAdminTools` reads `admin.showControls` from the exercise context and renders nothing when disabled. It combines the exercise manager?s `ExerciseSelection` with `ShowSolutionButton`. When enabled, this package renders the exercise selector and Show Solution button using `admin.exerciseIds` and `admin.selectExerciseById` from the session context and solution handling from the input provider. Tools are disabled while `submitting` is true; Show Solution is also disabled when no solution is available. Showing a solution fills the draft without submitting an answer.

MonoExercise checks that the definition is a mono exercise using the upstream `isMonoExercise` guard. It assumes the paired instance state was produced by that definition rather than revalidating its entire history.


## Shared input provider

`InputExerciseProvider` runs inside an exercise manager. It exposes `instance.draftInput` directly as `input` through `useInputExerciseContext()`. Missing or cleared drafts yield `undefined`; input components display an empty value for absent fields. `setInput(input)` accepts a value or an updater such as `setInput(current => ({ ...current, ...fields }))` and writes directly to exercise storage; it does not maintain a second copy of form state.

```tsx
<InputExerciseProvider>
	<ExerciseContents />
</InputExerciseProvider>
```

The hook also returns `solution` and optional `insertSolution()`. The provider displays loading and error notes in place of its children, so children do not need to handle solution loading or failures. Solutions are resolved asynchronously using the definition's upstream solution helpers, deserialized parameters, stored input dependency, and module context. Draft edits do not recompute input dependencies: the reducer owns those updates. Obsolete results are ignored. Solution failures are displayed by the provider.

Solution insertion converts solution domain values through `toInputValue`, then applies each field?s `hydrateInput` before storing the draft. It fills mounted, registered fields whose names occur in the solution and preserves other draft fields. Fields unregister on unmount; each field name may be registered only once at a time. `insertSolution` is exposed only when the manager's `showAdminControls` flag is enabled. It does not submit an answer and is blocked during submission. Definitions without `getSolution` render normally with `solution` and `insertSolution` set to `undefined`. Subject-specific solution fields must be narrowed by consumers.

MonoExercise uses this provider internally; custom renderers can also wrap their contents with it.

Use `useInput()` to read only the current draft input, or `useSolution()` to read only the resolved solution. Both require an `InputExerciseProvider` and may return `undefined` when that value is absent.

`useInputField(name, options)` returns `{ value, setValue, validation }`. The options object requires `type`, `normalizeInput`, and `hydrateInput`, and may specify `validate`. `value` is the raw input value (or `undefined`); `setValue` stores editor state unchanged. Each mounted field has one registration containing its type and frontend-only validation functions, not another copy of the input. The validation hook reads that registry, and solution insertion and field updates use the same registered type.

`options.normalizeInput` is required and converts editor state to an InputValue; `options.hydrateInput` converts an InputValue back to editor state. It should return a stable, JSON-serializable value so equivalent drafts have the same validation key. `options.validate` receives `{ rawInput, normalizedInput, context, signal }` and may return a result or a promise; `signal` is aborted when that live validation becomes obsolete. A validator should return `{ valid: false }` for empty input when it must be rejected without feedback. Without a validator, any value is valid. Invalid results can contain React feedback; valid results can contain any transient report for visualizations. Validation results are tied to the normalized value and module context, and obsolete asynchronous results are ignored. `useInputExerciseContext()` exposes `getFieldValidation(name)`, `allInputsValid`, `validationPending`, `canGiveUp`, and `isSubmitButtonEnabled`.

```tsx
const { value, setValue } = useInputField('query', {
	type: 'SQL',
	normalizeInput: value => ({ type: 'SQL', value: typeof value === 'string' ? value.trim() : '' }),
	hydrateInput: value => String(value.value),
	validate: ({ normalizedInput }) => ({ valid: typeof normalizedInput === 'object' && normalizedInput !== null && 'value' in normalizedInput && Boolean(normalizedInput.value) }),
})
return <textarea value={typeof value === 'string' ? value : ''} onChange={event => setValue(event.target.value)} />
```

The shared `NextExerciseButton`, `GiveUpButton`, and `SubmitAnswerButton` components accept a `disabled` prop and also disable themselves during submission. `GiveUpButton` confirms before submitting a give-up action; `NextExerciseButton` starts a new exercise. `SubmitAnswerButton` calls the input provider's `submitInput()` directly. Other input controls, such as an editor's execute shortcut, can use the same callback from `useInputExerciseContext()`. The renderer decides when each button is shown.

Submission and giving up require module resources and no submission in progress. `submitInput()` prevents submission after completion and synchronously checks that the displayed draft still has current, valid results for every registered field. It does not run validation again or wait for pending results. The provider calculates button availability once for all consumers: `isSubmitButtonEnabled` briefly retains its previously valid appearance during pending validation to avoid flicker, but a click during that interval does nothing until validation succeeds. Submission feedback is shown only while the current normalized draft matches the input action that produced it, including for restored exercise history.

`InputVisualization` receives the latest input action's full `report` as `InputExerciseReport | undefined` from `@step-wise/input-exercises`. Consumers narrow any exercise-specific report fields themselves; there is no grading-result generic.

Component slots receive `parameters` as the upstream `ExerciseParameters` type. The rendering API has no parameter generic; components narrow exercise-specific fields where needed.

The input context exposes `normalizeInput(draft)` to convert registered field states into submitted input values, and `hydrateInput(input)` for the reverse conversion.
