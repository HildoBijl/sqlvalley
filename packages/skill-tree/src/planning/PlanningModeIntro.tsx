import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material'

import { useSkillTreePlanning } from './hooks'

export function PlanningModeIntro() {
	const { showPlanningModeIntro, closePlanningModeIntro } = useSkillTreePlanning()

	return <Dialog
		open={showPlanningModeIntro}
		onClose={closePlanningModeIntro}
		maxWidth="sm"
		fullWidth
		slotProps={{
			paper: {
				sx: theme => ({
					borderRadius: 3,
					border: `1px solid ${theme.palette.success.main}`,
				}),
			},
		}}>
		<DialogTitle component="div" sx={{ textAlign: 'center', pt: 4, pb: 2 }}>
			<Typography variant="h5" fontWeight="bold">
				Welcome to planning mode
			</Typography>
		</DialogTitle>
		<DialogContent sx={{ px: 4 }}>
			<Typography variant="body2" color="text.secondary" align="center">
				In planning mode, you can set a learning goal and get a personalized learning path to reach it. Click on a pin to set your goal and start planning your learning journey!
			</Typography>
		</DialogContent>
		<DialogActions sx={{ px: 4, pb: 4, pt: 2 }}>
			<Button onClick={closePlanningModeIntro} variant="contained" fullWidth>
				Got it
			</Button>
		</DialogActions>
	</Dialog>
}
