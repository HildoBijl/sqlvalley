import type { RefObject } from 'react'

import type { ExerciseInstance, ExerciseSelectionOptions } from '@sqlvalley/exercise-instances'

import type { ExerciseRegistration } from '../../exerciseSessionContext'
import type { ExerciseStorage } from '../types'

// All info needed to set up the exercise session flags and controls.
export interface ExerciseSessionOptions {
	skillId: string
	exercises: readonly ExerciseRegistration[]
	currentExerciseInstance: ExerciseInstance | undefined
	storage: ExerciseStorage
	selectionOptions?: ExerciseSelectionOptions
}

export interface SessionOperations {
	moduleContext: unknown
	moduleReady: boolean
	activeOperation: RefObject<'generation' | 'submission' | undefined>
}
