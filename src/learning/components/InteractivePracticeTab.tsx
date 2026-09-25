import { type ExerciseRegistration, ExerciseManager, useModuleContext } from '@sqlvalley/exercise-manager'

import { exerciseStorage, useAdminMode, useCurrentExerciseInstance } from '@/store'

interface InteractivePracticeTabProps {
	skillId: string
	exercises: readonly ExerciseRegistration[]
}

export function InteractivePracticeTab({ skillId, exercises }: InteractivePracticeTabProps) {
	const resources = useModuleContext()
	const isAdmin = useAdminMode()
	const currentExerciseInstance = useCurrentExerciseInstance(skillId)
	return <ExerciseManager resources={resources} skillId={skillId} exercises={exercises} currentExerciseInstance={currentExerciseInstance} storage={exerciseStorage} showAdminControls={isAdmin} />
}
