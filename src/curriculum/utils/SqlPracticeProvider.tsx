import { type ReactNode, useMemo } from 'react';

import { SqlModuleProvider } from '@sqlvalley/sql';
import { useSettingsStore } from '@/store';
import { getModuleTables } from './moduleAccess';

/** The module provider SQL skills prescribe: the SQL environment for their tables. */
export function SqlPracticeProvider({ skillId, children }: { skillId: string; children: ReactNode }) {
  const datasetSize = useSettingsStore((state) => state.practiceDatasetSize);
  const setDatasetSize = useSettingsStore((state) => state.setPracticeDatasetSize);
  const tables = useMemo(() => getModuleTables(skillId), [skillId]);

  return (
    <SqlModuleProvider
      skillId={skillId}
      tables={tables}
      datasetSize={datasetSize}
      setDatasetSize={setDatasetSize}
    >
      {children}
    </SqlModuleProvider>
  );
}
