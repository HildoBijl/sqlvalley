import { Box } from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'

import { SQLEditor } from '../../../components'

interface ExerciseEditorProps {
	query: string
	onQueryChange: (value: string) => void
	onExecute: (value?: string) => Promise<void> | void
	onLiveExecute?: (value: string) => Promise<void> | void
	readOnly?: boolean
	invalid?: boolean
	completionSchema?: Record<string, string[]>
	sx?: SxProps<Theme>
}

export function ExerciseEditor({
	query,
	onQueryChange,
	onExecute,
	onLiveExecute,
	readOnly = false,
	invalid = false,
	completionSchema,
	sx,
}: ExerciseEditorProps) {
	return (
		<Box sx={sx}>
			<Box aria-invalid={invalid || undefined} sx={invalid ? { outline: '1px solid', outlineColor: 'error.main', borderRadius: 1 } : undefined}>
				<SQLEditor
					value={query}
					onChange={onQueryChange}
					height="125px" // Six rows of input should be sufficient.
					onExecute={onExecute}
					onLiveExecute={onLiveExecute}
					enableLiveExecution={!readOnly && !!onLiveExecute}
					liveExecutionDelay={150}
					showResults={false}
					readOnly={readOnly}
					completionSchema={completionSchema}
				/>
			</Box>
		</Box>
	)
}
