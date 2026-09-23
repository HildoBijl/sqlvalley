import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react'

import type { PlainDataObject } from '@step-wise/js-utils'
import { useLatestRef } from '@step-wise/react-utils'
import type { InputExerciseRawInput } from '@step-wise/input-exercises'

import type { InputFieldOptions } from './fieldTypes'

export interface FieldValidationState {
	status: 'pending' | 'valid' | 'invalid'
	feedback?: ReactNode
	report?: unknown
}

interface ValidationEntry extends FieldValidationState {
	key: string
	field: InputFieldOptions
	context: unknown
}

interface ActiveValidation {
	key: string
	field: InputFieldOptions
	context: unknown
	controller: AbortController
}

interface InputValidationOptions {
	input: PlainDataObject | undefined
	context: unknown
	fields: ReadonlyMap<string, InputFieldOptions>
	normalizeInput: (input: PlainDataObject | undefined) => InputExerciseRawInput
}

export function useInputValidation({ input, context, fields, normalizeInput }: InputValidationOptions) {
	// Set up memory space to store validation results.
	const [entries, setEntries] = useState<Record<string, ValidationEntry>>({})
	const entriesRef = useLatestRef(entries)
	const latestInputRef = useLatestRef(input)
	
	const normalizedInput = normalizeInput(input)
	const normalizedInputRef = useLatestRef(normalizedInput)
	
	// Turn the normalized input into an input key, which is used to check if validation needs to be done anew.
	const inputKey = JSON.stringify(normalizedInput)
	const getInputKey = useCallback((draft: PlainDataObject | undefined) => JSON.stringify(normalizeInput(draft)), [normalizeInput])
	
	// Whenever an input field (or context) changes, run a new validation.
	const activeValidations = useRef(new Map<string, ActiveValidation>())
	useEffect(() => {
		// Cancel existing runs whose own field, normalized value, or context changed.
		for (const [name, active] of activeValidations.current) {
			const field = fields.get(name)
			const key = field && JSON.stringify([name, normalizedInputRef.current[name]])
			if (field === active.field && key === active.key && context === active.context) continue
			active.controller.abort()
			activeValidations.current.delete(name)
		}

		// Walk through all fields and see if any require validation.
		for (const [name, field] of fields) {
			// When a field already has an accurate validation, skip it.
			const normalizedInput = normalizedInputRef.current[name]
			const key = JSON.stringify([name, normalizedInput])
			if (activeValidations.current.has(name)) continue
			const previous = entriesRef.current[name]
			if (previous?.key === key && previous.field === field && previous.context === context && previous.status !== 'pending') continue

			// When there is no validate function, the field is always valid.
			const baseEntry = { key, field, context }
			if (!field.validate) {
				setEntries(current => ({ ...current, [name]: { ...baseEntry, status: 'valid' } }))
				continue
			}

			// Set up a new validation call and store that it's being run.
			const rawInput = latestInputRef.current?.[name]
			const validate = field.validate
			const newValidation = { key, field, context, controller: new AbortController() }
			activeValidations.current.set(name, newValidation)
			setEntries(current => ({ ...current, [name]: { ...baseEntry, status: 'pending' } }))

			// Start the validation call. When it's done, check if it's still recent, and if so store the results.
			void (async () => {
				try {
					const result = await validate({ rawInput, normalizedInput, context, signal: newValidation.controller.signal })
					if (activeValidations.current.get(name) !== newValidation) return
					setEntries(current => ({ ...current, [name]: { ...baseEntry, status: result.valid ? 'valid' : 'invalid', ...(result.valid ? { report: result.report } : { feedback: result.feedback }) } }))
				} catch (error) {
					if (activeValidations.current.get(name) !== newValidation) return
					setEntries(current => ({ ...current, [name]: { ...baseEntry, status: 'invalid', feedback: error instanceof Error ? error.message : String(error) } }))
				} finally {
					if (activeValidations.current.get(name) === newValidation) activeValidations.current.delete(name)
				}
			})()
		}
	}, [inputKey, context, fields, entriesRef, latestInputRef, normalizedInputRef])

	// Abort all remaining field validations on dismounting.
	useEffect(() => () => {
		for (const active of activeValidations.current.values()) active.controller.abort()
		activeValidations.current.clear()
	}, [])

	// Handler: Extract the validation result for a given field name.
	const getFieldValidation = useCallback((name: string): FieldValidationState => {
		const field = fields.get(name)
		if (!field) return { status: 'pending' }
		const key = JSON.stringify([name, normalizedInput[name]])
		const entry = entries[name]
		return entry?.key === key && entry.field === field && entry.context === context ? entry : { status: 'pending' }
	}, [entries, normalizedInput, context, fields])

	// Determine some useful flags for the context.
	const fieldNames = [...fields.keys()]
	const statuses = fieldNames.map(name => getFieldValidation(name).status)
	const validationPending = statuses.includes('pending')
	const allInputsValid = statuses.every(status => status === 'valid')

	// Handler: check if the given draft input still matches the input for which validation was done, and whether it was valid. It's the final check before submission.
	const currentInputKeyRef = useLatestRef(inputKey)
	const canSubmitCurrentInput = useCallback((draft: PlainDataObject) => {
		if (draft !== latestInputRef.current || getInputKey(draft) !== currentInputKeyRef.current) return false
		return [...fields].every(([name, field]) => {
			const entry = entriesRef.current[name]
			const key = JSON.stringify([name, normalizedInputRef.current[name]])
			return entry?.key === key && entry.field === field && entry.context === context && entry.status === 'valid'
		})
	}, [context, fields, getInputKey, entriesRef, latestInputRef, normalizedInputRef, currentInputKeyRef])

	// All done. Return the relevant context values.
	return { allInputsValid, validationPending, getInputKey, getFieldValidation, canSubmitCurrentInput }
}
