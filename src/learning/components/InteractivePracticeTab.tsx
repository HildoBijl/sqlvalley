import { type ExerciseRegistration, ExerciseManager } from '@sqlvalley/exercise-manager'

import { exerciseStorage, useAdminMode, useCurrentExerciseInstance } from '@/store'

interface InteractivePracticeTabProps {
	skillId: string
	exercises: readonly ExerciseRegistration[]
}

export function InteractivePracticeTab({ skillId, exercises }: InteractivePracticeTabProps) {
	const isAdmin = useAdminMode()
	const currentExerciseInstance = useCurrentExerciseInstance(skillId)
	return <ExerciseManager skillId={skillId} exercises={exercises} currentExerciseInstance={currentExerciseInstance} storage={exerciseStorage} showAdminControls={isAdmin} />
}
