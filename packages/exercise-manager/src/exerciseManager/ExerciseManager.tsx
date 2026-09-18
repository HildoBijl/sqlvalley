import { Alert, Button, Typography } from '@mui/material'

import { type ExerciseManagerContextValue, ExerciseManagerContext } from '../exerciseManagerContext'
import type { ExerciseManagerProps } from './types'
import { useExerciseSession } from './useExerciseSession'

// Keep asynchronous work and local rendering state scoped to one skill.
export function ExerciseManager(props: ExerciseManagerProps) {
	return <ExerciseManagerContent key={props.skillId} {...props} />
}

function ExerciseManagerContent({ showAdminControls = false, ...options }: ExerciseManagerProps) {
	const { skillId, exercises } = options
	const {
		registration: active, instance, busy, error, retryGeneration,
		submitAction, setDraftInput, startNewExercise, selectExerciseById, showSolution,
	} = useExerciseSession(options)

	if (exercises.length === 0) return <Alert severity="info">No exercises are available yet.</Alert>
	if (!active || !instance) {
		if (error) return <Alert severity="error" action={<Button onClick={retryGeneration}>Try again</Button>}>{error}</Alert>
		return <Typography color="text.secondary">Generating your next exercise...</Typography>
	}

	const value: ExerciseManagerContextValue = {
		currentExercise: { definition: active.definition, instance },
		showAdminControls,
		exerciseIds: exercises.map(exercise => exercise.exerciseId),
		pending: busy,
		controls: { submitAction, setDraftInput, startNewExercise, selectExerciseById, showSolution: active.getSolutionInput ? showSolution : undefined },
		skillId,
	}
	const { Component } = active
	return <>
		{error && <Alert severity="error">{error}</Alert>}
		<ExerciseManagerContext.Provider key={instance.startedAt} value={value}>
			<Component />
		</ExerciseManagerContext.Provider>
	</>
}
