import { type ReactNode, useMemo } from 'react'

import { buildCompletionSchema } from '@sqlvalley/mock-data'
import { SqlModuleProvider, SqlPracticeProvider as SqlPracticeEnvironment } from '@sqlvalley/sql'

import { useSettingsStore } from '@/store'
import { moduleTree } from '../moduleDefinition'
import { getModuleTableKeys, moduleAccess } from './moduleAccess'

// Supply curriculum configuration and application preferences to SQL practice.
export function SqlPracticeProvider({ skillId, children }: { skillId: string; children: ReactNode }) {
	const datasetSize = useSettingsStore(state => state.practiceDatasetSize)
	const setDatasetSize = useSettingsStore(state => state.setPracticeDatasetSize)
	const completionSchema = useMemo(() => buildCompletionSchema(getModuleTableKeys(skillId)), [skillId])

	return <SqlModuleProvider moduleId={skillId} moduleTree={moduleTree} moduleAccess={moduleAccess}>
		<SqlPracticeEnvironment datasetSize={datasetSize} setDatasetSize={setDatasetSize} completionSchema={completionSchema}>
			{children}
		</SqlPracticeEnvironment>
	</SqlModuleProvider>
}
