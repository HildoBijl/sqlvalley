# Input exercise components

React presentation for solo input exercises. Exercise definitions and reducers come from @step-wise/input-exercises; the active instance and controls come from @sqlvalley/exercise-manager.


## Public API

MonoExercise accepts a MonoExerciseRenderSpec with native editor input, conversions to and from upstream raw input, and problem, input, solution, and optional output components. Drafts and submitted answers use the same structured input fields, supporting multiple fields per exercise. The renderer converts drafts back to native editor input when restoring them. Admin solution helpers must also return structured raw input. Feedback is restored from stored reports; solved and given-up states use the upstream MonoExerciseState.

The package exports rendering specifications, component props, and feedback/report types. It does not build definitions or generate instances.
