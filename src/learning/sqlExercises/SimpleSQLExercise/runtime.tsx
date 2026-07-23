import { createContext, useContext, type ReactNode } from 'react';

import type { DatasetSize } from '@/mockData';
import type { SqlQueryResult } from '../grading';

export interface SimpleSQLRuntimeValue {
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
}

const SimpleSQLRuntimeContext = createContext<SimpleSQLRuntimeValue | null>(null);

export function SimpleSQLRuntimeProvider({
  value,
  children,
}: {
  value: SimpleSQLRuntimeValue;
  children: ReactNode;
}) {
  return (
    <SimpleSQLRuntimeContext.Provider value={value}>
      {children}
    </SimpleSQLRuntimeContext.Provider>
  );
}

export function useSimpleSQLRuntime(): SimpleSQLRuntimeValue {
  const value = useContext(SimpleSQLRuntimeContext);
  if (!value) {
    throw new Error('useSimpleSQLRuntime must be used within SimpleSQLRuntimeProvider.');
  }
  return value;
}
