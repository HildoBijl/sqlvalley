import { Alert, Box } from '@mui/material'
import { EditNote, School } from '@mui/icons-material'

import { LoadingScreen } from '@/ui'
import { type ModuleContent, LearningHeader, LearningTabs, DataExplorer, InteractivePractice, StaticPractice, CompletionDialog, CompleteModuleButton } from '@/learning'
import type { ModuleId } from '@/curriculum'

import { ModuleContentTab } from './ModuleContentTab'
import { useModuleData, useModuleProgress, useModuleNavigation, useModulePageTabs, useCompletionDialog } from './hooks'

export function ModulePageContent({ moduleId, content }: { moduleId: ModuleId; content: ModuleContent }) {
	const data = useModuleData(moduleId, content)
	if (data.loading) return <LoadingScreen message="Loading module..." />
	if (data.error) return <Alert severity="warning" sx={{ mb: 2 }}>{data.error.message}</Alert>
	return <ModulePageReady data={data} />
}

function ModulePageReady({ data }: { data: ReturnType<typeof useModuleData> }) {
	// Call various hooks to gather data from different sources.
	const { moduleId, isSkill, content, presentation, Practice, tables, exercises, hasInteractivePractice } = data
	const { completed, isModuleCompleted, exerciseProgress, completeModule } = useModuleProgress(moduleId)
	const { backPath, returnToOverview, continueToNext } = useModuleNavigation(moduleId, isModuleCompleted)
	const { tabs, currentTab, handleTabChange, selectTab } = useModulePageTabs(data, completed)
	const { dialogOpen, closeDialog } = useCompletionDialog(completed)

	// Manual completion is available for concepts and static practice.
	const showCompleteButton = !completed && (!isSkill || (currentTab === 'practice' && Boolean(Practice)))

	// Render the module page.
	const Icon = isSkill ? EditNote : School
	return <>
		<LearningHeader title={presentation.name} description={presentation.description}
			icon={<Icon color="primary" sx={{ fontSize: 32 }} />} isCompleted={completed}
			progress={hasInteractivePractice && currentTab === 'practice' ? exerciseProgress : undefined}
			backTo={backPath} />

		<LearningTabs value={currentTab} tabs={tabs} onChange={handleTabChange}>
			{currentTab === 'story' && <ModuleContentTab content={content} contentKey="Story" />}
			{currentTab === 'video' && <ModuleContentTab content={content} contentKey="Video" />}
			{currentTab === 'theory' && <ModuleContentTab content={content} contentKey="Theory" />}
			{currentTab === 'practice' && Practice && <StaticPractice component={Practice} onComplete={completeModule} isCompleted={completed} />}
			{currentTab === 'practice' && hasInteractivePractice && <InteractivePractice skillId={moduleId} exercises={exercises} />}
			{currentTab === 'data' && <DataExplorer tables={tables} />}
			{currentTab === 'summary' && <ModuleContentTab content={content} contentKey="Summary" />}
		</LearningTabs>

		{showCompleteButton && <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
			<CompleteModuleButton onComplete={completeModule} label={isSkill ? 'I have mastered these exercises' : 'Mark as Complete'} />
		</Box>}

		<CompletionDialog
			name={presentation.name}
			title={isSkill ? 'Skill mastered' : 'Concept understood'}
			open={dialogOpen}
			onClose={closeDialog}
			onViewStory={content?.Story && tabs.some(tab => tab.key === 'story') ? () => selectTab('story') : undefined}
			onViewSummary={content?.Summary && tabs.some(tab => tab.key === 'summary') ? () => selectTab('summary') : undefined}
			onContinue={continueToNext}
			onReturnToOverview={returnToOverview} />
	</>
}
