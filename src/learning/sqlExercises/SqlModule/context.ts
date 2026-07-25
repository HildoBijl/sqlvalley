import { useModuleContext } from '@/learning/exerciseEngine';
import type { DatasetSize } from '@/mockData';
import type { CompareOptions, SqlQueryResult } from '../grading';
import type { SimpleSQLCheckResult } from '../SimpleSQLExercise/types';

/**
 * The SQL module's environment: the shared live-query runtime plus a grade()
 * function the exercise reducers use. Exposed as the exercise moduleContext.
 */
export interface SqlModuleContext {
  dbReady: boolean;
  isExecuting: boolean;
  tableNames: string[];
  completionSchema: Record<string, string[]>;
  queryResult: ReadonlyArray<SqlQueryResult> | null;
  queryError: Error | null;
  hasExecutedQuery: boolean;
  datasetSize: DatasetSize;
  datasetWarning: string | null;
  executeLiveQuery: (query: string) => Promise<void>;
  setDatasetSize: (size: DatasetSize) => void;
  grade: (
    query: string,
    solution: string,
    comparisonOptions?: CompareOptions,
  ) => Promise<SimpleSQLCheckResult>;
}

export function useSqlModuleContext(): SqlModuleContext {
  const context = useModuleContext();
  if (!context) {
    throw new Error('useSqlModuleContext must be used within a SqlModuleProvider.');
  }
  return context as SqlModuleContext;
}
