import type { ModuleType } from '@step-wise/module-tree-definition'
import type { ExerciseAction, ExerciseInstance, ExerciseReport, ExerciseState } from '@sqlvalley/exercise-instances'

import type { SetState } from '../infrastructure'
import { type ConceptState, type LearningState, type SkillState, createModuleState } from './state'

export interface LearningActions {
	setModuleTab: (id: string, moduleType: ModuleType, tab: string) => void
	completeConcept: (conceptId: string) => void
	completeSkill: (skillId: string) => void
	startNewExercise: (skillId: string, exerciseInstance: ExerciseInstance) => void
	submitExerciseAction: (skillId: string, action: ExerciseAction, resultingState: ExerciseState, report: ExerciseReport | undefined, exerciseDone: boolean, solvedSkillIds: readonly string[]) => void
	setExerciseDraftInput: (skillId: string, draftInput: ExerciseInstance['draftInput']) => void
}

function getConceptModuleForUpdate(moduleId: string, state: LearningState): ConceptState {
	const module = state.modules[moduleId]
	return module?.moduleType === 'concept' ? module : createModuleState(moduleId, 'concept')
}

function getSkillModuleForUpdate(moduleId: string, state: LearningState): SkillState {
	const module = state.modules[moduleId]
	return module?.moduleType === 'skill' ? module : createModuleState(moduleId, 'skill')
}

export function createLearningActions(set: SetState<LearningState>): LearningActions {
	return {
		setModuleTab: (id, moduleType, tab) => set(state => {
			const now = Date.now()
			const nextState = moduleType === 'skill'
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

		startNewExercise: (skillId, exerciseInstance) => set(state => {
			const skillModule = getSkillModuleForUpdate(skillId, state)
			return {
				modules: {
					...state.modules,
					[skillId]: { ...skillModule, lastAccessed: Date.now(), exerciseHistory: [...skillModule.exerciseHistory, exerciseInstance] },
				},
			}
		}),

		submitExerciseAction: (skillId, action, resultingState, report, exerciseDone, solvedSkillIds) => set(state => {
			const skillModule = getSkillModuleForUpdate(skillId, state)
			if (skillModule.exerciseHistory.length === 0) throw new Error(`Cannot submit exercise action for "${skillId}" without an active exercise.`)

			const lastIndex = skillModule.exerciseHistory.length - 1
			const currentExercise = skillModule.exerciseHistory[lastIndex]
			const updatedExercise: ExerciseInstance = {
				...currentExercise,
				history: [
					...currentExercise.history,
					{
						submittedAt: Date.now(),
						action: { ...action },
						state: { ...resultingState },
						report,
					},
				],
				draftInput: exerciseDone ? undefined : currentExercise.draftInput,
			}

			const exerciseHistory = [...skillModule.exerciseHistory.slice(0, -1), updatedExercise]
			const modules = {
				...state.modules,
				[skillId]: { ...skillModule, lastAccessed: Date.now(), exerciseHistory },
			}
			for (const solvedSkillId of solvedSkillIds) {
				const module = getSkillModuleForUpdate(solvedSkillId, { ...state, modules })
				modules[solvedSkillId] = { ...module, solvedExerciseCount: module.solvedExerciseCount + 1 }
			}
			return { modules }
		}),

		setExerciseDraftInput: (skillId, draftInput) => set(state => {
			const skillModule = getSkillModuleForUpdate(skillId, state)
			if (skillModule.exerciseHistory.length === 0) throw new Error(`Cannot set draft input for "${skillId}" without an active exercise.`)

			const updatedExercise: ExerciseInstance = { ...skillModule.exerciseHistory[skillModule.exerciseHistory.length - 1], draftInput }
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
