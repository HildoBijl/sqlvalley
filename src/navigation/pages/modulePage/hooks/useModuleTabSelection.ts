import { type SyntheticEvent, useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

import type { ModuleType } from '@step-wise/module-tree-definition'

import { useLearningStore, useModuleState } from '@/store'
import type { TabConfig } from '@/learning'

// Combine data from URL search parameters and store data to determine the tab that should be displayed.
export function useModuleTabSelection(moduleId: string, moduleType: ModuleType, tabs: TabConfig[], defaultTab = 'theory') {
	// Check the URL's search parameters for a tab option.
	const [searchParams, setSearchParams] = useSearchParams()
	const searchParamTab = searchParams.get('tab')?.toLowerCase()
	const setSearchParamTab = useCallback((value: string) => {
		const params = new URLSearchParams(searchParams)
		params.set('tab', value)
		setSearchParams(params, { replace: true })
	}, [searchParams, setSearchParams])

	// Connect to the data store to see which tab the user last visited for this module.
	const moduleState = useModuleState(moduleId, moduleType)
	const setModuleTab = useLearningStore(state => state.setModuleTab)

	// Given all info, find the current tab. Prioritize the URL over the data store.
	const hasTab = (value?: string) => tabs.some(tab => tab.key === value)
	const currentTab = searchParamTab && hasTab(searchParamTab) ? searchParamTab : moduleState.tab && hasTab(moduleState.tab) ? moduleState.tab : hasTab(defaultTab) ? defaultTab : tabs[0]?.key ?? ''

	// If the current tab is not equal to the search param's value or the data store's value, then store it there.
	useEffect(() => {
		if (!currentTab) return
		if (searchParams.get('tab') !== currentTab) setSearchParamTab(currentTab)
		if (moduleState.tab !== currentTab) setModuleTab(moduleId, moduleType, currentTab)
	}, [currentTab, moduleId, moduleType, moduleState.tab, searchParams, setSearchParamTab, setModuleTab])

	// Set up handlers to adjust the tab, both in the search parameters and in the data store.
	const selectTab = useCallback((value: string) => {
		if (!tabs.some(tab => tab.key === value)) return
		setSearchParamTab(value)
		setModuleTab(moduleId, moduleType, value)
	}, [moduleId, moduleType, tabs, setSearchParamTab, setModuleTab])
	const handleTabChange = (_event: SyntheticEvent, value: string) => selectTab(value)

	// Return the current tab value and its change handlers.
	return { currentTab, selectTab, handleTabChange }
}
