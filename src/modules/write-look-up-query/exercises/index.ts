import type { ExerciseRegistration } from '@sqlvalley/exercise-manager'

import { buildModuleExercises } from '@/curriculum/utils/buildModuleExercises'

import lookupManagerCity from './lookupManagerCity'
import lookupEmployeePosition from './lookupEmployeePosition'
import lookupManagerSick from './lookupManagerSick'

export default function buildExercises(skillId: string): ExerciseRegistration[] {
	return buildModuleExercises([lookupManagerCity, lookupEmployeePosition, lookupManagerSick], skillId)
}
