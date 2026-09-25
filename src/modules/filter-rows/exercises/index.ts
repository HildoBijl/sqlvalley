import type { ExerciseRegistration } from '@sqlvalley/exercise-manager'

import { buildModuleExercises } from '@/curriculum/utils/buildModuleExercises'

import filterRowsLtAmount from './filterRowsLtAmount'
import filterRowsEqualDate from './filterRowsEqualDate'
import filterRowsStringLike from './filterRowsStringLike'
import filterRowsGtDate from './filterRowsGtDate'

export default function buildExercises(skillId: string): ExerciseRegistration[] {
	return buildModuleExercises([filterRowsLtAmount, filterRowsEqualDate, filterRowsStringLike, filterRowsGtDate], skillId)
}
