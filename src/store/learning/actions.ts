import { isPlainDataObject } from '@step-wise/js-utils'
import type { ModuleType } from '@step-wise/module-tree-definition'
import type { ExerciseAction, ExerciseInstance, ExerciseReport, ExerciseState } from '@sqlvalley/exercise-instances'

import type { SetState, StateUpdate } from '../infrastructure'
import { type ConceptState, type LearningState, type SkillState, createModuleState } from './state'

export interface LearningActions {
	setModuleTab: (id: string, moduleType: ModuleType, tab: StateUpdate<string | undefined>) => void
	completeConcept: (conceptId: string) => void
	completeSkill: (skillId: string) => void
	startNewExercise: (skillId: string, exerciseInstance: ExerciseInstance) => void
	submitExerciseAction: (skillId: string, action: ExerciseAction, resultingState: ExerciseState, report: ExerciseReport | undefined, solvedSkillIds: readonly string[]) => void
	setExerciseDraftInput: (skillId: string, draftInput: StateUpdate<ExerciseInstance['draftInput']>) => void
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
		setModuleTab: (id, moduleType, update) => set(state => {
			const module = moduleType === 'skill' ? getSkillModuleForUpdate(id, state) : getConceptModuleForUpdate(id, state)
			const tab = typeof update === 'function' ? update(module.tab) : update
			return { modules: { ...state.modules, [id]: { ...module, tab, lastAccessed: Date.now() } } }
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
			if (exerciseInstance.draftInput !== undefined && !isPlainDataObject(exerciseInstance.draftInput)) throw new Error('Draft input must be a plain data object or undefined.')
			const skillModule = getSkillModuleForUpdate(skillId, state)
			return {
				modules: {
					...state.modules,
					[skillId]: { ...skillModule, lastAccessed: Date.now(), exerciseHistory: [...skillModule.exerciseHistory, exerciseInstance] },
				},
			}
		}),

		submitExerciseAction: (skillId, action, resultingState, report, solvedSkillIds) => set(state => {
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

		setExerciseDraftInput: (skillId, update) => set(state => {
			const skillModule = getSkillModuleForUpdate(skillId, state)
			if (skillModule.exerciseHistory.length === 0) throw new Error(`Cannot set draft input for "${skillId}" without an active exercise.`)

			const currentExercise = skillModule.exerciseHistory[skillModule.exerciseHistory.length - 1]
			const draftInput = typeof update === 'function' ? update(currentExercise.draftInput) : update
			if (draftInput !== undefined && !isPlainDataObject(draftInput)) throw new Error('Draft input must be a plain data object or undefined.')
			const updatedExercise: ExerciseInstance = { ...currentExercise, draftInput }
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
