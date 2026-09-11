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

export function normalizePersistedSettings(persisted: PersistedSettings | undefined): Partial<SettingsState> {
	if (!persisted) return {}
	const normalized: Partial<SettingsState> = {}
	if (persisted.currentTheme) normalized.currentTheme = persisted.currentTheme
	if (typeof persisted.hideStories === 'boolean') normalized.hideStories = persisted.hideStories
	if (persisted.practiceDatasetSize) normalized.practiceDatasetSize = persisted.practiceDatasetSize
	return normalized
}
