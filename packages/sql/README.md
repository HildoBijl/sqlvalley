# SQL learning components

SQL module context, editors, results, and solo mono exercise integration.


## Exercise authoring

Pass a MonoSQLExerciseSpec to buildMonoSQLExercise to build a logical solo definition using @step-wise/input-exercises. Pass the specification to createMonoSQLExercise to pair that definition with the MonoExercise renderer and return an ExerciseRegistration for the exercise manager.

SQL submissions use a query field containing { type: 'SQL', value: query }. Drafts and editor values remain strings. SQL validation and grading produce persisted feedback reports. The upstream reducer owns attempted, solved, givenUp, and done state transitions.

The application learning-store v8 to v9 migration converts existing SQL submissions and give-up actions, preserving reports, drafts, progress, and timestamps.
