import type { Ref } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { oneDark } from '@codemirror/theme-one-dark'
import { Paper } from '@mui/material'

import { noop } from '@step-wise/js-utils'

import { useEditorExtensions } from './useEditorExtensions'

export interface SQLEditorProps {
	value: string
	onChange?: (value: string) => void
	placeholder?: string
	height?: string
	readOnly?: boolean
	autoFocus?: boolean
	onExecute?: () => void
	ref?: Ref<HTMLDivElement>
	onLoad?: (element: HTMLElement | null) => void
	completionSchema?: Record<string, string[]>
	completionDefaultTable?: string
}

const basicSetup = {
	lineNumbers: true,
	foldGutter: false,
	dropCursor: true,
	allowMultipleSelections: true,
	indentOnInput: true,
	bracketMatching: true,
	closeBrackets: true,
	autocompletion: true,
	rectangularSelection: true,
	highlightSelectionMatches: true,
	searchKeymap: true,
}

export function SQLEditor({
	value,
	onChange,
	placeholder = 'Enter SQL query...',
	height = '300px',
	readOnly = false,
	autoFocus = false,
	onExecute,
	ref,
	onLoad = noop,
	completionSchema,
	completionDefaultTable,
}: SQLEditorProps) {
	const extensions = useEditorExtensions({ completionSchema, completionDefaultTable, onExecute })

	// Render the CodeMirror editor inside a Paper container.
	return <Paper ref={ref} elevation={2} sx={{
		overflow: 'hidden',
		border: '1px solid',
		borderColor: 'divider',
		borderRadius: 1,
		bgcolor: '#1e1e1e',
	}}>
		<CodeMirror
			key="sql-editor"
			value={value}
			onChange={onChange}
			placeholder={placeholder}
			theme={oneDark}
			extensions={extensions}
			height={height}
			editable={!readOnly}
			autoFocus={autoFocus}
			basicSetup={basicSetup}
			onCreateEditor={(...args) => { onLoad(args[0]?.contentDOM ?? null) }}
		/>
	</Paper>
}
