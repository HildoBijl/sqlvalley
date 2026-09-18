import { type ExerciseRegistration, type ModuleProviderComponent, ExerciseManager } from '@sqlvalley/exercise-manager'

import { exerciseStorage, useAdminMode } from '@/store'

interface InteractivePracticeTabProps {
	skillId: string
	exercises: readonly ExerciseRegistration[]
	moduleProvider?: ModuleProviderComponent | null
}

export function InteractivePracticeTab({ skillId, exercises, moduleProvider: ModuleProvider }: InteractivePracticeTabProps) {
	const isAdmin = useAdminMode()
	const manager = <ExerciseManager skillId={skillId} exercises={exercises} storage={exerciseStorage} showAdminControls={isAdmin} />
	return ModuleProvider ? <ModuleProvider skillId={skillId}>{manager}</ModuleProvider> : manager
}
