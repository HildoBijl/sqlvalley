# SQL learning components

SQL module context, editors, results, and solo mono exercise integration.


## Exercise authoring

Pass a MonoSQLExerciseSpec to buildMonoSQLExercise to build a logical solo definition using @step-wise/input-exercises. Pass the specification to createMonoSQLExercise to pair that definition with the MonoExercise renderer and return an ExerciseRegistration for the exercise manager.

SQL submissions and saved drafts use a query field containing { type: 'SQL', value: query }. Editor values remain strings and are converted at the renderer boundary. SQL validation and grading produce persisted feedback reports. The upstream reducer owns attempted, solved, givenUp, and done state transitions.

The application learning-store v8 to v9 migration converts existing SQL submissions, string drafts, and give-up actions, preserving reports, draft contents, progress, and timestamps.
