import { type ExerciseRegistration, type ModuleProviderComponent, ExerciseManager } from '@sqlvalley/exercise-manager'

import { exerciseStorage, useAdminMode, useCurrentExerciseInstance } from '@/store'

interface InteractivePracticeTabProps {
	skillId: string
	exercises: readonly ExerciseRegistration[]
	moduleProvider?: ModuleProviderComponent | null
}

export function InteractivePracticeTab({ skillId, exercises, moduleProvider: ModuleProvider }: InteractivePracticeTabProps) {
	const isAdmin = useAdminMode()
	const currentExerciseInstance = useCurrentExerciseInstance(skillId)
	const manager = <ExerciseManager skillId={skillId} exercises={exercises} currentExerciseInstance={currentExerciseInstance} storage={exerciseStorage} showAdminControls={isAdmin} />
	return ModuleProvider ? <ModuleProvider skillId={skillId}>{manager}</ModuleProvider> : manager
}
