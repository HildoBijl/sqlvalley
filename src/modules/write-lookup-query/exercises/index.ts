import type { ExerciseRegistration } from '@sqlvalley/exercise-manager'

import { buildModuleExercises } from '@/curriculum'

import exercise0 from './requesters'
import exercise1 from './cost-centres'
import exercise2 from './approvers'

export default function buildExercises(skillId: string): ExerciseRegistration[] {
	return buildModuleExercises([exercise0, exercise1, exercise2], skillId)
}
