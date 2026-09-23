import { type ReactNode } from 'react'

import { SqlPracticeProvider as SqlPracticeEnvironment } from '@sqlvalley/sql'

import { useSettingsStore } from '@/store'

// Supply curriculum configuration and application preferences to SQL practice.
export function SqlPracticeProvider({ children }: { children: ReactNode }) {
	const datasetSize = useSettingsStore(state => state.practiceDatasetSize)
	const setDatasetSize = useSettingsStore(state => state.setPracticeDatasetSize)

	return <SqlPracticeEnvironment datasetSize={datasetSize} setDatasetSize={setDatasetSize}>
		{children}
	</SqlPracticeEnvironment>
}
