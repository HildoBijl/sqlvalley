import type { StoredExerciseAction, StoredExerciseInstance, StoredExerciseState } from '@sqlvalley/exercise-engine/storedState'

import type { SetState } from '../infrastructure'
import type { ConceptModuleState, LearningState, ModuleType, SkillModuleState } from './state'
import { normalizeConceptModuleState, normalizeSkillModuleState } from './normalization'

export interface LearningActions {
	setModuleTab: (id: string, type: ModuleType, tab: string) => void
	completeConcept: (conceptId: string) => void
	completeSkill: (skillId: string) => void
	startNewExercise: (skillId: string, exerciseId: string, version: number, parameters: Record<string, unknown>) => void
	submitExerciseAction: (skillId: string, action: StoredExerciseAction, resultingState: StoredExerciseState, report: unknown, exerciseDone: boolean, increaseSolvedCounter: boolean) => void
	setExerciseDraftInput: (skillId: string, draftInput: unknown) => void
}

function getConceptModuleForUpdate(moduleId: string, state: LearningState): ConceptModuleState {
	return normalizeConceptModuleState(moduleId, state.modules[moduleId])
}

function getSkillModuleForUpdate(moduleId: string, state: LearningState): SkillModuleState {
	return normalizeSkillModuleState(moduleId, state.modules[moduleId])
}

export function createLearningActions(set: SetState<LearningState>): LearningActions {
	return {
		setModuleTab: (id, type, tab) => set(state => {
			const now = Date.now()
			const nextState = type === 'skill'
				? { ...getSkillModuleForUpdate(id, state), tab, lastAccessed: now, }
				: { ...getConceptModuleForUpdate(id, state), tab, lastAccessed: now }
			return { modules: { ...state.modules, [id]: nextState } }
		}),

		completeConcept: conceptId => set(state => {
			const currentConcept = getConceptModuleForUpdate(conceptId, state)
			return {
				modules: {
					...state.modules,
					[conceptId]: { ...currentConcept, understood: true, lastAccessed: Date.now() },
				},
			}
		}),

		completeSkill: skillId => set(state => {
			const currentSkill = getSkillModuleForUpdate(skillId, state)
			return {
				modules: {
					...state.modules,
					[skillId]: { ...currentSkill, understood: true, lastAccessed: Date.now() },
				},
			}
		}),

		startNewExercise: (skillId, exerciseId, version, parameters) => set(state => {
			const skillModule = getSkillModuleForUpdate(skillId, state)
			const newExercise: StoredExerciseInstance = {
				exerciseId,
				version,
				parameters: { ...parameters },
				createdAt: Date.now(),
				events: [],
				draftInput: undefined,
			}
			return {
				modules: {
					...state.modules,
					[skillId]: { ...skillModule, lastAccessed: Date.now(), exerciseHistory: [...skillModule.exerciseHistory, newExercise] },
				},
			}
		}),

		submitExerciseAction: (skillId, action, resultingState, report, exerciseDone, increaseSolvedCounter) => set(state => {
			const skillModule = getSkillModuleForUpdate(skillId, state)
			if (skillModule.exerciseHistory.length === 0) throw new Error(`Cannot submit exercise action for "${skillId}" without an active exercise.`)

			const lastIndex = skillModule.exerciseHistory.length - 1
			const currentExercise = skillModule.exerciseHistory[lastIndex]
			const updatedExercise: StoredExerciseInstance = {
				...currentExercise,
				events: [
					...currentExercise.events,
					{
						timestamp: Date.now(),
						action: { ...action },
						resultingState: { ...resultingState },
						report,
					},
				],
				draftInput: exerciseDone ? undefined : currentExercise.draftInput,
			}

			const exerciseHistory = [...skillModule.exerciseHistory.slice(0, -1), updatedExercise]
			return {
				modules: {
					...state.modules,
					[skillId]: {
						...skillModule,
						lastAccessed: Date.now(),
						solvedExerciseCount: increaseSolvedCounter ? skillModule.solvedExerciseCount + 1 : skillModule.solvedExerciseCount,
						exerciseHistory,
					},
				},
			}
		}),

		setExerciseDraftInput: (skillId, draftInput) => set(state => {
			const skillModule = getSkillModuleForUpdate(skillId, state)
			if (skillModule.exerciseHistory.length === 0) throw new Error(`Cannot set draft input for "${skillId}" without an active exercise.`)

			const updatedExercise: StoredExerciseInstance = { ...skillModule.exerciseHistory[skillModule.exerciseHistory.length - 1], draftInput }
			const exerciseHistory = [...skillModule.exerciseHistory.slice(0, -1), updatedExercise]
			return {
				modules: {
					...state.modules,
					[skillId]: { ...skillModule, lastAccessed: Date.now(), exerciseHistory },
				},
			}
		}),
	}
}
