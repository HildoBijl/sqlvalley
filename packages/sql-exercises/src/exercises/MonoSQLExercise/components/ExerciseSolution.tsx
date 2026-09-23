import { useMemo } from 'react'
import { Box, Typography } from '@mui/material'
import CodeMirror from '@uiw/react-codemirror'
import { sql } from '@codemirror/lang-sql'
import { EditorView } from '@codemirror/view'

interface PracticeSolution {
	query: string
	explanation?: string | null
}

interface ExerciseSolutionProps {
	solution?: PracticeSolution | null
	show?: boolean
}

export function ExerciseSolution({ solution, show = true }: ExerciseSolutionProps) {

	const normalizedSolution = solution && solution.query ? solution : null

	const readmeTheme = useMemo(
		() =>
			EditorView.theme(
				{
					'&': {
						backgroundColor: '#f6f8fa',
						color: '#24292f',
						borderRadius: '8px',
						border: '1px solid #d0d7de',
					},
					'.cm-content': {
						padding: '16px',
						fontFamily: 'Fira Code, monospace',
						fontSize: '0.95rem',
					},
					'.cm-scroller': {
						fontFamily: 'Fira Code, monospace',
					},
					'.cm-line': {
						padding: '0',
					},
					'.cm-gutters': {
						backgroundColor: '#f6f8fa',
						color: '#57606a',
						borderRight: 'none',
					},
					'.cm-activeLine': {
						backgroundColor: 'transparent',
					},
					'.cm-activeLineGutter': {
						backgroundColor: 'transparent',
					},
				},
				{ dark: false },
			),
		[],
	)

	const extensions = useMemo(() => [sql(), EditorView.lineWrapping, readmeTheme], [readmeTheme])

	const basicSetup = useMemo(
		() => ({
			lineNumbers: false,
			foldGutter: false,
			highlightActiveLine: false,
			highlightActiveLineGutter: false,
			autocompletion: false,
			bracketMatching: false,
			closeBrackets: false,
		}),
		[],
	)


	const explanation =
		normalizedSolution?.explanation ??
		'We are working on a short explanation for this solution. Check back soon!'

	if (!normalizedSolution || !show) {
		return null
	}

	return <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
		<Typography variant="body2" color="text.secondary">{explanation}</Typography>
		<CodeMirror value={normalizedSolution.query} editable={false} height="auto" extensions={extensions} basicSetup={basicSetup} />
	</Box>
}
