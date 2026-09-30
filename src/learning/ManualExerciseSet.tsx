import type { ReactNode } from 'react'
import { Box } from '@mui/material'

import { ExerciseSection } from '@sqlvalley/input-exercise-components'

interface Exercise {
	problem: ReactNode,
	solution: ReactNode,
}

interface ManualExerciseSetProps {
	exercises: Exercise[]
	startingNumber?: number
}

export function ManualExerciseSet({ exercises, startingNumber = 1 }: ManualExerciseSetProps) {
	return <>{exercises.map((exercise, index) => <ManualExercise key={index} exercise={exercise} number={index + startingNumber} />)}</>
}

interface ManualExerciseProps {
	exercise: Exercise
	number: number
}

function ManualExercise({ exercise, number }: ManualExerciseProps) {
	return <>
		<ExerciseSection title={`Exercise ${number}`} sx={{ mb: 0 }}>
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
				{exercise.problem}
			</Box>
		</ExerciseSection>
		<ExerciseSection title="Solution" collapsible defaultExpanded={false}
			sx={{ bgcolor: 'background.paper', boxShadow: 'none', border: 1, borderColor: 'divider' }}>
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
				{exercise.solution}
			</Box>
		</ExerciseSection>
	</>
}
