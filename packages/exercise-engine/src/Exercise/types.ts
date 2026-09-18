import type { ComponentType, ReactNode } from 'react'

import type { ExerciseAction, ExerciseParameters, ExerciseState } from '@step-wise/exercise-definition'

import type { SkillId, StoredExerciseEvent } from '../storedState'
import type { ExerciseDefinition } from './definition'

// Dynamically generated data about the current exercise.
export interface ExerciseData<
	Parameters extends ExerciseParameters,
	State extends ExerciseState,
> {
	parameters: Parameters
	state: State
	events: StoredExerciseEvent[]
	draftInput: unknown
	pending: boolean
}

// Handlers connecting the exercise to the data store, set up by the manager.
export interface ExerciseControls<Action extends ExerciseAction> {
	submitAction: (action: Action) => Promise<void>
	setDraftInput: (draftInput: unknown) => void
	startNewExercise: () => void
	adminControls?: ReactNode
}

export interface ExerciseSkill {
	id: SkillId
}

export interface ExerciseContextValue<
	Parameters extends ExerciseParameters,
	Action extends ExerciseAction,
	State extends ExerciseState,
> {
	definition: ExerciseDefinition<Parameters, Action, State>
	data: ExerciseData<Parameters, State>
	controls: ExerciseControls<Action>
	skill: ExerciseSkill
}

export interface ExerciseProps {
	Component: ComponentType
	value: ExerciseContextValue<
		ExerciseParameters,
		ExerciseAction,
		ExerciseState
	>
}
