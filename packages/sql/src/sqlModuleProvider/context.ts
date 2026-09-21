import type { SqlModuleContext } from './types'

export function ensureSqlModuleContext(context: unknown): SqlModuleContext {
	if (!context || typeof context !== 'object' ||
		!('moduleId' in context) || typeof context.moduleId !== 'string' ||
		!('tableKeys' in context) || !Array.isArray(context.tableKeys) ||
		!('ready' in context) || typeof context.ready !== 'boolean' ||
		!('loading' in context) || typeof context.loading !== 'boolean' ||
		!('error' in context) || (context.error !== undefined && !(context.error instanceof Error)) ||
		!('getUserDatabase' in context) || typeof context.getUserDatabase !== 'function' ||
		!('getGradingDatabase' in context) || typeof context.getGradingDatabase !== 'function') {
		throw new Error('A SQL module context is required.')
	}
	return context as SqlModuleContext
}
