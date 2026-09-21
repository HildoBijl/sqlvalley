import type { ModuleId } from '@step-wise/module-tree-definition'

import type { DatabaseHandle } from '../databaseProvider'

export interface SqlModuleContext {
	moduleId: ModuleId
	tableKeys: readonly string[]
	loading: boolean
	error: Error | undefined
	ready: boolean
	getUserDatabase: (size?: string) => DatabaseHandle
	getGradingDatabase: (size?: string) => DatabaseHandle
}
