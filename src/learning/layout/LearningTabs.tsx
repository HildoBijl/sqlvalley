import { Card, Tab, Tabs, Box } from '@mui/material'
import type { SyntheticEvent, ReactNode, ReactElement, MouseEvent as ReactMouseEvent } from 'react'

export interface TabConfig {
	key: string
	label: string
	icon?: ReactElement | string
	disabled?: boolean
	href?: string
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
			<Tabs value={value} onChange={(event, nextValue: string) => {
				const nativeEvent = event.nativeEvent
				if (nativeEvent instanceof MouseEvent && (nativeEvent.button !== 0 || nativeEvent.ctrlKey || nativeEvent.metaKey || nativeEvent.shiftKey || nativeEvent.altKey)) return
				onChange(event, nextValue)
			}}>
				{tabs.map(tab => <Tab
					key={tab.key}
					component={tab.href ? 'a' : 'button'}
					value={tab.key}
					label={tab.label}
					icon={tab.icon}
					iconPosition={tab.icon ? 'start' : undefined}
					disabled={tab.disabled}
					href={tab.href}
					onClick={(event: ReactMouseEvent<HTMLElement>) => {
						if (tab.href && event.button === 0 && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) event.preventDefault()
					}}
					sx={{ '&:hover': { color: 'primary.main', textDecoration: 'none' }, ...(tab.align === 'end' ? { ml: 'auto' } : {}) }} />)}
			</Tabs>
		</Box>
		<Box sx={{ p: 3 }}>
			{children}
		</Box>
	</Card>
}
