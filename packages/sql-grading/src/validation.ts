import { compareQueryResults } from './grading';
import type { CompareOptions } from './types';
import type {
  SqlExecutionResult,
  SqlQueryResult,
  SqlValidationResult,
  SqlVerificationResult,
} from './exerciseTypes';

export const DEFAULT_SQL_COMPARISON_OPTIONS: CompareOptions = {
  ignoreRowOrder: true,
  requireEqualColumnOrder: false,
  requireEqualColumnNames: false,
  caseSensitive: false,
};

const SQL_ERROR_PATTERNS: Array<{
  pattern: RegExp;
  format: (match: RegExpMatchArray) => string;
}> = [
  {
    pattern: /no such column:\s*("?)([^"\s]+)\1/i,
    format: (match) => `Did not recognize column "${match[2]}". Check spelling or table schema.`,
  },
  {
    pattern: /no such table:\s*("?)([^"\s]+)\1/i,
    format: (match) => `Did not recognize table "${match[2]}".`,
  },
  {
    pattern: /no such function:\s*("?)([^"\s]+)\1/i,
    format: (match) => `Did not recognize function "${match[2]}".`,
  },
  {
    pattern: /ambiguous column name:\s*("?)([^"\s]+)\1/i,
    format: (match) =>
      `Column name "${match[2]}" is ambiguous (appears in more than one table).`,
  },
  {
    pattern: /table\s+("?)([^"\s]+)\1\s+has no column named\s+("?)([^"\s]+)\3/i,
    format: (match) => `Table "${match[2]}" has no column named "${match[4]}".`,
  },
  {
    pattern: /misuse of aggregate(?: function)?:\s*([A-Za-z0-9_]+)\s*\(?/i,
    format: (match) => `Misuse of aggregate function "${match[1]}".`,
  },
  {
    pattern: /near\s+"([^"]+)":\s*syntax error/i,
    format: (match) => `Syntax error near "${match[1]}".`,
  },
  {
    pattern: /incomplete input/i,
    format: () => 'Syntax error: incomplete input.',
  },
];

export function normalizeSqlInput(value: string): string {
  return value.toLowerCase().replace(/\s+/g, ' ').trim().replace(/;$/, '');
}

export function validateSqlInput(query: string): SqlValidationResult {
  if (!query.trim()) {
    return {
      ok: false,
      message: 'Please enter a valid SQL SELECT query so we can check it.',
    };
  }
  if (!/\b(select|with)\b/i.test(query)) {
    return {
      ok: false,
      message: 'Start with a SELECT (or WITH) clause so we can understand the query.',
    };
  }
  return { ok: true };
}

export function formatSqlErrorMessage(rawMessage: string): string {
  const message = rawMessage.replace(/\s+/g, ' ').trim();
  if (!message) {
    return 'SQL error: Unknown error.';
  }

  for (const { pattern, format } of SQL_ERROR_PATTERNS) {
    const match = message.match(pattern);
    if (match) {
      return formatSentence(format(match));
    }
  }

  if (/syntax error/i.test(message)) {
    return 'Syntax error.';
  }

  return formatSentence(`SQL error: ${message}`);
}

export function validateSqlExecution(
  result: SqlExecutionResult<SqlQueryResult[]>,
): SqlValidationResult {
  if (!result.success) {
    return {
      ok: false,
      message: formatSqlErrorMessage(result.error?.message || 'Unknown error'),
    };
  }

  const firstResult = result.output?.[0];
  if (!isSqlQueryResult(firstResult)) {
    return {
      ok: false,
      message: 'Your output seems to be empty. Some records were expected here, so something has gone wrong.',
    };
  }

  return { ok: true };
}

export function verifySqlExecution(args: {
  output: SqlQueryResult[] | undefined;
  solution: string;
  database: unknown;
  comparisonOptions?: CompareOptions;
}): SqlVerificationResult {
  const actualResult = args.output?.[0];
  if (!isSqlQueryResult(actualResult)) {
    return {
      correct: false,
      message: 'Your output seems to be empty. Some records were expected here, so something has gone wrong.',
    };
  }
  if (!isSqlDatabase(args.database)) {
    return { correct: false, message: 'Unable to verify results. Please try again.' };
  }

  try {
    const expectedResult = args.database.exec(args.solution)?.[0];
    const comparison = compareQueryResults(actualResult, expectedResult, {
      ...DEFAULT_SQL_COMPARISON_OPTIONS,
      ...(args.comparisonOptions ?? {}),
    });
    return {
      correct: comparison.match,
      message: comparison.match
        ? 'Correct!'
        : comparison.feedback || 'The query result does not match the expected output.',
    };
  } catch {
    return { correct: false, message: 'Unable to verify results. Please try again.' };
  }
}

function formatSentence(value: string): string {
  let text = value.trim();
  if (!text) return text;
  const firstChar = text[0];
  if (firstChar === firstChar.toLowerCase()) {
    text = firstChar.toUpperCase() + text.slice(1);
  }
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

function isSqlQueryResult(value: unknown): value is SqlQueryResult {
  if (!value || typeof value !== 'object') return false;
  const result = value as Partial<SqlQueryResult>;
  return Array.isArray(result.columns) && Array.isArray(result.values);
}

function isSqlDatabase(value: unknown): value is { exec: (query: string) => SqlQueryResult[] } {
  return !!value && typeof value === 'object' &&
    typeof (value as { exec?: unknown }).exec === 'function';
}
