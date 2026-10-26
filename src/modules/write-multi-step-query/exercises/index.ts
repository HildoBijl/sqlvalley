import type { ExerciseRegistration } from '@sqlvalley/exercise-manager'

import { buildModuleExercises } from '@/curriculum'
import multiStepMockBuyerVendor from './multiStepMockBuyerVendor'
import multiStepMockDeptExpense from './multiStepMockDeptExpense'
import multiStepWrongEmployeeCounts from './multiStepWrongEmployeeCounts'

export default function buildExercises(skillId: string): ExerciseRegistration[] {
	return buildModuleExercises([multiStepMockDeptExpense, multiStepMockBuyerVendor, multiStepWrongEmployeeCounts], skillId)
}
