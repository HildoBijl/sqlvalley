import { Button } from '@mui/material'
import { ArrowBack, Bolt, MenuBook, Replay } from '@mui/icons-material'

import { CompletionDialog } from './CompletionDialog'

interface SkillCompletionDialogProps {
	open: boolean
	skillName?: string
	onClose: () => void
	onViewStory?: () => void
	onViewSummary?: () => void
	onContinueLearning: () => void
}

export function SkillCompletionDialog({
	open,
	skillName,
	onClose,
	onViewStory,
	onViewSummary,
	onContinueLearning,
}: SkillCompletionDialogProps) {
	return <CompletionDialog open={open} onClose={onClose} title="Skill mastered" name={skillName}>
		{onViewSummary && (
			<Button
				onClick={onViewSummary}
				variant="contained"
				startIcon={<Bolt />}
				fullWidth>
				View summary
			</Button>
		)}

		{onViewStory && (
			<Button onClick={onViewStory} variant="contained" startIcon={<MenuBook />} fullWidth>
				Check out the story
			</Button>
		)}

		<Button
			onClick={onContinueLearning}
			variant={onViewStory ? 'outlined' : 'contained'}
			startIcon={<ArrowBack />}
			fullWidth>
			Back to learning overview
		</Button>

		<Button onClick={onClose} variant="outlined" startIcon={<Replay />} fullWidth>
			Stay at this exercise
		</Button>
	</CompletionDialog>
}
