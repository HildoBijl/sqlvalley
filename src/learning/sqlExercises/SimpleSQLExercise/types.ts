import type {
  ExerciseHelpers,
  SimpleExerciseCheckResult,
  SimpleExerciseFeedbackType,
} from '@/learning/exerciseEngine';
import type { TableKey } from '@/mockData';
import type { CompareOptions } from '../grading';

export interface SimpleSQLExerciseDefinition<Parameters extends Record<string, unknown>> {
  exerciseId: string;
  version: number;
  generateParameters: (
    helpers: ExerciseHelpers,
    context?: { previousParameters?: Parameters | null },
  ) => Parameters;
  problem: string | ((parameters: Parameters) => string);
  solution: string | ((parameters: Parameters) => string);
  label?: string;
  comparisonOptions?: CompareOptions;
}

export interface SimpleSQLCheckResult extends SimpleExerciseCheckResult {
  feedbackType: SimpleExerciseFeedbackType;
}

/** A single SQL exercise plus the per-skill data (tables, title) buildSimpleSQLExercise needs. */
export interface SimpleSQLExerciseSpec<Parameters extends Record<string, unknown>>
  extends SimpleSQLExerciseDefinition<Parameters> {
  tables: TableKey[];
  title?: string;
}
