import type { ExerciseRegistration } from '@sqlvalley/exercise-manager'

import { buildModuleExercises } from '@/curriculum'

import exercise0 from './salary-extract'
import exercise1 from './leave-extract'
import exercise2 from './travel-extract'

export default function buildExercises(skillId: string): ExerciseRegistration[] {
	return buildModuleExercises([exercise0, exercise1, exercise2], skillId)
}
