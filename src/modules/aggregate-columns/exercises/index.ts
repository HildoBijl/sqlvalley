import type { ExerciseRegistration } from '@sqlvalley/exercise-manager'

import { buildModuleExercises } from '@/curriculum'

import exercise0 from './status-counts'
import exercise1 from './quarter-totals'
import exercise2 from './expense-statistics'

export default function buildExercises(skillId: string): ExerciseRegistration[] {
	return buildModuleExercises([exercise0, exercise1, exercise2], skillId)
}
