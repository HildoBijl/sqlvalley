import { useMemo } from 'react'
import { type SQLConfig, sql } from '@codemirror/lang-sql'
import { EditorView, keymap } from '@codemirror/view'
import { syntaxHighlighting } from '@codemirror/language'

import { useLatestRef } from '@step-wise/react-utils'

import { editorTheme, highlightStyle } from './theme'

interface EditorExtensionsOptions {
	completionSchema?: Record<string, string[]>
	completionDefaultTable?: string
	onExecute?: () => void
}

export function useEditorExtensions({ completionSchema, completionDefaultTable, onExecute }: EditorExtensionsOptions) {
	const executeRef = useLatestRef(onExecute)
	const hasExecute = Boolean(onExecute)

	// Set up the config for the SQL extension.
	const sqlConfig = useMemo<SQLConfig>(() => {
		const config: SQLConfig = {}
		if (completionSchema && Object.keys(completionSchema).length > 0) {
			config.schema = completionSchema
			const firstTable = Object.keys(completionSchema)[0]
			const inferredDefaultTable = completionDefaultTable ?? (Object.keys(completionSchema).length === 1 ? firstTable : undefined)
			if (inferredDefaultTable) config.defaultTable = inferredDefaultTable
		}
		return config
	}, [completionSchema, completionDefaultTable])

	// Memoize editor configuration so it stays stable between renders.
	const extensions = useMemo(() => {
		// Apply the SQL configuration, the theme and the other settings.
		const sqlExtension = sqlConfig.schema ? sql(sqlConfig) : sql()
		const baseExtensions = [
			sqlExtension,
			editorTheme,
			syntaxHighlighting(highlightStyle),
			EditorView.lineWrapping,
		]

		// Add the run keyboard short-cut to the field if provided.
		if (hasExecute) {
			baseExtensions.push(
				keymap.of([
					{
						key: 'Ctrl-Enter',
						mac: 'Cmd-Enter',
						run: () => {
							const execute = executeRef.current
							if (execute) {
								execute()
								return true
							}
							return false
						},
					},
				])
			)
		}

		// Return the list of all defined extensions.
		return baseExtensions
	}, [hasExecute, sqlConfig, executeRef])

	return extensions
}
