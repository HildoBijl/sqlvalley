import type { ExerciseRegistration } from '@sqlvalley/exercise-manager'

import { buildModuleExercises } from '@/curriculum'
import processPayRatio from './processPayRatio'
import processBudgetPerEmployee from './processBudgetPerEmployee'
import processDateFlag from './processDateFlag'

export default function buildExercises(skillId: string): ExerciseRegistration[] {
	return buildModuleExercises([processPayRatio, processBudgetPerEmployee, processDateFlag], skillId)
}
