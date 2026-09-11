import type { DatasetSize } from '@sqlvalley/mock-data'

export const themeModes = ['light', 'dark'] as const
export type ThemeMode = (typeof themeModes)[number]

export interface SettingsState {
	adminModeEnabled: boolean
	themeMode: ThemeMode
	hideStories: boolean
	practiceDatasetSize: DatasetSize
}

export const initialSettingsState: SettingsState = {
	adminModeEnabled: false,
	themeMode: 'light',
	hideStories: true,
	practiceDatasetSize: 'full',
}
