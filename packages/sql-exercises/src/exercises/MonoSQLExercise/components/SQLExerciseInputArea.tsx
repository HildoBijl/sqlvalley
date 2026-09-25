import type { MonoExerciseInputAreaProps } from '@sqlvalley/input-exercise-components'

import { SqlInput } from '../../../sqlInput'

export function SQLExerciseInputArea({ disabled, onSubmit }: MonoExerciseInputAreaProps) {
	return <SqlInput name="query" disabled={disabled} onSubmit={onSubmit} />
}
