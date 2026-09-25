import type { ModuleId } from '@step-wise/module-tree-definition'
import type { Database } from '@sqlvalley/sqljs'
import type { DatabaseHandle } from '@sqlvalley/sql'

export interface SqlModuleContext {
	moduleId: ModuleId
	tableKeys: readonly string[]
	getUserDatabase: (size?: string) => Database
	getUserDatabaseHandle: (size?: string) => DatabaseHandle
	getGradingDatabase: (size?: string) => Database
	getGradingDatabaseHandle: (size?: string) => DatabaseHandle
}

export function ensureSqlModuleContext(context: unknown): SqlModuleContext {
	if (!context || typeof context !== 'object' ||
		!('moduleId' in context) || typeof context.moduleId !== 'string' ||
		!('tableKeys' in context) || !Array.isArray(context.tableKeys) ||
		!('getUserDatabase' in context) || typeof context.getUserDatabase !== 'function' ||
		!('getGradingDatabase' in context) || typeof context.getGradingDatabase !== 'function' ||
		!('getUserDatabaseHandle' in context) || typeof context.getUserDatabaseHandle !== 'function' ||
		!('getGradingDatabaseHandle' in context) || typeof context.getGradingDatabaseHandle !== 'function') {
		throw new Error('A SQL module context is required.')
	}
	return context as SqlModuleContext
}
