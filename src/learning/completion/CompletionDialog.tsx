import type { ReactNode } from 'react'
import { Box, Dialog, DialogActions, DialogTitle, Stack, Typography } from '@mui/material'
import { EmojiEvents } from '@mui/icons-material'

interface CompletionDialogProps {
	open: boolean
	onClose: () => void
	title: string
	name?: string
	children: ReactNode
}

export function CompletionDialog({ open, onClose, title, name, children }: CompletionDialogProps) {
	return <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth slotProps={{ paper: { sx: theme => ({ borderRadius: 3, border: `1px solid ${theme.palette.success.main}` }) } }}>
		<DialogTitle component="div" sx={{ textAlign: 'center', pt: 4, pb: 2 }}>
			<Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
				<EmojiEvents sx={{ fontSize: 48, color: 'success.main' }} />
			</Box>
			<Typography variant="h5" component="p" sx={{ fontWeight: 600 }}>{title}</Typography>
			{name && <Typography variant="subtitle1" component="p" color="text.secondary" sx={{ mt: 0.5 }}>{name}</Typography>}
		</DialogTitle>
		<DialogActions sx={{ px: 4, pb: 4 }}>
			<Stack spacing={1.5} sx={{ width: '100%' }}>{children}</Stack>
		</DialogActions>
	</Dialog>
}
