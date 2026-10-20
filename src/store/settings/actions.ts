import type { DatasetSize } from '@sqlvalley/mock-data'

import type { SetState, StateUpdate } from '../infrastructure'
import type { SettingsState, ThemeMode } from './state'

export interface SettingsActions {
	setAdminModeEnabled: (enabled: StateUpdate<boolean>) => void
	setStoryModeEnabled: (enabled: StateUpdate<boolean>) => void
	setThemeMode: (themeMode: StateUpdate<ThemeMode>) => void
	setPracticeDatasetSize: (size: StateUpdate<DatasetSize>) => void
}

export function createSettingsActions(set: SetState<SettingsState>): SettingsActions {
	return {
		setAdminModeEnabled: update => set(state => ({ adminModeEnabled: typeof update === 'function' ? update(state.adminModeEnabled) : update })),
		setStoryModeEnabled: update => set(state => ({ storyModeEnabled: typeof update === 'function' ? update(state.storyModeEnabled) : update })),
		setThemeMode: update => set(state => ({ themeMode: typeof update === 'function' ? update(state.themeMode) : update })),
		setPracticeDatasetSize: update => set(state => ({ practiceDatasetSize: typeof update === 'function' ? update(state.practiceDatasetSize) : update })),
	}
}
