import { Bolt, Edit, Lightbulb, MenuBook, Storage } from '@mui/icons-material'

import { useAdminMode, useSettingsStore } from '@/store'
import type { TabConfig } from '@/learning'

import type { useModuleData } from './useModuleData'
import { useModuleTabSelection } from './useModuleTabSelection'

// These are all the tabs that a page may have.
const allTabs: TabConfig[] = [
	{ key: 'story', label: 'Story', icon: <MenuBook /> },
	{ key: 'theory', label: 'Theory', icon: <Lightbulb /> },
	// { key: 'video', label: 'Video', icon: <OndemandVideo /> },
	{ key: 'practice', label: 'Practice', icon: <Edit /> },
	{ key: 'data', label: 'Data Explorer', icon: <Storage /> },
	{ key: 'summary', label: 'Summary', icon: <Bolt />, align: 'end' },
]

// Determine which tabs a module page should show (given the loaded module's definition) and track which tab we're on. It calls useModuleTabSelection.
export function useModulePageTabs(data: ReturnType<typeof useModuleData>, completed: boolean) {
	const hideStories = useSettingsStore(state => state.hideStories)
	const isAdmin = useAdminMode()
	const tabs = allTabs.filter(tab => {
		if (tab.key === 'story') return !hideStories
		if (tab.key === 'practice') return Boolean(data.Practice) || data.hasInteractivePractice
		if (tab.key === 'data') return data.tables.length > 0
		if (tab.key === 'summary') return completed || isAdmin
		return true
	})
	const selection = useModuleTabSelection(data.moduleId, data.moduleType, tabs)
	return { ...selection, tabs }
}
