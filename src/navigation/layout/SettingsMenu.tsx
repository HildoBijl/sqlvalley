import { type MouseEvent, useContext, useState } from 'react'
import {
	IconButton,
	Tooltip,
	Menu,
	MenuItem,
	ListItemIcon,
	ListItemText,
	Divider,
} from '@mui/material'
import {
	DarkMode,
	LightMode,
	RestartAlt,
	Settings,
	Check,
	AdminPanelSettings,
} from '@mui/icons-material'

import { clearPersistedData, useAdminMode, useSettingsStore } from '@/store'
import { ColorModeContext } from '@/ui'

export function SettingsMenu() {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const open = Boolean(anchorEl)
	const adminEnabled = useAdminMode()
	const setAdminModeEnabled = useSettingsStore(state => state.setAdminModeEnabled)

	const { mode, toggleColorMode } = useContext(ColorModeContext)
	const isLight = mode === 'light'

	const handleClick = (event: MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget)
	}

	const handleClose = () => {
		setAnchorEl(null)
	}

	const handleAdminToggle = () => {
		setAdminModeEnabled(enabled => !enabled)
	}

	const handleReset = () => {
		const confirmed = window.confirm(
			'Reset all your data? This clears progress, settings, and history.'
		)
		if (!confirmed) {
			handleClose()
			return
		}

		try {
			clearPersistedData()
			window.location.reload()
		} catch (err) {
			console.error('Failed to reset data:', err)
			alert('Sorry, something went wrong resetting your data.')
		}
		handleClose()
	}

	return <>
		<Tooltip title="Settings">
			<IconButton
				id="settings-button"
				color="inherit"
				onClick={handleClick}
				aria-label="settings"
				aria-controls={open ? 'settings-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={open ? 'true' : undefined}>
				<Settings />
			</IconButton>
		</Tooltip>

		<Menu
			id="settings-menu"
			anchorEl={anchorEl}
			open={open}
			onClose={handleClose}
			MenuListProps={{
				'aria-labelledby': 'settings-button',
			}}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}>
			{typeof window !== 'undefined' && window.location.hostname === 'localhost' ? (
				<MenuItem onClick={handleAdminToggle}>
					<ListItemIcon>
						<AdminPanelSettings
							sx={{ color: adminEnabled ? 'primary.main' : 'inherit' }} />
					</ListItemIcon>
					<ListItemText>Admin Mode</ListItemText>
					<Check
						sx={{
							color: 'primary.main',
							ml: 1,
							visibility: adminEnabled ? 'visible' : 'hidden',
						}} />
				</MenuItem>
			) : null}

			<MenuItem onClick={toggleColorMode}>
				<ListItemIcon>
					{isLight ? <DarkMode /> : <LightMode />}
				</ListItemIcon>
				<ListItemText>
					{isLight ? 'Dark Theme' : 'Light Theme'}
				</ListItemText>
			</MenuItem>

			<Divider />

			<MenuItem onClick={handleReset}>
				<ListItemIcon>
					<RestartAlt />
				</ListItemIcon>
				<ListItemText>Reset Data</ListItemText>
			</MenuItem>
		</Menu>
	</>
}
