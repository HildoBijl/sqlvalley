import type { ExerciseRegistration } from '@sqlvalley/exercise-manager'

import { buildModuleExercises } from '@/curriculum/utils/buildModuleExercises'

import aggregateMaxMinRevenue from './aggregateMaxMinRevenue'
import aggregateTotalExpenses from './aggregateTotalExpenses'
import aggregateHighestExpenses from './aggregateHighestExpenses'

export default function buildExercises(skillId: string): ExerciseRegistration[] {
	return buildModuleExercises([aggregateMaxMinRevenue, aggregateTotalExpenses, aggregateHighestExpenses], skillId)
}
