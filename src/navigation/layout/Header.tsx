import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material'
import {
	AutoStories as LearnIcon,
} from '@mui/icons-material'
import { Link as RouterLink, useLocation } from 'react-router-dom'

import { useAdminMode } from '@/store'
import { defaultSkillTreeVisualization } from '@/curriculum'

import { learningRoutes } from '../paths'
import { useLearningNavigationContext } from '../useLearningNavigationContext'

import { SettingsMenu } from './SettingsMenu'

export function Header() {
	const location = useLocation()
	const isAdmin = useAdminMode()

	// Determine which skill tree buttons to show and which to highlight.
	const { treeHistory: skillTreeHistory } = useLearningNavigationContext()
	const visibleTreeIds = skillTreeHistory.length > 0 ? skillTreeHistory : [defaultSkillTreeVisualization]
	const visibleTreeIdSet = new Set(visibleTreeIds)
	const navItems = learningRoutes
		.filter(tree => isAdmin || visibleTreeIdSet.has(tree.id))
		.map(tree => ({ path: tree.path, label: tree.label, icon: LearnIcon }))

	// Set up the Header through an AppBar.
	return <AppBar position="static" elevation={0} sx={{
		bgcolor: 'background.paper',
		color: 'text.primary',
		borderBottom: '1px solid',
		borderColor: 'divider',
		'& a:focus-visible, & .Mui-focusVisible': {
			outline: '2px solid',
			outlineColor: 'text.primary',
			outlineOffset: 2,
		}
	}}>
		<Container maxWidth="lg">
			<Toolbar disableGutters sx={{ gap: { xs: 1, sm: 3 }, py: 1 }}>

				{/* Logo/Title. */}
				<Typography
					variant="h6"
					component={RouterLink}
					to="/"
					sx={{
						flexShrink: 0,
						fontSize: 16,
						px: 1,
						py: 0.75,
						borderRadius: 1,
						textDecoration: 'none',
						'&:hover': { bgcolor: 'action.hover', textDecoration: 'none' },
						fontWeight: 600,
						'&, &:hover': { color: theme => theme.palette.mode === 'dark' ? 'primary.light' : 'primary.main' },
						cursor: 'pointer',
					}}>
					SQL Valley
				</Typography>

				{/* Navigation. */}
				<Box sx={{ flexGrow: 1, minWidth: 0, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
					{navItems.map(item => {
						const Icon = item.icon
						const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)

						return <Button
							key={item.path}
							startIcon={<Icon />}
							component={RouterLink}
							to={item.path}
							aria-current={isActive ? 'page' : undefined}
							sx={{
								fontSize: 14,
								'&, &:hover': { color: theme => isActive ? (theme.palette.mode === 'dark' ? 'primary.light' : 'primary.main') : 'text.secondary' },
								fontWeight: isActive ? 600 : 400,
								'&:hover': { bgcolor: 'action.hover' },
							}}>
							{item.label}
						</Button>
					})}
				</Box>

				{/* Settings. */}
				<SettingsMenu />

			</Toolbar>
		</Container>
	</AppBar>
}
