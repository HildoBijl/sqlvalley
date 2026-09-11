import type { DatasetSize } from '@sqlvalley/mock-data'

import type { SettingsState, Theme } from './types'

export interface PersistedSettings {
	currentTheme?: Theme
	hideStories?: boolean
	practiceDatasetSize?: DatasetSize
}

export function partializeSettings(state: SettingsState): PersistedSettings {
	return {
		currentTheme: state.currentTheme,
		hideStories: state.hideStories,
		practiceDatasetSize: state.practiceDatasetSize,
	}
}

export function rehydrateSettings(
	state: SettingsState,
	persisted: PersistedSettings | undefined,
): void {
	if (!persisted) return

	if (persisted.currentTheme) state.currentTheme = persisted.currentTheme
	if (typeof persisted.hideStories === 'boolean') state.hideStories = persisted.hideStories
	if (persisted.practiceDatasetSize) state.practiceDatasetSize = persisted.practiceDatasetSize
}
