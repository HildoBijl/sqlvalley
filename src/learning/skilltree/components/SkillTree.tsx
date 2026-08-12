import type { RefObject } from 'react';
import { Curve, Drawing } from '@/components';
import type { Module } from '@sqlvalley/skill-tree-definition';
import type { Vector } from '@sqlvalley/utils/geometry';
import { useTheme } from '@mui/material/';
import { NodeCard } from './SkillTreeComponents/NodeCard';
import { Tooltip } from './SkillTreeComponents/Tooltip';
import type { ModulePositionMeta } from '../utils/positionProcessing';
import {
  isReadyToLearn,
  resolveConnectorStyle,
} from '../utils/graphics/connectorStyle';
import { useHoverState } from '../utils/graphics/mouseEvents';
import { useGoalProgress } from '../utils/logic/calculatePrerequisites';

/*
 * SkillTree component that renders the tree structure with nodes and connectors.
 * This is a pure rendering component without zoom/pan controls.
 * Uses the Drawing library for coordinate-based positioning.
 *
 * @param skillTree - Skill tree modules keyed by module ID.
 * @param modulePositions - Array of module position data entries to display.
 * @param treeBounds - The bounding box of the tree layout.
 * @param visiblePaths - Array of connector objects with points arrays and from/to node IDs.
 * @param isCompleted - Function to check if a module is completed.
 * @param getProgress - Function to get progress string for a module.
 * @param setHoveredId - Function to set the hovered node ID.
 * @param containerRef - Ref to the container div for the tree.
 * @param nodeRefs - Ref to a map of node IDs to their corresponding div elements.
 */
interface SkillTreeProps {
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
  isCompleted: (id: string) => boolean;
  getProgress: (id: string) => string | null;
  setHoveredId: (id: string | null) => void;
  containerRef: RefObject<HTMLDivElement | null>;
  nodeRefs: RefObject<Map<string, HTMLDivElement | null>>;
  planningMode: boolean;
  goalNodeId?: string | null;
  setGoalNodeId?: (id: string | null) => void;
  onGoalProgressChange?: (
    completedCount: number,
    totalCount: number,
    nextStepName: string | null,
    nextStepId: string | null,
  ) => void;
  nextStepId?: string | null;
  staticMode?: boolean;
}

export function SkillTree({
  skillTree,
  modulePositions,
  treeBounds,
  visiblePaths,
  isCompleted,
  setHoveredId,
  containerRef,
  planningMode,
  goalNodeId,
  setGoalNodeId,
  onGoalProgressChange,
  nextStepId,
  staticMode,
}: SkillTreeProps) {
  const theme = useTheme();

  const {
    localHoveredId,
    prerequisites,
    tooltip,
    handleHoverStart,
    handleHoverEnd,
    handleLongPressEnd,
    getLongPressProps,
    isConnectorInHoveredPath,
  } = useHoverState(skillTree, setHoveredId);

  const goalPrerequisites = useGoalProgress(
    goalNodeId,
    skillTree,
    isCompleted,
    onGoalProgressChange,
  );

  const handleNodeClick = (item: Module) => {
    const path = item.type === 'skill' ? `/skill/${item.id}` : `/concept/${item.id}`;
    window.location.href = path;
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: `${treeBounds.width}px`,
        height: `${treeBounds.height}px`,
        marginLeft: '35px',
        marginTop: '35px',
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Drawing
        width={treeBounds.width}
        height={treeBounds.height}
        useSvg={true}
        useCanvas={false}
        autoScale={false}
        svgProps={{ onClick: handleLongPressEnd }}
      >
        {visiblePaths.map((connector, i) => {
          const { strokeColor, strokeWidth, opacity } = resolveConnectorStyle(
            connector,
            planningMode,
            goalNodeId,
            goalPrerequisites,
            localHoveredId,
            isCompleted,
            skillTree,
            isConnectorInHoveredPath,
            staticMode,
          );

          return (
            <Curve
              key={i}
              points={connector.points}
              color={strokeColor}
              size={strokeWidth}
              curveDistance={20}
              style={{ opacity }}
            />
          );
        })}

        {Object.values(modulePositions).map((positionData) => {
          const item = skillTree[positionData.id];
          if (!item) return null;

          const readyToLearn = isReadyToLearn(item, isCompleted);

          return (
            <g
              key={item.id}
              onMouseEnter={() => handleHoverStart(item.id)}
              {...getLongPressProps(item.id)}
              onMouseLeave={handleHoverEnd}
            >
              <NodeCard
                item={item}
                positionData={modulePositions[item.id]}
                completed={isCompleted(item.id)}
                isHovered={localHoveredId === item.id}
                readyToLearn={readyToLearn}
                isPrerequisite={prerequisites.has(item.id)}
                isSomethingHovered={localHoveredId !== null}
                onClick={() => handleNodeClick(item)}
                planningMode={planningMode}
                hasGoal={planningMode && !!goalNodeId}
                isGoalNode={planningMode && goalNodeId === item.id}
                isOnGoalPath={planningMode && goalPrerequisites.has(item.id)}
                onSetGoal={() => {
                  if (planningMode && setGoalNodeId) {
                    setGoalNodeId(goalNodeId === item.id ? null : item.id);
                  }
                }}
                nextStepId={nextStepId}
                staticMode={staticMode}
              />
            </g>
          );
        })}

        <Tooltip>{tooltip}</Tooltip>
      </Drawing>
    </div>
  );
}
