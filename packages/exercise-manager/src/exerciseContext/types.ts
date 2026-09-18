import type { ReactNode } from 'react'

import type { SkillId } from '@step-wise/module-tree-definition'
import type { ExerciseAction, ExerciseParameters, ExerciseState } from '@step-wise/exercise-definition'
import type { InputExerciseRawInput } from '@step-wise/input-exercises'
import type { ExerciseInstance } from '@sqlvalley/exercise-instances'

import type { ExerciseRegistration } from './definition'

// Handlers connecting the exercise to the data store, set up by the manager.
export interface ExerciseControls<Action extends ExerciseAction> {
	submitAction: (action: Action) => Promise<void>
	setDraftInput: (draftInput: InputExerciseRawInput | undefined) => void
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
	definition: ExerciseRegistration<Parameters, Action, State>['definition']
	exerciseInstance: ExerciseInstance<Parameters, Action, State>
	pending: boolean
	controls: ExerciseControls<Action>
	skill: ExerciseSkill
}
