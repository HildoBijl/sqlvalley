import type { ReactNode } from 'react'
import { ZoomIn, OpenWith, TouchApp, School, OutlinedFlag } from '@mui/icons-material'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography, useMediaQuery } from '@mui/material'

import { useExplorer } from '../explorer'
import { useSkillTreePlanning } from '../planning'

interface SkillTreeIntroProps {
	open: boolean
	onClose: () => void
}

export function SkillTreeIntro({ open, onClose }: SkillTreeIntroProps) {
	const isTouch = useMediaQuery('(pointer: coarse)')
	const { allowZoom } = useExplorer()
	const { isPlanningEnabled } = useSkillTreePlanning()

	return <Dialog
		open={open}
		onClose={onClose}
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
				Finding your way around
			</Typography>
		</DialogTitle>
		<DialogContent sx={{ px: 4 }}>
			<Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
				This skill tree shows every concept and skill, in the recommended order of learning.
			</Typography>
			<Stack spacing={2}>
				{isTouch ? <>
					{allowZoom && <Instruction icon={<ZoomIn fontSize="small" />}>Pinch with two fingers to zoom in and out.</Instruction>}
					<Instruction icon={<OpenWith fontSize="small" />}>Drag to move around.</Instruction>
					<Instruction icon={<TouchApp fontSize="small" />}>
						Tap a module to see what it covers. <strong>Tap it again to open it.</strong>
					</Instruction>
				</> : <>
					{allowZoom && <Instruction icon={<ZoomIn fontSize="small" />}>
						Scroll to zoom in and out, or use the buttons in the corner.
					</Instruction>}
					<Instruction icon={<OpenWith fontSize="small" />}>Drag to move around.</Instruction>
					<Instruction icon={<School fontSize="small" />}>
						Hover over a module to see what it covers and highlight everything you need first. Click to open it.
					</Instruction>
				</>}
				{isPlanningEnabled && <Instruction icon={<OutlinedFlag fontSize="small" />}>
					Use the flag button to enter the planning mode. This allows you to set a goal and see what you need to learn first.
				</Instruction>}
			</Stack>
		</DialogContent>
		<DialogActions sx={{ px: 4, pb: 4, pt: 3 }}>
			<Button onClick={onClose} variant="contained" fullWidth>
				Got it
			</Button>
		</DialogActions>
	</Dialog>
}

function Instruction({ icon, children }: { icon: ReactNode; children: ReactNode }) {
	return <Stack direction="row" spacing={1.5} alignItems="flex-start">
		<Box sx={{ display: 'flex', color: 'text.secondary', pt: '2px' }}>{icon}</Box>
		<Typography variant="body2" color="text.secondary">
			{children}
		</Typography>
	</Stack>
}
