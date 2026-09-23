import { type ExerciseRegistration, ExerciseManager } from '@sqlvalley/exercise-manager'

import { exerciseStorage, useAdminMode, useCurrentExerciseInstance } from '@/store'
import { SqlPracticeProvider } from '@/curriculum/utils/SqlPracticeProvider'

interface InteractivePracticeTabProps {
	skillId: string
	exercises: readonly ExerciseRegistration[]
}

export function InteractivePracticeTab({ skillId, exercises }: InteractivePracticeTabProps) {
	const isAdmin = useAdminMode()
	const currentExerciseInstance = useCurrentExerciseInstance(skillId)
	return <SqlPracticeProvider>
		<ExerciseManager skillId={skillId} exercises={exercises} currentExerciseInstance={currentExerciseInstance} storage={exerciseStorage} showAdminControls={isAdmin} />
	</SqlPracticeProvider>
}
