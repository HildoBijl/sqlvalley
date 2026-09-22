import { useExerciseSessionContext, useModuleContext } from '@sqlvalley/exercise-manager'

import { useInputExerciseContext } from './hooks'
import { isInputEmpty } from './validation'

export function useInputExerciseAvailability() {
	const { submitting } = useExerciseSessionContext()
	const moduleContext = useModuleContext()
	const { input } = useInputExerciseContext()
	const canGiveUp = !submitting && !moduleContext?.loading && !moduleContext?.error
	return { canGiveUp, canSubmit: canGiveUp && !isInputEmpty(input) }
}
