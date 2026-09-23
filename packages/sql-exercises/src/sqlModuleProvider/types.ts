import type { ModuleId } from '@step-wise/module-tree-definition'
import type { DatabaseHandle } from '@sqlvalley/sql'
import type { ModuleContextStatus } from '@sqlvalley/exercise-manager'

export interface SqlModuleContext extends ModuleContextStatus {
	moduleId: ModuleId
	tableKeys: readonly string[]
	getUserDatabase: (size?: string) => DatabaseHandle
	getGradingDatabase: (size?: string) => DatabaseHandle
}
