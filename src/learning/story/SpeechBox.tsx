import type { ReactNode } from 'react'
import { Box, Paper, Typography } from '@mui/material'

import { type CharacterId, characters } from './characters'

export interface SpeechBoxProps {
	children: ReactNode
	person: CharacterId
	picturePosition?: 'left' | 'right'
}

export function SpeechBox({ person, picturePosition = 'left', children }: SpeechBoxProps) {
	const character = characters[person]
	return <Box component="figure" sx={{ display: 'flex', flexDirection: picturePosition === 'right' ? 'row-reverse' : 'row', alignItems: 'flex-start', gap: { xs: 1.5, sm: 2 }, m: 0, mb: 3 }}>
		<Box component="img" src={character.picture} alt="" width={88} height={88} sx={{ width: { xs: 56, sm: 88 }, height: { xs: 56, sm: 88 }, flexShrink: 0, borderRadius: '50%' }} />
		<Paper component="figcaption" variant="outlined" sx={{ flex: 1, minWidth: 0, p: { xs: 1.5, sm: 2 }, borderRadius: 3 }}>
			<Typography component="div" sx={{ fontWeight: 600, mb: 1 }}>{character.name}</Typography>
			<Box component="blockquote" sx={{ m: 0, overflowWrap: 'break-word', '& > * + *': { mt: 1 }, '& > :first-child': { mt: 0 }, '& > :last-child': { mb: 0 } }}>{children}</Box>
		</Paper>
	</Box>
}
