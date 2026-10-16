import { type DatasetSize, datasetSizes } from '@sqlvalley/mock-data'

import { asRecord, isIncluded } from '../infrastructure'
import { type SettingsState, type ThemeMode, themeModes } from './state'

export interface PersistedSettings {
	adminModeEnabled?: boolean
	storyModeEnabled?: boolean
	themeMode?: ThemeMode
	practiceDatasetSize?: DatasetSize
}

export function getPersistedSettings(state: SettingsState): PersistedSettings {
	return {
		adminModeEnabled: state.adminModeEnabled,
		storyModeEnabled: state.storyModeEnabled,
		themeMode: state.themeMode,
		practiceDatasetSize: state.practiceDatasetSize,
	}
}

export function normalizePersistedSettings(persisted: unknown): Partial<SettingsState> {
	const source = asRecord(persisted)
	const normalized: Partial<SettingsState> = {}
	if (typeof source.adminModeEnabled === 'boolean') normalized.adminModeEnabled = source.adminModeEnabled
	if (typeof source.storyModeEnabled === 'boolean') normalized.storyModeEnabled = source.storyModeEnabled
	if (isIncluded(themeModes, source.themeMode)) normalized.themeMode = source.themeMode
	if (isIncluded(datasetSizes, source.practiceDatasetSize)) normalized.practiceDatasetSize = source.practiceDatasetSize
	return normalized
}
