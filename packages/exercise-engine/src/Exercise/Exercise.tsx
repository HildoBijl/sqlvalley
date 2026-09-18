import { ExerciseContext } from './context'
import type { ExerciseProps } from './types'

// Wraps a ready-made exercise context and renders the active exercise's component.
export function Exercise({ value, Component }: ExerciseProps) {
	return (
		<ExerciseContext.Provider value={value}>
			<Component />
		</ExerciseContext.Provider>
	)
}
