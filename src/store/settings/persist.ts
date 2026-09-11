import { type DatasetSize, datasetSizes } from '@sqlvalley/mock-data'

import { asRecord } from '../utils'
import { isIncluded } from '../validation'
import { type SettingsState, type Theme, themes } from './types'

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

export function normalizePersistedSettings(persisted: unknown): Partial<SettingsState> {
	const source = asRecord(persisted)
	const normalized: Partial<SettingsState> = {}
	if (isIncluded(themes, source.currentTheme)) normalized.currentTheme = source.currentTheme
	if (typeof source.hideStories === 'boolean') normalized.hideStories = source.hideStories
	if (isIncluded(datasetSizes, source.practiceDatasetSize)) normalized.practiceDatasetSize = source.practiceDatasetSize
	return normalized
}
