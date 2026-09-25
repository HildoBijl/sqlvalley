import type { ExerciseRegistration } from '@sqlvalley/exercise-manager'

import { buildModuleExercises } from '@/curriculum/utils/buildModuleExercises'

import sortByPerfSalary from './sortByPerfSalary'
import sortDeptBudgetSkip from './sortDeptBudgetSkip'
import sortEndDateNullLast from './sortEndDateNullLast'

export default function buildExercises(skillId: string): ExerciseRegistration[] {
	return buildModuleExercises([sortByPerfSalary, sortDeptBudgetSkip, sortEndDateNullLast], skillId)
}
