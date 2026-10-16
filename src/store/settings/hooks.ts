import { useSettingsStore } from './store'

export function useAdminMode(): boolean {
	return useSettingsStore(state => state.adminModeEnabled)
}

// Story mode is currently available only while admin mode is enabled.
export function useStoryMode(): boolean {
	return useSettingsStore(state => state.adminModeEnabled && !state.hideStories)
}
