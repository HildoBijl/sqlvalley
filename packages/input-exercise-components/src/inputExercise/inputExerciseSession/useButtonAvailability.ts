import { useEffect, useRef, useState } from 'react'

interface ButtonAvailabilityOptions {
	allInputsValid: boolean
	validationPending: boolean
	submitting: boolean
}

export function useInputExerciseButtonAvailability({ allInputsValid, validationPending, submitting }: ButtonAvailabilityOptions) {
	// When validation is pending, remember whether it was valid before.
	const wasValid = useRef(false)
	if (!validationPending) wasValid.current = allInputsValid

	// Register when validation is pending too long.
	const [pendingTooLong, setPendingTooLong] = useState(false)
	useEffect(() => {
		if (!validationPending) return
		const timeout = window.setTimeout(() => setPendingTooLong(true), 200)
		return () => { window.clearTimeout(timeout); setPendingTooLong(false) }
	}, [validationPending])

	// Determine whether the buttons can be shown. Prevent the submit button from briefly flashing off during a short validation. If validation takes too long, then do deactivate it until validation results come in.
	const canGiveUp = !submitting
	const isSubmitButtonEnabled = canGiveUp && (allInputsValid || (validationPending && wasValid.current && !pendingTooLong))
	return { canGiveUp, isSubmitButtonEnabled }
}
