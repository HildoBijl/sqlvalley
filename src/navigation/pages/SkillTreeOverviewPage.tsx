import { useEffect, useRef, useState } from 'react';
import { Container } from '@mui/material';
import { skillTree } from '@/curriculum';
import {
  datalogTreeHeight,
  datalogTreeWidth,
  raTreeHeight,
  raTreeWidth,
  sqlTreeHeight,
  sqlTreeWidth,
  type SkillTreeVisualizationId,
} from '@/curriculum/skillTreeVisualizations';
import { useModuleProgress } from '@/learning/progress';
import {
  SkillTreeCanvas,
  type SkillTreeCanvasProps,
} from '@/learning/skilltree/components/SkillTreeCanvas';
import { useTreeBounds } from '@/learning/skilltree/hooks/useTreeBounds';
import { useSkillTreeSettingsStore } from '@/store';

const treeDimensions: Record<SkillTreeVisualizationId, { width: number; height: number }> = {
  sql: { width: sqlTreeWidth, height: sqlTreeHeight },
  ra: { width: raTreeWidth, height: raTreeHeight },
  datalog: { width: datalogTreeWidth, height: datalogTreeHeight },
};

interface SkillTreeOverviewPageProps {
  treeId: SkillTreeVisualizationId;
  modulePositions: SkillTreeCanvasProps['modulePositions'];
  visiblePaths: SkillTreeCanvasProps['visiblePaths'];
}

export function SkillTreeOverviewPage({
  treeId,
  modulePositions,
  visiblePaths,
}: SkillTreeOverviewPageProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
  const markSkillTreeVisited = useSkillTreeSettingsStore(
    (state) => state.markSkillTreeVisited,
  );

  useEffect(() => {
    markSkillTreeVisited(treeId);
  }, [markSkillTreeVisited, treeId]);

  const { isCompleted, getProgress } = useModuleProgress(skillTree);
  const { width, height } = treeDimensions[treeId];
  const treeBounds = useTreeBounds(width, height);

  const planningMode = useSkillTreeSettingsStore(
    (s) => s.planningMode[treeId] ?? false,
  );
  const setPlanningMode = useSkillTreeSettingsStore((s) => s.setPlanningMode);

  const goalNodeId = useSkillTreeSettingsStore(
    (s) => s.goalNodeID[treeId] ?? null,
  );
  const setGoalNodeId = useSkillTreeSettingsStore((s) => s.setGoalNodeID);

  const hasAccessedPlanningMode = useSkillTreeSettingsStore(
    (s) => s.hasAccessedPlanningMode,
  );
  const setHasAccessedPlanningMode = useSkillTreeSettingsStore(
    (s) => s.setHasAccessedPlanningMode,
  );

  const hideLegend = useSkillTreeSettingsStore((s) => s.hideLegend);
  const setHideLegend = useSkillTreeSettingsStore((s) => s.setHideLegend);

  return (
    <Container maxWidth={false} sx={{ py: 4, maxWidth: '1400px' }}>
      <SkillTreeCanvas
        treeId={treeId}
        skillTree={skillTree}
        modulePositions={modulePositions}
        treeBounds={treeBounds}
        visiblePaths={visiblePaths}
        isCompleted={isCompleted}
        getProgress={getProgress}
        memoryStoreAPI={{
          planningMode,
          setPlanningMode: (value) => setPlanningMode(treeId, value),
          goalNodeId,
          setGoalNodeId: (id) => setGoalNodeId(treeId, id),
          hasAccessedPlanningMode,
          setHasAccessedPlanningMode,
          hideLegend,
          setHideLegend,
        }}
        hoveredId={hoveredId}
        setHoveredId={setHoveredId}
        containerRef={containerRef}
        nodeRefs={nodeRefs}
        settings={{
          allowZoom: true,
          initialZoom: 1,
          allowPlanningMode: true,
          trackProgress: true,
        }}
      />
    </Container>
  );
}
