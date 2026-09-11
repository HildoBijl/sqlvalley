import { useSettingsStore } from './store'

declare global {
	interface Window {
		enableAdminMode: () => void
	}
}

export function installAdminModeCommand(): void {
	if (typeof window === 'undefined') return
	window.enableAdminMode = () => {
		useSettingsStore.getState().setAdminModeEnabled(true)
		console.info('Admin mode enabled.')
	}
}
