import { createContext, useContext, type ReactNode } from 'react';

import type { ExerciseStorage } from './storage';

const ExerciseStorageContext = createContext<ExerciseStorage | null>(null);

export function ExerciseStorageProvider(
  { storage, children }: { storage: ExerciseStorage; children: ReactNode },
) {
  return (
    <ExerciseStorageContext.Provider value={storage}>
      {children}
    </ExerciseStorageContext.Provider>
  );
}

export function useExerciseStorage(): ExerciseStorage {
  const storage = useContext(ExerciseStorageContext);
  if (!storage) {
    throw new Error('useExerciseStorage must be used within an ExerciseStorageProvider.');
  }
  return storage;
}
