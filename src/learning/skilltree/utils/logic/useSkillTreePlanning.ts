import { useState, useCallback } from "react";
import { useSkillTreeSettingsStore } from "@/store";
import { SkillTreeMemoryStoreAPI } from "../../types/SkillTreeMemoryStoreAPI";

export function useSkillTreePlanning(treeId: string, memoryStoreAPI?: SkillTreeMemoryStoreAPI) {
  const storePlanningMode = useSkillTreeSettingsStore(
    (state) => state.planningMode[treeId] ?? false,
  );
  const storeSetPlanningMode = useSkillTreeSettingsStore(
    (state) => state.setPlanningMode,
  );

  const planningMode = memoryStoreAPI?.planningMode !== undefined 
    ? memoryStoreAPI.planningMode
    : storePlanningMode;

  const setPlanningMode = (value: boolean) => {
    memoryStoreAPI?.setPlanningMode 
    ? memoryStoreAPI.setPlanningMode(value) 
    : storeSetPlanningMode(treeId, value);
  }


  const storeGoalNodeId = useSkillTreeSettingsStore(
    (state) => state.goalNodeID[treeId] ?? null,
  );
  const storeSetGoalNodeId = useSkillTreeSettingsStore(
    (state) => state.setGoalNodeID,
  );

  const goalNodeId = memoryStoreAPI?.goalNodeId !== undefined
    ? memoryStoreAPI.goalNodeId
    : storeGoalNodeId;

  const setGoalNodeId = (id: string | null) =>
    memoryStoreAPI?.setGoalNodeId
      ? memoryStoreAPI.setGoalNodeId(id)
      : storeSetGoalNodeId(treeId, id);

  const storeHasAccessedPlanningMode = useSkillTreeSettingsStore(
    (state) => state.hasAccessedPlanningMode,
  );
  const storeSetHasAccessedPlanningMode = useSkillTreeSettingsStore(
    (state) => state.setHasAccessedPlanningMode,
  );

  const hasAccessedPlanningMode = memoryStoreAPI?.hasAccessedPlanningMode !== undefined
    ? memoryStoreAPI.hasAccessedPlanningMode
    : storeHasAccessedPlanningMode;

  const setHasAccessedPlanningMode = (value: boolean) =>
    memoryStoreAPI?.setHasAccessedPlanningMode
      ? memoryStoreAPI.setHasAccessedPlanningMode(value)
      : storeSetHasAccessedPlanningMode(value);

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
    setPlanningMode(!planningMode);
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
