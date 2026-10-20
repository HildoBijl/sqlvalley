import type { ComponentType } from 'react'
import { Divider, Typography } from '@mui/material'

export interface ConversationProps {
	completed: boolean
	opening: ComponentType
	conclusion: ComponentType
}

export function Conversation({ completed, opening: Opening, conclusion: Conclusion }: ConversationProps) {
	return <>
		<Opening />
		{completed ? <>
			<Divider sx={{ my: 4 }} />
			<Conclusion />
		</> : <Typography role="status" color="text.secondary" sx={{ textAlign: 'center', my: 4 }}>Complete this module to unlock the rest of the conversation.</Typography>}
	</>
}
