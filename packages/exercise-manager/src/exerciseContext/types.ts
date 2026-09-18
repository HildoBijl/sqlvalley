import type { ReactNode } from 'react'

import type { ExerciseAction, ExerciseParameters, ExerciseState } from '@step-wise/exercise-definition'
import type { ExerciseDefinition, ExerciseInstance, SkillId } from '@sqlvalley/exercise-instances'

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
	exerciseInstance: ExerciseInstance<Parameters, Action, State>
	pending: boolean
	controls: ExerciseControls<Action>
	skill: ExerciseSkill
}
