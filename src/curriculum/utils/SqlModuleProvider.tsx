import type { ReactNode } from 'react'

import { SqlModuleProvider as SqlModuleEnvironment } from '@sqlvalley/sql'

import { moduleTree } from '../moduleDefinition'
import { moduleAccess } from '../moduleTableAccess'

export function SqlModuleProvider({ moduleId, children }: { moduleId: string; children: ReactNode }) {
	return <SqlModuleEnvironment moduleId={moduleId} moduleTree={moduleTree} moduleAccess={moduleAccess}>
		{children}
	</SqlModuleEnvironment>
}
