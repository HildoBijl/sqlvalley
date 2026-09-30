import { useMemo } from 'react';
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import {
	AutoStories as LearnIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { type SkillTreeVisualizationId, defaultSkillTreeVisualization, isSkillTreeVisualizationId, skillTreeVisualizationDefinitions } from '@/curriculum'
import { useAdminMode, useSkillTreeSettingsStore } from '@/store';
import { SettingsMenu } from './Settings';

export function Header() {
	const location = useLocation();
	const isAdmin = useAdminMode();
	const skillTreeHistory = useSkillTreeHistory();
	const visibleTreeIds =
		skillTreeHistory.length > 0
			? skillTreeHistory
			: [defaultSkillTreeVisualization];
	const visibleTreeIdSet = new Set(visibleTreeIds);
	const navItems = skillTreeVisualizationDefinitions
		.filter((tree) => isAdmin || visibleTreeIdSet.has(tree.id))
		.map((tree) => ({
			path: tree.path,
			label: tree.label,
			icon: LearnIcon,
		}));

	return (
		<AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider', '& a:focus-visible, & .Mui-focusVisible': { outline: '2px solid', outlineColor: 'text.primary', outlineOffset: 2 } }}>
			<Container maxWidth={false} sx={{ maxWidth: 1040 }}>
				<Toolbar disableGutters sx={{ gap: { xs: 1, sm: 3 }, py: 1 }}>
					{/* Logo/Title */}
					<Typography
						variant="h6"
						component={RouterLink}
						to="/"
						sx={{
							flexShrink: 0,
							fontSize: 16,
							textDecoration: 'none',
							'&:hover': { textDecoration: 'none' },
							fontWeight: 600,
							color: theme => theme.palette.mode === 'dark' ? 'primary.light' : 'primary.main',
							cursor: 'pointer',
						}}
					>
						SQL Valley
					</Typography>

					{/* Navigation */}
					<Box sx={{ flexGrow: 1, minWidth: 0, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
						{navItems.map((item) => {
							const Icon = item.icon;
							const isActive = location.pathname === item.path ||
								location.pathname.startsWith(`${item.path}/`);

							return (
								<Button
									key={item.path}
									startIcon={<Icon />}
									component={RouterLink}
									to={item.path}
									aria-current={isActive ? 'page' : undefined}
									sx={{
										fontSize: 14,
										color: theme => isActive ? (theme.palette.mode === 'dark' ? 'primary.light' : 'primary.main') : 'text.secondary',
										fontWeight: isActive ? 600 : 400,
										'&:hover': {
											bgcolor: 'action.hover',
										},
									}}
								>
									{item.label}
								</Button>
							);
						})}
					</Box>

					<SettingsMenu />
				</Toolbar>
			</Container>
		</AppBar>
	);
}

function useSkillTreeHistory(): SkillTreeVisualizationId[] {
	const history = useSkillTreeSettingsStore((state) => state.recentSkillTreeIds);
	return useMemo(() => normalizeSkillTreeHistory(history), [history]);
}

function normalizeSkillTreeHistory(
	history: readonly string[],
): SkillTreeVisualizationId[] {
	const result: SkillTreeVisualizationId[] = [];
	const seen = new Set<SkillTreeVisualizationId>();

	for (const value of history) {
		if (!isSkillTreeVisualizationId(value) || seen.has(value)) {
			continue;
		}
		seen.add(value);
		result.push(value);
	}

	return result;
}
