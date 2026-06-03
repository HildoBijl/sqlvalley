import { useMemo } from 'react';
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import {
  AutoStories as LearnIcon,
  // PlayArrow as PlaygroundIcon,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  defaultSkillTreeVisualization,
  isSkillTreeVisualizationId,
  skillTreeVisualizationDefinitions,
  type SkillTreeVisualizationId,
} from '@/curriculum/skillTreeVisualizations';
import { useAdminMode } from '@/store/adminMode';
import { useSkillTreeSettingsStore } from '@/store';
import { SettingsMenu } from './Settings';

export function Header() {
  const navigate = useNavigate();
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
    <AppBar position="static" sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
      <Container maxWidth="lg">
        <Toolbar>
          {/* Logo/Title */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 0,
              mr: 4,
              fontWeight: 600,
              color: 'primary.main',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            SQL Valley
          </Typography>

          {/* Navigation */}
          <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path ||
                location.pathname.startsWith(`${item.path}/`);

              return (
                <Button
                  key={item.path}
                  startIcon={<Icon />}
                  onClick={() => navigate(item.path)}
                  sx={{
                    color: isActive ? 'primary.main' : 'text.secondary',
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
  const history = useSkillTreeSettingsStore((state) => state.lastVisitedSkillTrees);
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
