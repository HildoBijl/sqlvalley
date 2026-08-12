import type { RefObject } from 'react';
import { useState } from 'react';
import { useTheme } from '@mui/material/';
import type { Module } from '@sqlvalley/skill-tree-definition';
import type { Vector } from '@/utils/geometry';
import { SkillTree } from './SkillTree';
import { PlanningModeIntro } from './SkillTreeComponents/PlanningModeIntro';
import { PlanningProgressIndicator } from './SkillTreeComponents/PlanningProgressIndicator';
import { TreeLegend } from './SkillTreeComponents/TreeLegend';
import { ZoomControls } from './SkillTreeComponents/ZoomControls';
import type { SkillTreeMemoryStoreAPI } from '../types/SkillTreeMemoryStoreAPI';
import type { SkillTreeSettings } from '../types/SkillTreeSettings';
import { useSkillTreeTransform } from '../utils/graphics/useSkillTreeTransform';
import { useSkillTreePlanning } from '../utils/logic/useSkillTreePlanning';
import type { ModulePositionMeta } from '../utils/positionProcessing';

/*
 * SkillTreeCanvas component that wraps the skill tree with zoom and pan capabilities.
 * This component only handles the zoom/pan functionality and UI controls.
 *
 * @param skillTree - Skill tree modules keyed by module ID.
 * @param modulePositions - Array of module position data entries to display.
 * @param treeBounds - The bounding box of the tree layout.
 * @param visiblePaths - Array of connector objects with points arrays and from/to node IDs.
 * @param isCompleted - Function to check if a module is completed.
 * @param getProgress - Function to get progress string for a module.
 * @param hoveredId - ID of the currently hovered node, or null if none.
 * @param setHoveredId - Function to set the hovered node ID.
 * @param containerRef - Ref to the container div for the tree.
 * @param nodeRefs - Ref to a map of node IDs to their corresponding div elements.
 */
export interface SkillTreeCanvasProps {
  treeId: string;
  skillTree: Record<string, Module>;
  modulePositions: Record<string, ModulePositionMeta>;
  treeBounds: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    width: number;
    height: number;
  };
  visiblePaths: { points: Vector[]; from: string; to: string }[];
  isCompleted?: (id: string) => boolean;
  getProgress?: (id: string) => string | null;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  containerRef: RefObject<HTMLDivElement | null>;
  nodeRefs: RefObject<Map<string, HTMLDivElement | null>>;
  settings?: SkillTreeSettings;
  memoryStoreAPI?: SkillTreeMemoryStoreAPI;
}

export function SkillTreeCanvas({
  treeId,
  skillTree,
  modulePositions,
  treeBounds,
  visiblePaths,
  isCompleted,
  getProgress,
  setHoveredId,
  containerRef,
  nodeRefs,
  settings,
  memoryStoreAPI,
}: SkillTreeCanvasProps) {
  const {
    allowZoom = true,
    initialZoom = 1,
    allowPlanningMode = true,
    trackProgress = true,
  } = settings ?? {};

  const staticMode = !trackProgress;
  const resolvedIsCompleted = staticMode
    ? () => false
    : (isCompleted ?? (() => false));
  const resolvedGetProgress = staticMode ? () => null : (getProgress ?? (() => null));

  const [isPanning] = useState(false);

  const { outerRef, transform, bind, zoomBy, reset } = useSkillTreeTransform({
    treeBounds,
    initialScale: initialZoom,
    allowZoom,
  });

  const {
    planningMode,
    goalNodeId,
    setGoalNodeId,
    goalProgress,
    handleGoalProgressChange,
    showPlanningModeModal,
    setShowPlanningModeModal,
    togglePlanningMode,
  } = useSkillTreePlanning(treeId, memoryStoreAPI);

  const theme = useTheme();

  const nextStepModule = goalProgress.nextStepId ? skillTree[goalProgress.nextStepId] : null;
  const nextStepHref = nextStepModule
    ? `/${nextStepModule.type}/${goalProgress.nextStepId}`
    : null;

  return (
    <div
      ref={outerRef}
      style={{
        width: '100%',
        height: 'calc(100vh - 120px)',
        minHeight: '600px',
        border: `1px solid ${theme.palette.divider}`,
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
      }}
    >
      <ZoomControls
        onZoomIn={() => zoomBy(1.2)}
        onZoomOut={() => zoomBy(1 / 1.2)}
        onReset={reset}
        onCenter={reset}
        onTogglePlanningMode={allowPlanningMode ? togglePlanningMode : undefined}
        planningMode={allowPlanningMode ? planningMode : false}
        allowZoom={allowZoom}
      />
      {allowPlanningMode && planningMode && (
        <PlanningProgressIndicator
          nextStepName={goalProgress.nextStep || 'All completed!'}
          nextStepHref={nextStepHref}
          completedCount={goalProgress.completed}
          totalCount={goalProgress.total}
          hasGoal={!!goalNodeId}
        />
      )}
      <TreeLegend
        hideLegend={memoryStoreAPI?.hideLegend}
        setHideLegend={memoryStoreAPI?.setHideLegend}
      />

      <div
        {...bind()}
        style={{
          width: '100%',
          height: '100%',
          cursor: isPanning ? 'grabbing' : 'grab',
          touchAction: 'none',
        }}
      >
        <div
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            transformOrigin: '0 0',
            willChange: 'transform',
          }}
        >
          <SkillTree
            skillTree={skillTree}
            modulePositions={modulePositions}
            treeBounds={treeBounds}
            visiblePaths={visiblePaths}
            isCompleted={resolvedIsCompleted}
            getProgress={resolvedGetProgress}
            setHoveredId={setHoveredId}
            containerRef={containerRef}
            nodeRefs={nodeRefs}
            planningMode={allowPlanningMode ? planningMode : false}
            goalNodeId={goalNodeId}
            setGoalNodeId={setGoalNodeId}
            onGoalProgressChange={handleGoalProgressChange}
            nextStepId={goalProgress.nextStepId}
            staticMode={staticMode}
          />
        </div>
      </div>

      <PlanningModeIntro
        open={showPlanningModeModal}
        onClose={() => setShowPlanningModeModal(false)}
      />
    </div>
  );
}
