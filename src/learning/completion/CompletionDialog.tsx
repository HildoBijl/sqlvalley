import { Box, Button, Dialog, DialogActions, DialogTitle, Stack, Typography } from '@mui/material'
import { ArrowBack, ArrowForward, Bolt, EmojiEvents, MenuBook, Replay } from '@mui/icons-material'

interface CompletionDialogProps {
	open: boolean
	onClose: () => void
	title: string
	name?: string
	onViewSummary?: () => void
	onViewStory?: () => void
	onContinue?: () => void
	onReturnToOverview: () => void
}

export function CompletionDialog({ open, onClose, title, name, onViewSummary, onViewStory, onContinue, onReturnToOverview }: CompletionDialogProps) {
	const runAction = (action: () => void) => {
		onClose()
		action()
	}

	return <Dialog
		open={open}
		onClose={onClose}
		maxWidth="sm"
		fullWidth
		slotProps={{
			paper: {
				sx: theme => ({
					borderRadius: 3,
					border: `1px solid ${theme.palette.success.main}`
				}),
			}
		}}>
		<DialogTitle component="div" sx={{ textAlign: 'center', pt: 4, pb: 2 }}>
			<Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
				<EmojiEvents sx={{ fontSize: 48, color: 'success.main' }} />
			</Box>
			<Typography variant="h5" component="p" sx={{ fontWeight: 600 }}>{title}</Typography>
			{name && <Typography variant="subtitle1" component="p" color="text.secondary" sx={{ mt: 0.5 }}>{name}</Typography>}
		</DialogTitle>
		
		<DialogActions sx={{ px: 4, pb: 4 }}>
			<Stack spacing={1.5} sx={{ width: '100%' }}>
				{onViewSummary && <Button onClick={() => runAction(onViewSummary)} variant="contained" startIcon={<Bolt />} fullWidth>View summary</Button>}
				{onViewStory && <Button onClick={() => runAction(onViewStory)} variant="contained" startIcon={<MenuBook />} fullWidth>Check out the story</Button>}
				{onContinue && <Button onClick={() => runAction(onContinue)} variant="contained" startIcon={<ArrowForward />} fullWidth>Continue to next module</Button>}
				<Button onClick={() => runAction(onReturnToOverview)} variant="outlined" startIcon={<ArrowBack />} fullWidth>Back to learning overview</Button>
				<Button onClick={onClose} variant="outlined" startIcon={<Replay />} fullWidth>Stay on this module</Button>
			</Stack>
		</DialogActions>
	</Dialog>
}
