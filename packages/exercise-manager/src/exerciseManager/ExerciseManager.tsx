import { Alert, Button, Typography } from '@mui/material'

import type { ExerciseSessionContextValue } from '../exerciseSessionContext'
import { ExerciseSessionContext } from '../exerciseSessionContext/context'
import type { ExerciseManagerProps } from './types'
import { useExerciseSession } from './exerciseSession'

// Callers must key this component or an ancestor by skill ID to isolate sessions.
export function ExerciseManager({ showAdminControls = false, ...options }: ExerciseManagerProps) {
	// Set up the exercise session, creating the flags and control functions relevant to the exercise.
	const { skillId, exercises, resources } = options
	const { registration, instance, loading, generating, submitting, resourceError, generationError, submissionError, retryGeneration, dismissSubmissionError, submitAction, setDraftInput, startNewExercise, selectExerciseById } = useExerciseSession(options)

	// Check situations in which we cannot display the exercise.
	if (resourceError) return <Alert severity="error">{resourceError.message}</Alert>
	if (generationError) return <Alert severity="error" action={<Button onClick={retryGeneration}>Try again</Button>}>{generationError.message}</Alert>
	if (submissionError) return <Alert severity="error" action={<Button onClick={dismissSubmissionError}>Return to exercise</Button>}>{submissionError.message}</Alert>
	if (exercises.length === 0) return <Alert severity="info">This skill does not have any exercises yet.</Alert>
	if (loading) return <Typography color="text.secondary">Loading exercise resources...</Typography>
	if (generating || !registration || !instance) return <Typography color="text.secondary">Generating your next exercise...</Typography>

	// Set up the value for the ExerciseSessionContext.
	const value: ExerciseSessionContextValue = {
		skillId,
		context: resources?.context,
		currentExercise: { definition: registration.definition, instance },
		controls: { submitAction, setDraftInput, startNewExercise },
		submitting,
		admin: {
			showControls: showAdminControls,
			exerciseIds: exercises.map(exercise => exercise.exerciseId),
			selectExerciseById,
		},
	}

	// Render the exercise Component, wrapped in the context provider.
	const { Component } = registration
	return <ExerciseSessionContext.Provider key={instance.startedAt} value={value}>
		<Component {...value} />
	</ExerciseSessionContext.Provider>
}
