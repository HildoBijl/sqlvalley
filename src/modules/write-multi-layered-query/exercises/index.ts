import type { ExerciseRegistration } from '@sqlvalley/exercise-manager'

import { buildModuleExercises } from '@/curriculum/utils/buildModuleExercises'

import multilayeredMockDeptExpense from './multilayeredMockDeptExpense'
import multilayeredMockBuyerVendor from './multilayeredMockBuyerVendor'
import multilayeredWrongEmployeeCounts from './multilayeredWrongEmployeeCounts'

export default function buildExercises(skillId: string): ExerciseRegistration[] {
	return buildModuleExercises([multilayeredMockDeptExpense, multilayeredMockBuyerVendor, multilayeredWrongEmployeeCounts], skillId)
}
