import type { ExerciseRegistration } from '@sqlvalley/exercise-manager'

import { buildModuleExercises } from '@/curriculum/utils/buildModuleExercises'

import chooseColumnsContacts from './chooseColumnsContacts'
import chooseColumnsDepartmentBudgets from './chooseColumnsDepartmentBudgets'
import chooseColumnsCities from './chooseColumnsCities'

export default function buildExercises(skillId: string): ExerciseRegistration[] {
	return buildModuleExercises([chooseColumnsContacts, chooseColumnsDepartmentBudgets, chooseColumnsCities], skillId)
}
