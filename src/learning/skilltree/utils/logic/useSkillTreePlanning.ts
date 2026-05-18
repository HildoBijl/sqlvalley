import { useState, useCallback } from "react";
import { useSkillTreeSettingsStore } from "@/store";

export function useSkillTreePlanning(treeId: string) {
  const planningMode = useSkillTreeSettingsStore(
    (state) => state.planningMode[treeId] ?? false,
  );
  const setPlanningMode = useSkillTreeSettingsStore(
    (state) => state.setPlanningMode,
  );

  const goalNodeId = useSkillTreeSettingsStore(
    (state) => state.goalNodeID[treeId] ?? null,
  );
  const setGoalNodeIdInStore = useSkillTreeSettingsStore(
    (state) => state.setGoalNodeID,
  );
  const setGoalNodeId = (id: string | null) => setGoalNodeIdInStore(treeId, id);

  const hasAccessedPlanningMode = useSkillTreeSettingsStore(
    (state) => state.hasAccessedPlanningMode,
  );
  const setHasAccessedPlanningMode = useSkillTreeSettingsStore(
    (state) => state.setHasAccessedPlanningMode,
  );

  const [goalProgress, setGoalProgress] = useState({
    completed: 0,
    total: 0,
    nextStep: null as string | null,
    nextStepId: null as string | null,
  });

  const [showPlanningModeModal, setShowPlanningModeModal] = useState(false);

  const handleGoalProgressChange = useCallback(
    (
      completed: number,
      total: number,
      nextStep: string | null,
      nextStepId: string | null,
    ) => {
      setGoalProgress({ completed, total, nextStep, nextStepId });
    },
    [],
  );

  const togglePlanningMode = () => {
    if (!planningMode && !hasAccessedPlanningMode) {
      setShowPlanningModeModal(true);
      setHasAccessedPlanningMode(true);
    }
    setPlanningMode(treeId, !planningMode);
  };

  return {
    planningMode,
    goalNodeId,
    setGoalNodeId,
    goalProgress,
    handleGoalProgressChange,
    showPlanningModeModal,
    setShowPlanningModeModal,
    togglePlanningMode,
  };
}
