import { Box, Button, Dialog, DialogActions, DialogTitle, Typography } from '@mui/material'
import { ArrowBack, ArrowForward, Bolt, EmojiEvents, Map, MenuBook } from '@mui/icons-material'

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
			<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' }, gap: 1.5, width: '100%' }}>
				{onViewStory && onViewSummary && <Button onClick={() => runAction(onViewStory)} variant="contained" startIcon={<MenuBook />} sx={{ gridColumn: '1 / -1' }}>Check out the story</Button>}
				<Button onClick={() => runAction(onReturnToOverview)} variant="outlined" startIcon={<Map />} sx={{ gridColumn: onViewSummary || onViewStory ? undefined : '1 / -1' }}>Learning overview</Button>
				{onViewSummary ? <Button onClick={() => runAction(onViewSummary)} variant="contained" startIcon={<Bolt />}>View summary</Button> : onViewStory ? <Button onClick={() => runAction(onViewStory)} variant="contained" startIcon={<MenuBook />}>Check out the story</Button> : null}
				<Button onClick={onClose} variant="outlined" startIcon={<ArrowBack />} sx={{ gridColumn: onContinue ? undefined : '1 / -1' }}>Stay on this module</Button>
				{onContinue && <Button onClick={() => runAction(onContinue)} variant="contained" startIcon={<ArrowForward />}>Next module</Button>}
			</Box>
		</DialogActions>
	</Dialog>
}
