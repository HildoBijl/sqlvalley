import { useModuleContext } from '@sqlvalley/exercise-manager';
import type { DatasetSize } from '@sqlvalley/mock-data';
import type { CompareOptions, SqlQueryResult } from '@sqlvalley/sql-grading';
import type { MonoSQLCheckResult } from '../MonoSQLExercise/types';

/**
 * The SQL module's environment: the shared live-query runtime plus a grade()
 * function the exercise reducers use. Exposed as the exercise moduleContext.
 */
export interface SqlModuleContext {
	/** Standard readiness flag the ExerciseManager gates exercise generation on. */
	ready: boolean;
	tableNames: string[];
	completionSchema: Record<string, string[]>;
	queryResult: ReadonlyArray<SqlQueryResult> | undefined;
	queryError: Error | undefined;
	hasExecutedQuery: boolean;
	datasetSize: DatasetSize;
	datasetWarning: string | null;
	executeLiveQuery: (query: string) => Promise<void>;
	setDatasetSize: (size: DatasetSize) => void;
	grade: (
		query: string,
		solution: string,
		comparisonOptions?: CompareOptions,
	) => Promise<MonoSQLCheckResult>;
}

export function useSqlModuleContext(): SqlModuleContext {
	const context = useModuleContext();
	if (!context) {
		throw new Error('useSqlModuleContext must be used within a SqlModuleProvider.');
	}
	return context as SqlModuleContext;
}
