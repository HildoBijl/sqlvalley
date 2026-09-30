import { Button } from '@mui/material'
import { ArrowBack, Bolt, ArrowForward } from '@mui/icons-material'

import { CompletionDialog } from './CompletionDialog'

interface ConceptCompletionDialogProps {
	open: boolean
	conceptName?: string
	onClose: () => void
	onViewSummary: () => void
	onReturnToOverview: () => void
	onContinue?: () => void
}

export function ConceptCompletionDialog({
	open,
	conceptName,
	onClose,
	onViewSummary,
	onReturnToOverview,
	onContinue,
}: ConceptCompletionDialogProps) {

	return <CompletionDialog open={open} onClose={onClose} title="Concept understood" name={conceptName}>
		<Button onClick={onViewSummary} variant="contained" startIcon={<Bolt />} fullWidth>
			View summary
		</Button>

		{onContinue && (
			<Button
				onClick={() => {
					onContinue()
					onClose()
				}}
				variant="contained"
				startIcon={<ArrowForward />}
				fullWidth>
				Continue to next
			</Button>
		)}

		<Button
			onClick={onReturnToOverview}
			variant="outlined"
			startIcon={<ArrowBack />}
			fullWidth>
			Return to learning overview
		</Button>
	</CompletionDialog>
}
