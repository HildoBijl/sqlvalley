import type { ExerciseRegistration } from '@sqlvalley/exercise-manager'

import { buildModuleExercises } from '@/curriculum/utils/buildModuleExercises'

import multiCriterionStartDateRange from './multiCriterionStartDateRange'
import multiCriterionWorkStatusActive from './multiCriterionWorkStatusActive'
import multiCriterionDepartmentsExpenditure from './multiCriterionDepartmentsExpenditure'

export default function buildExercises(skillId: string): ExerciseRegistration[] {
	return buildModuleExercises([multiCriterionStartDateRange, multiCriterionWorkStatusActive, multiCriterionDepartmentsExpenditure], skillId)
}
