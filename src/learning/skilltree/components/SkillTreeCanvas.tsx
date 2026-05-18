import type { RefObject } from "react";
import { useState } from "react";
import { useSkillTreeTransform } from "../utils/graphics/useSkillTreeTransform";
import { useSkillTreePlanning } from "../utils/logic/useSkillTreePlanning";
import type { Vector } from "@/utils/geometry";
import type { Module } from "@/curriculum";
import type { ModulePositionMeta } from "@/curriculum/definitions/sql-treeDefinition";
import { SkillTree } from "./SkillTree";
import { ZoomControls } from "./SkillTreeComponents/ZoomControls";
import { TreeLegend } from "./SkillTreeComponents/TreeLegend";
import { PlanningProgressIndicator } from "./SkillTreeComponents/PlanningProgressIndicator";
import { useTheme } from "@mui/material/";
import { PlanningModeIntro } from "./SkillTreeComponents/PlanningModeIntro";

/*
 * SkillTreeCanvas component that wraps the skill tree with zoom and pan capabilities.
 * This component only handles the zoom/pan functionality and UI controls.
 *
 * @param moduleItems - Array of modules (concepts and skills) with info about these modules.
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
  moduleItems: Record<string, Module>;
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
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  containerRef: RefObject<HTMLDivElement | null>;
  nodeRefs: RefObject<Map<string, HTMLDivElement | null>>;
}

export function SkillTreeCanvas({
  treeId,
  moduleItems,
  modulePositions,
  treeBounds,
  visiblePaths,
  isCompleted,
  getProgress,
  setHoveredId,
  containerRef,
  nodeRefs,
}: SkillTreeCanvasProps) {
  const [isPanning, setIsPanning] = useState(false);

  const { outerRef, transform, bind, zoomBy, reset } = useSkillTreeTransform(treeBounds);

  const {
    planningMode,
    goalNodeId,
    setGoalNodeId,
    goalProgress,
    handleGoalProgressChange,
    showPlanningModeModal,
    setShowPlanningModeModal,
    togglePlanningMode,
  } = useSkillTreePlanning(treeId);

  const theme = useTheme();

  return (
    <div
      ref={outerRef}
      style={{
        width: "100%",
        height: "calc(100vh - 120px)",
        minHeight: "600px",
        border: `1px solid ${theme.palette.divider}`,
        overflow: "hidden",
        backgroundColor: theme.palette.background.paper,
        position: "relative",
      }}
    >
      {/* Zoom controls outside of the pannable area */}
      <ZoomControls
        onZoomIn={() => zoomBy(1.2)}
        onZoomOut={() => zoomBy(1 / 1.2)}
        onReset={reset}
        onCenter={reset}
        onTogglePlanningMode={togglePlanningMode}
        planningMode={planningMode}
      />
      {planningMode && (
        <PlanningProgressIndicator
          nextStepName={goalProgress.nextStep || "All completed!"}
          nextStepId={goalProgress.nextStepId}
          treeId={treeId}
          completedCount={goalProgress.completed}
          totalCount={goalProgress.total}
          hasGoal={!!goalNodeId}
        />
      )}
      <TreeLegend />

      {/* The pannable/zoomable area */}
      <div
        {...bind()}
        style={{
          width: "100%",
          height: "100%",
          cursor: isPanning ? "grabbing" : "grab",
          touchAction: "none", // critical for mobile
        }}
      >
        <div
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            transformOrigin: "0 0",
            willChange: "transform",
          }}
        >
          <SkillTree
            moduleItems={moduleItems}
            modulePositions={modulePositions}
            treeBounds={treeBounds}
            visiblePaths={visiblePaths}
            isCompleted={isCompleted}
            getProgress={getProgress}
            setHoveredId={setHoveredId}
            containerRef={containerRef}
            nodeRefs={nodeRefs}
            planningMode={planningMode}
            goalNodeId={goalNodeId}
            setGoalNodeId={setGoalNodeId}
            onGoalProgressChange={handleGoalProgressChange}
            nextStepId={goalProgress.nextStepId}
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
