import type { DatasetSize } from '@sqlvalley/mock-data'

export const themeModes = ['light', 'dark'] as const
export type ThemeMode = (typeof themeModes)[number]

export interface SettingsState {
	adminModeEnabled: boolean
	storyModeEnabled: boolean
	themeMode: ThemeMode
	practiceDatasetSize: DatasetSize
}

export const initialSettingsState: SettingsState = {
	adminModeEnabled: false,
	storyModeEnabled: true,
	themeMode: 'light',
	practiceDatasetSize: 'full',
}
