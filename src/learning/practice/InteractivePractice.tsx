import { type ExerciseRegistration, ExerciseManager, useModuleContext } from '@sqlvalley/exercise-manager'

import { exerciseStorage, useAdminMode, useStoryMode, useCurrentExerciseInstance } from '@/store'

interface InteractivePracticeProps {
	skillId: string
	exercises: readonly ExerciseRegistration[]
}

export function InteractivePractice({ skillId, exercises }: InteractivePracticeProps) {
	const resources = useModuleContext()
	const isAdmin = useAdminMode()
	const storyMode = useStoryMode()
	const currentExerciseInstance = useCurrentExerciseInstance(skillId)
	return <ExerciseManager resources={resources} skillId={skillId} exercises={exercises} currentExerciseInstance={currentExerciseInstance} storage={exerciseStorage} showAdminControls={isAdmin} storyMode={storyMode} />
}
