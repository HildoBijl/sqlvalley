import { Box, LinearProgress, Link, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import { useSkillTreeData } from '../core'

import { useSkillTreePlanning } from './hooks'

export function PlanningProgressIndicator() {
	const theme = useTheme()
	const { goalModuleId } = useSkillTreePlanning()

	return <Box sx={{
		position: 'absolute',
		top: 16,
		left: 16,
		zIndex: 1000,
		backgroundColor: 'background.paper',
		borderRadius: 2,
		p: 2,
		width: 220,
		border: `1px solid ${theme.palette.divider}`,
	}}>
		{goalModuleId ? <GoalProgress /> : <NoGoalProgress />}
	</Box>
}

function GoalProgress() {
	const theme = useTheme()
	const { moduleTree } = useSkillTreeData()
	const { goalProgress } = useSkillTreePlanning()
	const { completedCount, totalCount, nextStepId, nextStepName } = goalProgress
	const nextStepModule = nextStepId ? moduleTree[nextStepId] : undefined
	const nextStepHref = nextStepModule ? `/${nextStepModule.type}/${nextStepId}` : null
	const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

	return <>
		<Typography variant="subtitle2" fontWeight={600} gutterBottom>
			Goal Progress
		</Typography>

		<Typography
			variant="body2"
			sx={{
				mb: 1,
				overflow: 'hidden',
				textOverflow: 'ellipsis',
				whiteSpace: 'wrap',
			}}>
			Next Step:{' '}
			{nextStepHref ? (
				<Link href={nextStepHref} underline="none" sx={{ color: 'red', fontWeight: 700 }}>
					{nextStepName ?? 'All completed!'}
				</Link>
			) : (
				<strong style={{ color: 'red' }}>{nextStepName ?? 'All completed!'}</strong>
			)}
		</Typography>

		<LinearProgress
			variant="determinate"
			value={progress}
			sx={{
				height: 8,
				borderRadius: 4,
				backgroundColor: theme.palette.grey[200],
				'& .MuiLinearProgress-bar': {
					backgroundColor: progress < 33 ? 'red' : progress < 66 ? 'orange' : theme.palette.success.main,
					borderRadius: 4,
				},
			}}
		/>
		<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
			{completedCount} / {totalCount} modules completed
		</Typography>
	</>
}

function NoGoalProgress() {
	return <>
		<Typography variant="subtitle2" fontWeight={600} gutterBottom>
			Goal Progress
		</Typography>
		<Typography
			variant="body2"
			sx={{
				mb: 1,
				overflow: 'hidden',
				textOverflow: 'ellipsis',
				whiteSpace: 'wrap',
			}}>
			No goal set. Click on a pin to set your learning goal!
		</Typography>
	</>
}
