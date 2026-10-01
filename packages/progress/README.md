# Progress

Completion tracking and learning-path planning for a supplied module tree, independent of the application's curriculum and navigation.


## Planning

`isReadyToLearn(tree, moduleId, isModuleCompleted)` checks that a module is incomplete and its direct prerequisites are complete.

`getNextModuleId(tree, moduleId, allowedModuleIds, isModuleCompleted, goalModuleId?)` selects one ready module to study next. It prefers nearby continuations, choosing subgoals by prerequisite distance, continuation distance, skill type over concept type, missing requirements, and module-tree order. A valid goal first restricts the search to its requirements; if that produces no result, the full allowed tree is searched. A disconnected ready module is used as a final fallback, and `undefined` is returned only when no allowed module is ready. Callers should validate externally stored module IDs against their tree before supplying them.

`getGoalProgress(tree, goalId, isModuleCompleted)` returns completion counts and a ready next step along the goal's prerequisite path.
