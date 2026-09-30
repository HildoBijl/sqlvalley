import { useEffect, useRef, useState } from 'react'

import { EXERCISES_REQUIRED_FOR_SKILL_COMPLETION } from '@sqlvalley/progress'

import { useLearningStore, useModuleState } from '@/store'

export function useSkillCompletion(skillId: string) {
	const { solvedExerciseCount } = useModuleState(skillId, 'skill')
	const completeSkill = useLearningStore(state => state.completeSkill)
	const [open, setOpen] = useState(false)
	const previousCount = useRef(solvedExerciseCount)
	useEffect(() => {
		const crossed = previousCount.current < EXERCISES_REQUIRED_FOR_SKILL_COMPLETION && solvedExerciseCount >= EXERCISES_REQUIRED_FOR_SKILL_COMPLETION
		previousCount.current = solvedExerciseCount
		if (crossed) setOpen(true)
	}, [solvedExerciseCount])
	const complete = () => {
		completeSkill(skillId)
		setOpen(true)
	}
	return { open, close: () => setOpen(false), complete, solvedExerciseCount }
}
