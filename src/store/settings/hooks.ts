import { useSettingsStore } from './store'

export function useAdminMode(): boolean {
	return useSettingsStore(state => state.adminModeEnabled)
}
