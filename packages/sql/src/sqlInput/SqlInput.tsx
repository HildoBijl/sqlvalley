import { Alert, Box } from '@mui/material'

import { useInputField } from '@sqlvalley/input-exercise-components'

import { SQLEditor } from '../components'
import { useModuleCompletionSchema } from '../sqlModuleProvider'

import { normalizeSqlQuery } from './normalization'
import { useSqlQueryValidation } from './validation'

export interface SqlInputProps {
	name: string
	disabled?: boolean
	onSubmit?: () => void
	height?: string
}

export function SqlInput({ name, disabled = false, onSubmit, height = '125px' }: SqlInputProps) {
	// Register the input field to the InputExercise.
	const validate = useSqlQueryValidation()
	const { value, setValue, validation } = useInputField(name, { type: 'SQL', normalizeInput: normalizeSqlQuery, validate })

	// Render the editor field.
	const completionSchema = useModuleCompletionSchema()
	const invalid = validation.status === 'invalid'
	return <>
		<Box aria-invalid={invalid || undefined} sx={invalid ? { outline: '1px solid', outlineColor: 'error.main', borderRadius: 1 } : undefined}>
			<SQLEditor value={typeof value?.value === 'string' ? value.value : ''} onChange={setValue} height={height} readOnly={disabled} onExecute={disabled ? undefined : onSubmit} completionSchema={completionSchema} />
		</Box>
		{invalid && validation.feedback ? <Alert severity="warning" sx={{ mt: 1.5 }}>{validation.feedback}</Alert> : null}
	</>
}
