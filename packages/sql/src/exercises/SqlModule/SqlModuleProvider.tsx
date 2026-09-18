import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Alert } from '@mui/material'

import { type DatasetSize, type TableKey, buildCompletionSchema } from '@sqlvalley/mock-data'
import {
	type CompareOptions,
	type SqlExecutionResult,
	type SqlQueryResult,
	normalizeSqlInput,
	validateSqlExecution,
	verifySqlExecution,
} from '@sqlvalley/sql-grading'
import { ModuleContextProvider } from '@sqlvalley/exercise-manager'

import { useDatabase, useQueryExecution } from '../../databaseProvider'
import type { MonoSQLCheckResult } from '../MonoSQLExercise/types'
import type { SqlModuleContext } from './context'

const SMALL_DATASET_WARNING =
	'You are using the small data set. This data set is meant to get a quick intuition of the data, but it does not support all exercises. Consider using the full data set to get the full real-life experience.'

interface SqlModuleProviderProps {
	tables: TableKey[]
	datasetSize: DatasetSize
	setDatasetSize: (size: DatasetSize) => void
	children: ReactNode
}

// Keep display and grading databases alive while the module remains mounted.
export function SqlModuleProvider({
	tables, datasetSize, setDatasetSize, children,
}: SqlModuleProviderProps) {
	const displayDatabase = useDatabase({ tables, size: datasetSize })
	const gradingDatabase = useDatabase({ tables, size: 'full' })
	const { execute: executeDisplayQuery, clear: clearDisplayQuery, results: queryResult, error: queryError } = useQueryExecution(displayDatabase)
	const { execute: executeGradingQuery } = useQueryExecution(gradingDatabase)
	const completionSchema = useMemo(() => buildCompletionSchema(tables), [tables])
	const tableNames = useMemo(() => Object.keys(completionSchema).sort(), [completionSchema])
	const [hasExecutedQuery, setHasExecutedQuery] = useState(false)
	const [datasetWarning, setDatasetWarning] = useState<string | null>(null)
	const [pendingDatasetRefresh, setPendingDatasetRefresh] = useState(false)
	const lastExecutedQueryRef = useRef('')
	const latestQueryKeyRef = useRef('')
	const datasetSizeRef = useRef<DatasetSize>(datasetSize)

	const dbReady = Boolean(displayDatabase.database && gradingDatabase.database)

	const evaluateSmallDatasetWarning = useCallback(async (
		query: string,
		displayOutput: ReadonlyArray<SqlQueryResult> | null | undefined,
		fullOutput?: ReadonlyArray<SqlQueryResult> | null,
	) => {
		const queryKey = normalizeSqlInput(query)
		if (!queryKey || datasetSizeRef.current !== 'small' || hasRows(displayOutput)) {
			setDatasetWarning(null)
			return
		}
		let resolvedFullOutput = fullOutput
		if (!resolvedFullOutput) {
			try {
				resolvedFullOutput = await executeGradingQuery(query)
			} catch {
				setDatasetWarning(null)
				return
			}
		}
		if (latestQueryKeyRef.current !== queryKey || datasetSizeRef.current !== 'small') return
		setDatasetWarning(hasRows(resolvedFullOutput) ? SMALL_DATASET_WARNING : null)
	}, [executeGradingQuery])

	const executeLiveQuery = useCallback(async (query: string) => {
		const trimmedQuery = query.trim()
		latestQueryKeyRef.current = normalizeSqlInput(query)
		setDatasetWarning(null)
		if (!trimmedQuery) {
			lastExecutedQueryRef.current = ''
			setHasExecutedQuery(false)
			clearDisplayQuery()
			return
		}
		lastExecutedQueryRef.current = trimmedQuery
		try {
			const output = await executeDisplayQuery(trimmedQuery)
			setHasExecutedQuery(true)
			await evaluateSmallDatasetWarning(trimmedQuery, output)
		} catch {
			setHasExecutedQuery(false)
		}
	}, [clearDisplayQuery, executeDisplayQuery, evaluateSmallDatasetWarning])

	const grade = useCallback(async (
		rawInput: string,
		solution: string,
		comparisonOptions?: CompareOptions,
	): Promise<MonoSQLCheckResult> => {
		const query = rawInput.trim()
		lastExecutedQueryRef.current = query
		latestQueryKeyRef.current = normalizeSqlInput(query)
		setHasExecutedQuery(true)

		let displayExecution: SqlExecutionResult<SqlQueryResult[]>
		try {
			displayExecution = { success: true, output: await executeDisplayQuery(query) }
		} catch (error) {
			displayExecution = { success: false, error: error instanceof Error ? error : new Error(String(error)) }
		}

		const displayOutput = displayExecution.output ?? null
		let gradingExecution: SqlExecutionResult<SqlQueryResult[]> | null = null
		let validation = validateSqlExecution(displayExecution)
		if (!validation.ok && datasetSizeRef.current === 'small' &&
			displayExecution.success && !hasRows(displayOutput)) {
			gradingExecution = await executeForGrading(query, executeGradingQuery)
			if (gradingExecution.success) validation = validateSqlExecution(gradingExecution)
		}
		if (!validation.ok) {
			await evaluateSmallDatasetWarning(query, displayOutput, gradingExecution?.output ?? null)
			return { correct: false, feedback: validation.message ?? 'Query result has invalid structure.', feedbackType: 'warning' }
		}
		if (!gradingDatabase.database) {
			return { correct: false, feedback: 'Database is not ready for verification. Please try again in a moment.', feedbackType: 'warning' }
		}

		gradingExecution ??= await executeForGrading(query, executeGradingQuery)
		if (!gradingExecution.success || !gradingExecution.output) {
			return { correct: false, feedback: gradingExecution.error?.message ?? 'Unable to verify results because the grading database query failed.', feedbackType: 'error' }
		}

		await evaluateSmallDatasetWarning(query, displayOutput, gradingExecution.output)
		const verification = verifySqlExecution({
			output: gradingExecution.output,
			solution,
			database: gradingDatabase.database,
			comparisonOptions,
		})
		return { correct: verification.correct, feedback: verification.message, feedbackType: verification.correct ? 'success' : 'error' }
	}, [executeDisplayQuery, evaluateSmallDatasetWarning, gradingDatabase.database, executeGradingQuery])

	useEffect(() => {
		datasetSizeRef.current = datasetSize
		setDatasetWarning(null)
		setHasExecutedQuery(false)
		clearDisplayQuery()
		setPendingDatasetRefresh(true)
	}, [datasetSize, clearDisplayQuery])

	useEffect(() => {
		if (!pendingDatasetRefresh || !displayDatabase.database) return
		const query = lastExecutedQueryRef.current.trim()
		if (!query) {
			setPendingDatasetRefresh(false)
			return
		}
		let active = true
		executeDisplayQuery(query)
			.then(output => {
				if (!active) return
				setHasExecutedQuery(true)
				void evaluateSmallDatasetWarning(query, output)
			})
			.catch(() => {
				if (!active) return
				setHasExecutedQuery(false)
				setDatasetWarning(null)
			})
			.finally(() => {
				if (active) setPendingDatasetRefresh(false)
			})
		return () => { active = false }
	}, [executeDisplayQuery, displayDatabase.database, evaluateSmallDatasetWarning, pendingDatasetRefresh])

	const value = useMemo<SqlModuleContext>(() => ({
		ready: dbReady,
		tableNames,
		completionSchema,
		queryResult,
		queryError,
		hasExecutedQuery,
		datasetSize,
		datasetWarning,
		executeLiveQuery,
		setDatasetSize,
		grade,
	}), [
		dbReady,
		tableNames,
		completionSchema,
		queryResult,
		queryError,
		hasExecutedQuery,
		datasetSize,
		datasetWarning,
		executeLiveQuery,
		setDatasetSize,
		grade,
	])

	const databaseError = displayDatabase.error ?? gradingDatabase.error
	if (databaseError) return <Alert severity="error">{databaseError.message}</Alert>

	return <ModuleContextProvider value={value}>{children}</ModuleContextProvider>
}

async function executeForGrading(
	query: string,
	executeQuery: (query: string) => Promise<SqlQueryResult[]>,
): Promise<SqlExecutionResult<SqlQueryResult[]>> {
	try {
		return { success: true, output: await executeQuery(query) }
	} catch (error) {
		return { success: false, error: error instanceof Error ? error : new Error(String(error)) }
	}
}

function hasRows(results?: ReadonlyArray<SqlQueryResult> | null): boolean {
	return Boolean(results?.some(result => result.values.length > 0))
}
