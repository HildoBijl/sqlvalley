# Progress

Completion tracking and learning-path planning for a supplied module tree, independent of the application's curriculum and navigation.


## Planning

`isReadyToLearn(tree, moduleId, isModuleCompleted)` checks that a module is incomplete and its direct prerequisites are complete.

`getNextModuleIds(tree, moduleId, allowedModuleIds, isModuleCompleted, goalModuleId?)` prioritizes a ready goal, then returns ready direct continuations in the allowed set and, when applicable, the goal's prerequisite path. Completed goals no longer restrict suggestions. It returns an empty array when no suitable continuation exists. Callers should validate externally stored module IDs against their tree before supplying them.

`getGoalProgress(tree, goalId, isModuleCompleted)` returns completion counts and a ready next step along the goal's prerequisite path.
