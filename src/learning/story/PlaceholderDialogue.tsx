import { Box, Typography } from '@mui/material'

import type { CharacterId } from './characters'
import { SpeechBox } from './SpeechBox'

export interface PlaceholderLine {
	person: CharacterId
	text: string
}

export function PlaceholderDialogue({ purpose, goal, lines }: { purpose: string; goal: string; lines: readonly PlaceholderLine[] }) {
	return <Box sx={{ my: 2 }} data-placeholder-dialogue>
		<Typography variant="caption" component="p" color="text.secondary">Placeholder dialogue — Purpose: {purpose}</Typography>
		<Typography variant="caption" component="p" color="text.secondary" sx={{ mb: 2 }}>Goal: {goal}</Typography>
		{lines.map((line, index) => <SpeechBox key={index} person={line.person}><Typography component="p">{line.text}</Typography></SpeechBox>)}
	</Box>
}
