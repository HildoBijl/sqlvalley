// Interface for handling skill tree state in memory, without persistent storage. 
export interface SkillTreeMemoryStoreAPI {
    planningMode?: boolean;
    setPlanningMode?: (value: boolean) => void;
    goalNodeId?: string | null;
    setGoalNodeId?: (id: string | null) => void;
    hasAccessedPlanningMode?: boolean;
    setHasAccessedPlanningMode?: (value: boolean) => void;
    hideLegend?: boolean;
    setHideLegend?: (value: boolean) => void;
}