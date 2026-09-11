import type { DatasetSize } from '@sqlvalley/mock-data'

export const themes = ['light', 'dark'] as const
export type Theme = (typeof themes)[number]

export interface SettingsState {
	currentTheme: Theme
	hideStories: boolean
	practiceDatasetSize: DatasetSize
}
