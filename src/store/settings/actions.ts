import type { DatasetSize } from '@sqlvalley/mock-data'

import type { SetState, StateUpdate } from '../infrastructure'
import type { SettingsState, ThemeMode } from './state'

export interface SettingsActions {
	setAdminModeEnabled: (enabled: StateUpdate<boolean>) => void
	toggleHideStories: () => void
	setThemeMode: (themeMode: StateUpdate<ThemeMode>) => void
	setPracticeDatasetSize: (size: StateUpdate<DatasetSize>) => void
}

export function createSettingsActions(set: SetState<SettingsState>): SettingsActions {
	return {
		setAdminModeEnabled: update => set(state => ({ adminModeEnabled: typeof update === 'function' ? update(state.adminModeEnabled) : update })),
		toggleHideStories: () => set(state => ({ hideStories: !state.hideStories })),
		setThemeMode: update => set(state => ({ themeMode: typeof update === 'function' ? update(state.themeMode) : update })),
		setPracticeDatasetSize: update => set(state => ({ practiceDatasetSize: typeof update === 'function' ? update(state.practiceDatasetSize) : update })),
	}
}
