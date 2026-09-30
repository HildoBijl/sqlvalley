import { useCallback, useEffect, useRef, useState } from 'react'

// Track whether the completion modal is open or not.
export function useCompletionDialog(completed: boolean) {
	const [dialogOpen, setOpen] = useState(false)
	const previousCompleted = useRef(completed)

	// Open up the modal when the module transitions to completed.
	useEffect(() => {
		if (completed && !previousCompleted.current) setOpen(true)
		previousCompleted.current = completed
	}, [completed])

	// Expose dismissal; opening is driven by the completion transition.
	const closeDialog = useCallback(() => setOpen(false), [])
	return { dialogOpen, closeDialog }
}
