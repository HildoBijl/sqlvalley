import type { ReactNode } from 'react';

import { SqlModuleProvider } from '@/learning/sqlExercises';
import { getModuleTables } from './moduleAccess';

/** The module provider SQL skills prescribe: the SQL environment for their tables. */
export function SqlPracticeProvider({ skillId, children }: { skillId: string; children: ReactNode }) {
  return (
    <SqlModuleProvider skillId={skillId} tables={getModuleTables(skillId)}>
      {children}
    </SqlModuleProvider>
  );
}
