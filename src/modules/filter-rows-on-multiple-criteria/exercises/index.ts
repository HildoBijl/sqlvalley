import type { ExerciseRegistration } from '@sqlvalley/exercise-manager'

import { buildModuleExercises } from '@/curriculum/utils/buildModuleExercises'

import multiFilterEmployeesBetween from './multiFilterEmployeesBetween'
import multiFilterOnLeave from './multiFilterOnLeave'
import multiFilterPhoneArea from './multiFilterPhoneArea'

export default function buildExercises(skillId: string): ExerciseRegistration[] {
	return buildModuleExercises([multiFilterEmployeesBetween, multiFilterOnLeave, multiFilterPhoneArea], skillId)
}
