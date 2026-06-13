import type { ComponentType } from 'react';

import type { ExerciseHelpers } from '@/learning/exerciseEngine';
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

export interface SimpleSQLExerciseProps<Parameters extends Record<string, unknown>> {
  skillId: string;
  tables: TableKey[];
  definitions: ReadonlyArray<SimpleSQLExerciseDefinition<Parameters>>;
  title?: string;
  onSolved?: () => void;
}

export type SimpleSQLExerciseComponent = ComponentType<{
  skillId: string;
  title?: string;
  onSolved?: () => void;
}>;
