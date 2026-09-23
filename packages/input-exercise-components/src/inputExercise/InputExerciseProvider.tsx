import { Alert, Typography } from '@mui/material'

import type { InputExerciseProviderProps } from './types'
import { InputExerciseContext } from './context'
import { useInputExercise } from './inputExerciseSession'

export function InputExerciseProvider({ children }: InputExerciseProviderProps) {
	const { contextValue, loading, error } = useInputExercise()

	if (loading) return <Typography color="text.secondary">Rendering the exercises...</Typography>
	if (error) return <Alert severity="error">{error.message}</Alert>

	return <InputExerciseContext.Provider value={contextValue}>
		{children}
	</InputExerciseContext.Provider>
}
