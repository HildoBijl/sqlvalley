import type { ExerciseRegistration } from '@sqlvalley/exercise-manager'

import { buildModuleExercises } from '@/curriculum'

import exercise0 from './contacts'
import exercise1 from './leave-fields'
import exercise2 from './cities'

export default function buildExercises(skillId: string): ExerciseRegistration[] {
	return buildModuleExercises([exercise0, exercise1, exercise2], skillId)
}
