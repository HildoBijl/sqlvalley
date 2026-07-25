import type { ExerciseId, ExerciseVersion } from '@/store';
import type { SimpleExerciseCheckResult, SimpleExerciseFeedbackType } from '@/learning/exerciseEngine';
import type { CompareOptions } from '../grading';

export interface SimpleSQLExerciseDefinition<Parameters extends Record<string, unknown>> {
  exerciseId: ExerciseId;
  version: ExerciseVersion;
  generateParameters: (
    moduleContext: unknown,
    context?: { previousParameters?: Parameters | null },
  ) => Parameters;
  problem: string | ((parameters: Parameters) => string);
  solution: string | ((parameters: Parameters) => string);
  comparisonOptions?: CompareOptions;
}

export interface SimpleSQLCheckResult extends SimpleExerciseCheckResult {
  feedbackType: SimpleExerciseFeedbackType;
}

/** A SQL exercise definition plus a display title. Tables live on the SqlModuleProvider. */
export interface SimpleSQLExerciseSpec<Parameters extends Record<string, unknown>>
  extends SimpleSQLExerciseDefinition<Parameters> {
  title?: string;
}
