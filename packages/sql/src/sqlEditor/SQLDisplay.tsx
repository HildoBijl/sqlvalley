import type { Ref } from 'react'
import { Box } from '@mui/material'

import { SQLEditor } from './SQLEditor'

export interface SQLDisplayProps {
	children: string
	inline?: boolean
	ref?: Ref<HTMLDivElement>
	onLoad?: (element: HTMLElement | null) => void
}

// A component for pure display (no editor) of a given SQL query.
export function SQLDisplay({ children, inline = false, ref, onLoad }: SQLDisplayProps) {
	// For inline components, simply render a code block.
	if (inline) {
		return <Box ref={ref} component="code" sx={{
			px: 0.5,
			py: 0.25,
			bgcolor: 'action.hover',
			borderRadius: 0.5,
			fontFamily: 'monospace',
			fontSize: '0.875em',
			fontWeight: 550,
			color: 'primary.main',
			verticalAlign: '1px',
		}}>
			{children}
		</Box>
	}

	// For non-inline components, set up an editor with appropriate coloring.
	return <Box ref={ref}>
		<SQLEditor
			value={children.trim()}
			readOnly
			height="auto"
			ref={ref}
			onLoad={onLoad}
		/>
	</Box>
}

// A short-cut component for inline SQL.
export function ISQL(props: SQLDisplayProps) {
	return <SQLDisplay {...props} inline />
}
