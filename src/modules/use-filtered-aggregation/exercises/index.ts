import type { ExerciseRegistration } from '@sqlvalley/exercise-manager'

import { buildModuleExercises } from '@/curriculum'
import filteredAggregationPerfRange from './filteredAggregationPerfRange'
import filteredAggregationRejectedTx from './filteredAggregationRejectedTx'
import filteredAggregationProductRevenue from './filteredAggregationProductRevenue'

export default function buildExercises(skillId: string): ExerciseRegistration[] {
	return buildModuleExercises([filteredAggregationPerfRange, filteredAggregationRejectedTx, filteredAggregationProductRevenue], skillId)
}
