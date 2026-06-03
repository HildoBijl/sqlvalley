import { SimpleExercise } from '@/learning/exerciseEngine';
import type { SkillExerciseControllerState } from '../../hooks/useSkillExerciseController';

interface SkillPracticeTabProps {
  practice: SkillExerciseControllerState['practice'];
  status: SkillExerciseControllerState['status'];
  actions: SkillExerciseControllerState['actions'];
  dialogs: SkillExerciseControllerState['dialogs']['giveUp'];
  isAdmin: boolean;
}

export function SkillPracticeTab({
  practice,
  status,
  actions,
  dialogs,
  isAdmin,
}: SkillPracticeTabProps) {
  return (
    <SimpleExercise
      practice={practice}
      status={status}
      actions={actions}
      dialogs={dialogs}
      isAdmin={isAdmin}
    />
  );
}
