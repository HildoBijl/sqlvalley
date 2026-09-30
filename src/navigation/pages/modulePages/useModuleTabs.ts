import { type SyntheticEvent, useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

import type { ModuleType } from '@step-wise/module-tree-definition'

import { useLearningStore, useModuleState } from '@/store'
import type { TabConfig } from '@/learning'

export function useModuleTabs(moduleId: string, moduleType: ModuleType, tabs: TabConfig[], defaultTab = 'theory') {
	const moduleState = useModuleState(moduleId, moduleType)
	const setModuleTab = useLearningStore(state => state.setModuleTab)
	const [searchParams, setSearchParams] = useSearchParams()
	const requestedTab = searchParams.get('tab')?.toLowerCase()
	const hasTab = (value?: string) => tabs.some(tab => tab.key === value)
	const currentTab = requestedTab && hasTab(requestedTab) ? requestedTab
		: moduleState.tab && hasTab(moduleState.tab) ? moduleState.tab
			: hasTab(defaultTab) ? defaultTab : tabs[0]?.key ?? ''

	useEffect(() => {
		if (!currentTab) return
		if (moduleState.tab !== currentTab) setModuleTab(moduleId, moduleType, currentTab)
		if (searchParams.get('tab') !== currentTab) {
			const params = new URLSearchParams(searchParams)
			params.set('tab', currentTab)
			setSearchParams(params, { replace: true })
		}
	}, [currentTab, moduleId, moduleType, moduleState.tab, searchParams, setSearchParams, setModuleTab])

	const selectTab = useCallback((value: string) => {
		if (!tabs.some(tab => tab.key === value)) return
		setModuleTab(moduleId, moduleType, value)
		const params = new URLSearchParams(searchParams)
		params.set('tab', value)
		setSearchParams(params, { replace: true })
	}, [moduleId, moduleType, tabs, searchParams, setSearchParams, setModuleTab])

	const handleTabChange = (_event: SyntheticEvent, value: string) => selectTab(value)
	return { currentTab, selectTab, handleTabChange }
}
