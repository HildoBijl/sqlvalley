import { useState, useEffect } from "react";
import { useSkillTreeSettingsStore } from "@/store";
import { SkillTreeMemoryStoreAPI } from "../../types/SkillTreeMemoryStoreAPI";

export function useSkillTreeIntro(memoryStoreAPI?: SkillTreeMemoryStoreAPI) {
  const storeHasSeenIntro = useSkillTreeSettingsStore(
    (state) => state.hasSeenSkillTreeIntro,
  );
  const storeSetHasSeenIntro = useSkillTreeSettingsStore(
    (state) => state.setHasSeenSkillTreeIntro,
  );
  const hasHydrated = useSkillTreeSettingsStore((state) => state._hasHydrated);

  const hasSeenIntro = memoryStoreAPI?.hasSeenSkillTreeIntro !== undefined
    ? memoryStoreAPI.hasSeenSkillTreeIntro
    : storeHasSeenIntro;

  const setHasSeenIntro = (value: boolean) =>
    memoryStoreAPI?.setHasSeenSkillTreeIntro
      ? memoryStoreAPI.setHasSeenSkillTreeIntro(value)
      : storeSetHasSeenIntro(value);

  const [showIntro, setShowIntro] = useState(false);

  // Show once, on the first ever visit to a skill tree. Wait for the persisted
  // store to rehydrate, otherwise returning users see it again on every load.
  useEffect(() => {
    if (!hasHydrated || hasSeenIntro) return;
    setShowIntro(true);
    setHasSeenIntro(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated, hasSeenIntro]);

  return { showIntro, setShowIntro, openIntro: () => setShowIntro(true) };
}
