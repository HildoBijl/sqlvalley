import { useContext, useMemo } from 'react'

import { deepEqual, isPlainDataObject } from '@step-wise/js-utils'
import { useStableValue } from '@step-wise/react-utils'
import { isInputExercise } from '@step-wise/input-exercises'
import { useExerciseDefinition, useLastInputEvent, useExerciseContext } from '@sqlvalley/exercise-manager'

import type { InputFeedback } from './fieldTypes'
import { InputExerciseContext } from './context'

export function useFieldFeedback(name: string): InputFeedback | undefined {
	const exerciseContext = useExerciseContext()

	// Load in the current input for this field as well as its expected value.
	const context = useContext(InputExerciseContext)
	if (!context) throw new Error('useFieldFeedback must be used within an InputExerciseProvider.')
	const { input, solution, getFieldValidation, fields } = context
	const field = fields.get(name)
	const inputValue = useStableValue(field?.normalizeInput(input?.[name]), deepEqual)
	const expected = useStableValue(solution?.[name], deepEqual)

	// Load in the last submitted input for this field and the corresponding report.
	const lastInputEvent = useLastInputEvent()
	const submittedInput = lastInputEvent?.action.input
	const hasSubmittedInput = isPlainDataObject(submittedInput) && Object.prototype.hasOwnProperty.call(submittedInput, name)
	const submittedInputValue = useStableValue(hasSubmittedInput ? submittedInput[name] : undefined, deepEqual)
	const report = useStableValue(lastInputEvent?.report?.[name], deepEqual)

	// Load in validation info for the field.
	const validation = getFieldValidation(name)
	const invalid = validation.status === 'invalid'

	// Load in type-related functions like the exercise's value operations and the field's getFeedback function.
	const definition = useExerciseDefinition()
	if (!isInputExercise(definition)) throw new Error('useFieldFeedback requires an input-exercise definition.')
	const { valueOperations } = definition
	const getFeedback = field?.getFeedback

	// When anything changes, recompute the feedback using the respective functions.
	const feedback = useMemo(() => {
		if (invalid || !getFeedback || !hasSubmittedInput || inputValue === undefined || !deepEqual(inputValue, submittedInputValue)) return
		const domainValue = valueOperations.interpretInput({ [name]: inputValue })[name]
		return getFeedback({ report, input: domainValue, expected, rawInput: inputValue, context: exerciseContext })
	}, [invalid, getFeedback, hasSubmittedInput, inputValue, submittedInputValue, report, expected, valueOperations, name, exerciseContext])

	// Return feedback. Prioritize validation feedback.
	if (invalid) return validation.feedback == null ? undefined : { type: 'warning', message: validation.feedback }
	return feedback
}
