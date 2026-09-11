import type { DatasetSize } from '@sqlvalley/mock-data'

import type { SetState } from '../utils'
import type { SettingsState, Theme } from './types'

export const initialSettingsState: SettingsState = {
	adminModeEnabled: false,
	currentTheme: 'light',
	hideStories: true,
	practiceDatasetSize: 'full',
}

export interface SettingsActions {
	setAdminModeEnabled: (enabled: boolean) => void
	toggleHideStories: () => void
	setTheme: (theme: Theme) => void
	setPracticeDatasetSize: (size: DatasetSize) => void
}

export function createSettingsActions(set: SetState<SettingsState>): SettingsActions {
	return {
		setAdminModeEnabled: adminModeEnabled => set({ adminModeEnabled }),
		toggleHideStories: () => set(state => ({ hideStories: !state.hideStories })),
		setTheme: theme => set({ currentTheme: theme }),
		setPracticeDatasetSize: size => set({ practiceDatasetSize: size }),
	}
}
