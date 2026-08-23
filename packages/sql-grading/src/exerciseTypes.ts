export interface SqlQueryResult {
  columns: string[];
  values: unknown[][];
}

export interface SqlExecutionResult<T = SqlQueryResult[]> {
  success: boolean;
  output?: T;
  error?: Error;
}

export interface SqlValidationResult {
  ok: boolean;
  message?: string;
  code?: string;
  warnings?: string[];
}

export interface SqlVerificationResult {
  correct: boolean;
  message?: string;
  solution?: string;
}
