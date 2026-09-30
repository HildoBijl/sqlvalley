import { Card, Tab, Tabs, Box } from '@mui/material'
import type { SyntheticEvent, ReactNode, ReactElement } from 'react'

export interface TabConfig {
	key: string
	label: string
	icon?: ReactElement | string
	disabled?: boolean
	align?: 'start' | 'end'
}

interface LearningTabsProps {
	value: string
	tabs: TabConfig[]
	onChange: (event: SyntheticEvent, value: string) => void
	children: ReactNode
}

export function LearningTabs({ value, tabs, onChange, children }: LearningTabsProps) {
	return <Card>
		<Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
			<Tabs value={value} onChange={onChange}>
				{tabs.map(tab => <Tab
					key={tab.key}
					value={tab.key}
					label={tab.label}
					icon={tab.icon}
					iconPosition={tab.icon ? 'start' : undefined}
					disabled={tab.disabled}
					sx={tab.align === 'end' ? { ml: 'auto' } : undefined}
				/>)}
			</Tabs>
		</Box>
		<Box sx={{ p: 3 }}>
			{children}
		</Box>
	</Card>
}
