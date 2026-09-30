import { Alert, Box } from '@mui/material'
import { EditNote, School } from '@mui/icons-material'

import { LoadingScreen } from '@/ui'
import { LearningHeader, LearningTabs, ModuleContentView, DataExplorer, InteractivePractice, StaticPractice, CompletionDialog, CompleteModuleButton } from '@/learning'
import type { ModuleId } from '@/curriculum'

import { useModuleData, useModuleProgress, useModuleNavigation, useModulePageTabs, useCompletionDialog } from './hooks'

export function ModulePageContent({ moduleId }: { moduleId: ModuleId }) {
	const data = useModuleData(moduleId)
	if (data.loading) return <LoadingScreen message="Loading module..." />
	if (data.error) return <Alert severity="warning" sx={{ mb: 2 }}>{data.error.message}</Alert>
	return <ModulePageReady data={data} />
}

function ModulePageReady({ data }: { data: ReturnType<typeof useModuleData> }) {
	// Call various hooks to gather data from different sources.
	const { moduleId, isSkill, content, presentation, Practice, tables, exercises, hasInteractivePractice } = data
	const { completed, isModuleCompleted, exerciseProgress, completeModule } = useModuleProgress(moduleId)
	const { returnToOverview, continueToNext } = useModuleNavigation(moduleId, isModuleCompleted)
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
			onBack={returnToOverview} />

		<LearningTabs value={currentTab} tabs={tabs} onChange={handleTabChange}>
			{currentTab === 'story' && <ModuleContentView content={content} section="Story" />}
			{currentTab === 'video' && <ModuleContentView content={content} section="Video" />}
			{currentTab === 'theory' && <ModuleContentView content={content} section="Theory" />}
			{currentTab === 'practice' && Practice && <StaticPractice component={Practice} onComplete={completeModule} isCompleted={completed} />}
			{currentTab === 'practice' && hasInteractivePractice && <InteractivePractice skillId={moduleId} exercises={exercises} />}
			{currentTab === 'data' && <DataExplorer tables={tables} />}
			{currentTab === 'summary' && <ModuleContentView content={content} section="Summary" />}
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
