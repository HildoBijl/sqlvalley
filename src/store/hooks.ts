import { useLearningStore } from './learning'
import { useSettingsStore } from './settings'
import { useSkillTreeSettingsStore } from './skillTreeSettings'

export function useStoresHydrated(): boolean {
	const settingsHydrated = useSettingsStore(state => state.hasHydrated)
	const learningHydrated = useLearningStore(state => state.hasHydrated)
	const skillTreeSettingsHydrated = useSkillTreeSettingsStore(state => state.hasHydrated)
	return settingsHydrated && learningHydrated && skillTreeSettingsHydrated
}
