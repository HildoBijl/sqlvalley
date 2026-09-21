# Input exercise components

React presentation for solo input exercises. Exercise definitions and reducers come from @step-wise/input-exercises; the active instance and controls come from @sqlvalley/exercise-manager through `useCurrentExerciseInstance()` and `useExerciseSessionContext()`.


## Public API

MonoExercise accepts a MonoExerciseRenderSpec with native editor input, conversions to and from upstream raw input, and problem, input, solution, and optional output components. Drafts and submitted answers use the same structured input fields, supporting multiple fields per exercise. The renderer converts drafts back to native editor input when restoring them. `MonoExerciseRenderSpec.getSolutionInput(parameters)` optionally supplies the solution in native editor format. The internal `useShowSolution` hook converts it with `toRawInput` and saves it through the manager?s draft-update control. The shared instance and context use `InputExerciseRawInput` for drafts, so both restoring and setting drafts are checked against the upstream input format. Feedback is restored from stored reports; solved and given-up states use the upstream MonoExerciseState.

The package exports rendering specifications, component props, and feedback/report types. It does not build definitions or generate instances.

The exercise controls read `admin.showControls` from the exercise context. When enabled, this package renders the exercise selector and Show Solution button using `admin.exerciseIds` and `admin.selectExerciseById` from the session context and solution handling from the mono renderer. Tools are disabled while `submitting` is true; Show Solution is also disabled when the render specification has no `getSolutionInput` callback. Showing a solution fills the draft without submitting an answer.

MonoExercise validates the general instance history and state before using mono-specific helpers. The manager hooks do not assert renderer-specific types.
