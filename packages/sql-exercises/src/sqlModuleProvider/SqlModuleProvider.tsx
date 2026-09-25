import { type ReactNode, useMemo } from 'react'

import type { ModuleId, ModuleTree } from '@step-wise/module-tree-definition'
import { type DatabaseHandle, useDatabaseContext, useDatabases } from '@sqlvalley/sql'
import { type ExerciseResources, ModuleContextProvider } from '@sqlvalley/exercise-manager'

import { sqlDatasetSizes } from '../datasetSizes'
import { type TablesIntroducedByModule, getAvailableTableKeys } from '../tableIntroductions'

import type { SqlModuleContext } from './types'

/*
 * SqlModuleProvider: a ModuleProvider for SQL-based modules, which require a database for it.
 */

interface SqlModuleProviderProps {
	moduleId: ModuleId
	moduleTree: ModuleTree
	tablesIntroducedByModule: TablesIntroducedByModule
	children: ReactNode
}

export function SqlModuleProvider({ moduleId, moduleTree, tablesIntroducedByModule, children }: SqlModuleProviderProps) {
	const { source } = useDatabaseContext()
	const tableKeys = useMemo(() => getAvailableTableKeys({ moduleId, moduleTree, tablesIntroducedByModule }), [moduleId, moduleTree, tablesIntroducedByModule])
	if (!Object.values(sqlDatasetSizes).every(size => source.datasetSizes?.includes(size))) throw new Error('SqlModuleProvider requires a database source with both small and full dataset sizes.')
	return <MultipleDatabaseProvider moduleId={moduleId} tableKeys={tableKeys}>{children}</MultipleDatabaseProvider>
}

/*
 * Database Provider: for the given table keys, get databases and provide them.
 */

interface DatabaseProviderProps {
	moduleId: ModuleId
	tableKeys: readonly string[]
	children: ReactNode
}

function MultipleDatabaseProvider({ moduleId, tableKeys, children }: DatabaseProviderProps) {
	const userDatabases = useDatabases({ key: `module:${moduleId}:user`, tables: tableKeys })
	const gradingDatabases = useDatabases({ key: `module:${moduleId}:grading`, tables: tableKeys })
	return <ModuleDatabaseProvider moduleId={moduleId} tableKeys={tableKeys} userDatabases={userDatabases} gradingDatabases={gradingDatabases}>{children}</ModuleDatabaseProvider>
}

/*
 * ModuleDatabaseProvider: for the given databases, wrap them in the ModuleContextProvider.
 */

interface ModuleDatabaseProviderProps extends DatabaseProviderProps {
	userDatabases: ReadonlyMap<string | undefined, DatabaseHandle>
	gradingDatabases: ReadonlyMap<string | undefined, DatabaseHandle>
}

function ModuleDatabaseProvider({ moduleId, tableKeys, userDatabases, gradingDatabases, children }: ModuleDatabaseProviderProps) {
	// Set up the ModuleContext value.
	const context = useMemo<SqlModuleContext>(() => ({
		moduleId,
		tableKeys,
		getUserDatabase: size => {
			const handle = userDatabases.get(size)
			if (!handle) throw new Error(`No user database is available for size "${size}".`)
			return handle
		},
		getGradingDatabase: size => {
			const handle = gradingDatabases.get(size)
			if (!handle) throw new Error(`No grading database is available for size "${size}".`)
			return handle
		},
	}), [moduleId, tableKeys, userDatabases, gradingDatabases])

	const resources = useMemo<ExerciseResources<SqlModuleContext>>(() => {
		const handles = [...userDatabases.values(), ...gradingDatabases.values()]
		const loading = handles.some(handle => handle.loading)
		const error = handles.find(handle => handle.error)?.error
		if (loading) return { loading: true, error, context }
		if (error) return { loading: false, error, context }
		return { loading: false, context }
	}, [context, userDatabases, gradingDatabases])

	// Wrap the contents with a ModuleContextProvider with the respective value.
	return <ModuleContextProvider value={resources}>
		{children}
	</ModuleContextProvider>
}
