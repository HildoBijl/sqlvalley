# Exercise instances

Types and utilities for selecting, generating, and restoring SQL Valley's solo input exercises. Built on `@step-wise/exercise-definition` and `@step-wise/input-exercises`.

An exercise definition describes how an exercise works. An **exercise instance** represents one generated exercise for a learner: its parameters, starting state, submitted answers, and optional unfinished input (the draft). Draft fields contain serializable editor states; submitted action fields contain typed input values. It also records the exercise ID, version, and timestamps.


## Main functions

Generic exercise types use the Step-Wise order: `Action, State, Parameters`.

- `selectExercise(exercises, history, options?)` randomly chooses an exercise while avoiding recent repeats. Supply history oldest first, including the current exercise. It returns `undefined` if no exercises are available.
- `generateExerciseInstance(exerciseId, definition, context)` generates the parameters and starting state, then returns an instance with an empty submission history. The version defaults to `1` when omitted from the definition.
- `normalizeExerciseInstance(value)` checks saved data and returns an instance, or `null` if it is invalid. Invalid drafts and individual history events are discarded.

These functions and the `ExerciseInstance` and `ExerciseEvent` types are exported from `@sqlvalley/exercise-instances`.


## Selection options

- `dontRepeatBefore` defaults to `3`: avoid exercises appearing in the last three history entries.
- `minimumChoices` defaults to `2`: shorten the repeat-avoidance window when necessary to leave at least two choices, if available.

For example, after B, D, E, F, exercise B is eligible again while D/E/F are excluded, provided the available set is large enough.
