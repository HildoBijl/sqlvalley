import { EditorView } from '@codemirror/view'
import { HighlightStyle } from '@codemirror/language'
import { tags } from '@lezer/highlight'

export const editorTheme = EditorView.theme(
	{
		'&': {
			fontSize: '14px',
			backgroundColor: '#c5b1ff11',
			color: '#cceeffaf',
		},
		'.cm-content': {
			padding: '3px 0',
		},
		'.cm-line': {
			padding: '0 4px',
		},
		'.cm-gutters': {
			backgroundColor: 'transparent',
			borderRight: 'none',
			color: '#ffffff4c',
		},
		'.cm-activeLine': {
			backgroundColor: '#cceeff11',
		},
		'.cm-activeLineGutter': {
			backgroundColor: '#cceeff11',
		},
		'.cm-cursor, .cm-dropCursor': {
			borderLeftColor: '#528bff',
		},
		'.cm-focused .cm-selectionBackground, ::selection': {
			backgroundColor: '#c8102e33',
		},
	},
	{ dark: true },
)

export const highlightStyle = HighlightStyle.define([
	{
		tag: tags.keyword,
		color: '#c81919',
		fontWeight: 600,
	},
	{
		tag: tags.string,
		color: '#98bc37',
	},
])
