import type { ExerciseRegistration } from '@sqlvalley/exercise-manager'

import { buildModuleExercises } from '@/curriculum/utils/buildModuleExercises'

import unknownBudget from './unknownBudget'
import largeEarners from './largeEarners'
import toughPositions from './toughPositions'

export default function buildExercises(skillId: string): ExerciseRegistration[] {
	return buildModuleExercises([unknownBudget, largeEarners, toughPositions], skillId)
}
