import type { DatasetSize } from '@sqlvalley/mock-data'

import type { SetState } from '../utils'
import type { SettingsState, Theme } from './types'

export type { SettingsState } from './types'

export const initialSettingsState: SettingsState = {
	currentTheme: 'light',
	hideStories: true,
	practiceDatasetSize: 'full',
}

export interface SettingsActions {
	toggleHideStories: () => void
	setTheme: (theme: Theme) => void
	setPracticeDatasetSize: (size: DatasetSize) => void
}

export function createSettingsActions(
	set: SetState<SettingsState>,
): SettingsActions {
	return {
		toggleHideStories: () =>
			set(state => ({ hideStories: !state.hideStories })),
		setTheme: theme => set({ currentTheme: theme }),
		setPracticeDatasetSize: size => set({ practiceDatasetSize: size }),
	}
}
