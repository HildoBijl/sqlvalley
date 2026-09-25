import type { ModuleId } from '@step-wise/module-tree-definition'
import type { DatabaseHandle } from '@sqlvalley/sql'

export interface SqlModuleContext {
	moduleId: ModuleId
	tableKeys: readonly string[]
	getUserDatabase: (size?: string) => DatabaseHandle
	getGradingDatabase: (size?: string) => DatabaseHandle
}

export function ensureSqlModuleContext(context: unknown): SqlModuleContext {
	if (!context || typeof context !== 'object' ||
		!('moduleId' in context) || typeof context.moduleId !== 'string' ||
		!('tableKeys' in context) || !Array.isArray(context.tableKeys) ||
		!('getUserDatabase' in context) || typeof context.getUserDatabase !== 'function' ||
		!('getGradingDatabase' in context) || typeof context.getGradingDatabase !== 'function') {
		throw new Error('A SQL module context is required.')
	}
	return context as SqlModuleContext
}
