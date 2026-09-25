import type { ExerciseRegistration } from '@sqlvalley/exercise-manager'

import { buildModuleExercises } from '@/curriculum/utils/buildModuleExercises'

import joinManagersHireDate from './joinManagersHireDate'
import joinEmployeePositions from './joinEmployeePositions'
import joinEmployeeLeave from './joinEmployeeLeave'

export default function buildExercises(skillId: string): ExerciseRegistration[] {
	return buildModuleExercises([joinManagersHireDate, joinEmployeePositions, joinEmployeeLeave], skillId)
}
