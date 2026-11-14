import { type ExerciseInstance, selectExercise } from '@sqlvalley/exercise-instances'
import type { ExerciseRegistration } from '@sqlvalley/exercise-manager'

import { type StoryModuleId, STORY_EXERCISE_VERSION, storyExerciseId, storyModules } from './storyModules'

export function isSolvedInstance(instance: ExerciseInstance) {
	const state = instance.history[instance.history.length - 1]?.state ?? instance.initialState
	return state.solved === true
}

export function getStorySolvedCount(moduleId: StoryModuleId, history: readonly ExerciseInstance[]) {
	const required = new Set(storyModules[moduleId].keys.map(key => storyExerciseId(moduleId, key)))
	return new Set(history.filter(instance => required.has(instance.exerciseId) && instance.version === STORY_EXERCISE_VERSION && isSolvedInstance(instance)).map(instance => instance.exerciseId)).size
}

export function selectNextStoryExercise(exercises: readonly ExerciseRegistration[], history: readonly ExerciseInstance[]) {
	const solved = new Set(history.filter(instance => isSolvedInstance(instance)).map(instance => `${instance.exerciseId}|${instance.version}`))
	const unsolved = exercises.filter(exercise => !solved.has(`${exercise.exerciseId}|${exercise.definition.metadata.version ?? 1}`))
	return selectExercise(unsolved.length ? unsolved : exercises, history)
}
