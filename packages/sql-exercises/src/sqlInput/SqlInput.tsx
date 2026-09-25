import { Alert, Box } from '@mui/material'

import { SQLEditor } from '@sqlvalley/sql'
import { useInputField } from '@sqlvalley/input-exercise-components'

import { useExerciseCompletionSchema } from '../exerciseContext'
import { sqlType, normalizeInput, hydrateInput } from './valueTypes'
import { useSqlQueryValidation } from './validation'
import { getSqlFeedback } from './feedback'

export interface SqlInputProps {
	name: string
	disabled?: boolean
	onSubmit?: () => void
	height?: string
}

export function SqlInput({ name, disabled = false, onSubmit, height = '125px' }: SqlInputProps) {
	// Register the input field to the InputExercise.
	const validate = useSqlQueryValidation()
	const { value, setValue, validation, feedback } = useInputField(name, { type: sqlType, normalizeInput, hydrateInput, validate, getFeedback: getSqlFeedback })

	// Render the editor field.
	const completionSchema = useExerciseCompletionSchema()
	const invalid = validation.status === 'invalid'
	return <>
		<Box aria-invalid={invalid || undefined} sx={invalid ? { outline: '1px solid', outlineColor: 'error.main', borderRadius: 1 } : undefined}>
			<SQLEditor value={typeof value === 'string' ? value : ''} onChange={setValue} height={height} readOnly={disabled} onExecute={disabled ? undefined : onSubmit} completionSchema={completionSchema} />
		</Box>
		{feedback ? <Alert severity={feedback.type} sx={{ mt: 1.5 }}>{feedback.message}</Alert> : null}
	</>
}
