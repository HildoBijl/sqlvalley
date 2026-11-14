import type { ExerciseRegistration } from '@sqlvalley/exercise-manager'

import { buildModuleExercises } from '@/curriculum'

import exercise0 from './expense-periods'
import exercise1 from './expense-ranges'
import exercise2 from './approval-conditions'

export default function buildExercises(skillId: string): ExerciseRegistration[] {
	return buildModuleExercises([exercise0, exercise1, exercise2], skillId)
}
