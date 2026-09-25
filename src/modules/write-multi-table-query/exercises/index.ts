import type { ExerciseRegistration } from '@sqlvalley/exercise-manager'

import { buildModuleExercises } from '@/curriculum/utils/buildModuleExercises'

import multitableMockJoinLe from './multitableMockJoinLe'
import multitableMockInNotin from './multitableMockInNotin'
import multitableMockIntersect from './multitableMockIntersect'
import multitableUniversalQuery from './multitableUniversalQuery'

export default function buildExercises(skillId: string): ExerciseRegistration[] {
	return buildModuleExercises([multitableMockJoinLe, multitableMockInNotin, multitableMockIntersect, multitableUniversalQuery], skillId)
}
