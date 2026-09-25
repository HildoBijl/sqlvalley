import type { ReactNode } from 'react'

import { SqlModuleProvider as SqlModuleEnvironment } from '@sqlvalley/sql-exercises'

import { moduleTree } from '../moduleDefinition'
import { tablesIntroducedByModule } from '../tableIntroductions'

export function SqlModuleProvider({ moduleId, children }: { moduleId: string; children: ReactNode }) {
	return <SqlModuleEnvironment moduleId={moduleId} moduleTree={moduleTree} tablesIntroducedByModule={tablesIntroducedByModule}>
		{children}
	</SqlModuleEnvironment>
}
