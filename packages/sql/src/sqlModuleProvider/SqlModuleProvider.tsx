import { type ReactNode, useMemo } from 'react'

import type { ModuleId, ModuleTree } from '@step-wise/module-tree-definition'
import { ModuleContextProvider } from '@sqlvalley/exercise-manager'

import { type DatabaseHandle, useDatabaseContext, useDatabase, useDatabases } from '../databaseProvider'
import { type ModuleAccess, getModuleTableKeys } from '../moduleAccess'

import type { SqlModuleContext } from './types'

/*
 * SqlModuleProvider: a ModuleProvider for SQL-based modules, which require a database for it.
 */

interface SqlModuleProviderProps {
	moduleId: ModuleId
	moduleTree: ModuleTree
	moduleAccess: ModuleAccess
	children: ReactNode
}

export function SqlModuleProvider({ moduleId, moduleTree, moduleAccess, children }: SqlModuleProviderProps) {
	const { source } = useDatabaseContext()
	const tableKeys = useMemo(() => getModuleTableKeys({ moduleId, moduleTree, moduleAccess }), [moduleId, moduleTree, moduleAccess])
	const InternalSqlModuleProvider = source.datasetSizes === undefined ? SingleDatabaseProvider : MultipleDatabaseProvider
	return <InternalSqlModuleProvider moduleId={moduleId} tableKeys={tableKeys}>{children}</InternalSqlModuleProvider>
}

/*
 * Database Provider: for the given table keys, get databases and provide them.
 */

interface DatabaseProviderProps {
	moduleId: ModuleId
	tableKeys: readonly string[]
	children: ReactNode
}

function SingleDatabaseProvider({ moduleId, tableKeys, children }: DatabaseProviderProps) {
	const userDatabase = useDatabase({ key: `module:${moduleId}:user`, tables: tableKeys })
	const gradingDatabase = useDatabase({ key: `module:${moduleId}:grading`, tables: tableKeys })
	const userDatabases = useMemo(() => new Map([[undefined, userDatabase]]), [userDatabase])
	const gradingDatabases = useMemo(() => new Map([[undefined, gradingDatabase]]), [gradingDatabase])
	return <ModuleDatabaseProvider moduleId={moduleId} tableKeys={tableKeys} userDatabases={userDatabases} gradingDatabases={gradingDatabases}>{children}</ModuleDatabaseProvider>
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
	const value = useMemo<SqlModuleContext>(() => ({
		moduleId,
		tableKeys,
		loading: [...userDatabases.values(), ...gradingDatabases.values()].some(handle => handle.loading),
		error: [...userDatabases.values(), ...gradingDatabases.values()].find(handle => handle.error)?.error,
		ready: [...userDatabases.values(), ...gradingDatabases.values()].every(handle => !!handle.database && !handle.loading && !handle.error),
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

	// Wrap the contents with a ModuleContextProvider with the respective value.
	return <ModuleContextProvider value={value}>
		{children}
	</ModuleContextProvider>
}
