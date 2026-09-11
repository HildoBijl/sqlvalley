import type { DatasetSize } from '@sqlvalley/mock-data'

import type { SetState } from '../infrastructure'
import type { SettingsState, ThemeMode } from './state'

export interface SettingsActions {
	setAdminModeEnabled: (enabled: boolean) => void
	toggleHideStories: () => void
	setThemeMode: (themeMode: ThemeMode) => void
	setPracticeDatasetSize: (size: DatasetSize) => void
}

export function createSettingsActions(set: SetState<SettingsState>): SettingsActions {
	return {
		setAdminModeEnabled: adminModeEnabled => set({ adminModeEnabled }),
		toggleHideStories: () => set(state => ({ hideStories: !state.hideStories })),
		setThemeMode: themeMode => set({ themeMode }),
		setPracticeDatasetSize: size => set({ practiceDatasetSize: size }),
	}
}
