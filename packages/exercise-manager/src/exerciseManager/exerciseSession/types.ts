import type { RefObject } from 'react'

import type { ExerciseInstance, ExerciseSelectionOptions } from '@sqlvalley/exercise-instances'

import type { ExerciseRegistration } from '../../exerciseSessionContext'
import type { ModuleContextStatus } from '../../moduleContext'
import type { ExerciseStorage } from '../types'

// All info needed to set up the exercise session flags and controls.
export interface ExerciseSessionOptions {
	skillId: string
	exercises: readonly ExerciseRegistration[]
	currentExerciseInstance: ExerciseInstance | undefined
	storage: ExerciseStorage
	selectionOptions?: ExerciseSelectionOptions
}

// Bundle some dependencies that are needed for exercise session set-up.
export interface ExerciseSessionDependencies {
	moduleContext: ModuleContextStatus | undefined
	moduleReady: boolean
	activeOperation: RefObject<'generation' | 'submission' | undefined>
}
