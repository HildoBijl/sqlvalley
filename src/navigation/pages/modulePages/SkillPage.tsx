import { useParams, useNavigate } from 'react-router-dom'
import { Alert, Box, Button } from '@mui/material'
import { Bolt, CheckCircle, Edit, EditNote, Lightbulb, MenuBook, Storage } from '@mui/icons-material'

import { EXERCISES_REQUIRED_FOR_SKILL_COMPLETION, useModuleCompletion } from '@sqlvalley/progress'

import { useAdminMode, useLearningStore, useSettingsStore } from '@/store'
import { LoadingScreen } from '@/ui'
import { type TabConfig, LearningTabs, ModuleContentView, SkillCompletionDialog, DataExplorer, InteractivePractice } from '@/learning'
import { type ModuleId, getModulePresentation, getAvailableTableKeys, isModuleId, moduleTree, useModuleExercises, moduleComponents } from '@/curriculum'

import { useLearningNavigation } from '../../useLearningNavigation'
import { NotFoundPage } from '../NotFoundPage'
import { ModulePageLayout } from './ModulePageLayout'
import { StaticPractice } from './StaticPractice'
import { useModuleTabs } from './useModuleTabs'
import { useSkillCompletion } from './useSkillCompletion'

export function SkillPage() {
	const { skillId } = useParams()
	if (!skillId || !isModuleId(skillId) || moduleTree[skillId].type !== 'skill') return <NotFoundPage message="Skill not found" />
	return <SkillPageContent key={skillId} skillId={skillId} />
}

function SkillPageContent({ skillId }: { skillId: ModuleId }) {
	const Practice = moduleComponents[skillId]?.Practice
	const { loading, exercises, error } = useModuleExercises(skillId, { enabled: !Practice })
	// Wait for availability before synchronizing the selected tab.
	if (loading) return <LoadingScreen message="Loading module..." />
	return <SkillPageReady skillId={skillId} exercises={exercises} error={error} />
}

function SkillPageReady({ skillId, exercises, error }: {
	skillId: ModuleId
	exercises: ReturnType<typeof useModuleExercises>['exercises']
	error?: Error
}) {
	const navigate = useNavigate()
	const { backPath } = useLearningNavigation(skillId)
	const hideStories = useSettingsStore(state => state.hideStories)
	const isAdmin = useAdminMode()
	const moduleStates = useLearningStore(state => state.modules)
	const { isCompleted } = useModuleCompletion(moduleTree, moduleStates)
	const completed = isCompleted(skillId)
	const summaryUnlocked = completed || isAdmin
	const completion = useSkillCompletion(skillId)
	const content = moduleComponents[skillId]
	const Practice = content?.Practice
	const tables = getAvailableTableKeys(skillId)
	const hasInteractivePractice = !Practice && exercises.length > 0

	const allTabs: TabConfig[] = [
		{ key: 'story', label: 'Story', icon: <MenuBook /> },
		{ key: 'theory', label: 'Theory', icon: <Lightbulb /> },
		// { key: 'video', label: 'Video', icon: <OndemandVideo /> },
		{ key: 'practice', label: 'Practice', icon: <Edit /> },
		{ key: 'data', label: 'Data Explorer', icon: <Storage /> },
		{ key: 'summary', label: 'Summary', icon: <Bolt />, align: 'end' },
	]
	const tabs = allTabs.filter(tab => {
		if (tab.key === 'story') return !hideStories
		if (tab.key === 'practice') return Boolean(Practice) || hasInteractivePractice
		if (tab.key === 'data') return tables.length > 0
		if (tab.key === 'summary') return summaryUnlocked
		return true
	})
	const { currentTab, handleTabChange, selectTab } = useModuleTabs(skillId, 'skill', tabs)
	const viewTab = (tab: string) => {
		completion.close()
		selectTab(tab)
	}
	const progress = hasInteractivePractice && currentTab === 'practice'
		? { current: completion.solvedExerciseCount, required: EXERCISES_REQUIRED_FOR_SKILL_COMPLETION } : undefined

	return <ModulePageLayout moduleId={skillId} onBack={() => navigate(backPath)}
		icon={<EditNote color="primary" sx={{ fontSize: 32 }} />} isCompleted={completed} progress={progress}>
		{error && <Alert severity="warning" sx={{ mb: 2 }}>{error.message}</Alert>}
		<LearningTabs value={currentTab} tabs={tabs} onChange={handleTabChange}>
			{currentTab === 'practice' && Practice && <StaticPractice component={Practice} onComplete={completion.complete} isCompleted={completed} />}
			{currentTab === 'practice' && hasInteractivePractice && <InteractivePractice skillId={skillId} exercises={exercises} />}
			{currentTab === 'theory' && <ModuleContentView content={content} section="Theory" />}
			{currentTab === 'video' && <ModuleContentView content={content} section="Video" />}
			{currentTab === 'summary' && <ModuleContentView content={content} section="Summary" />}
			{currentTab === 'story' && <ModuleContentView content={content} section="Story" />}
			{currentTab === 'data' && <DataExplorer tables={tables} />}
		</LearningTabs>
		{currentTab === 'practice' && Practice && !completed && <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
			<Button variant="contained" onClick={completion.complete} startIcon={<CheckCircle />}>I have mastered these exercises</Button>
		</Box>}
		<SkillCompletionDialog open={completion.open} onClose={completion.close} skillName={getModulePresentation(skillId)!.name}
			onViewStory={!hideStories ? () => viewTab('story') : undefined}
			onViewSummary={() => viewTab('summary')} onContinueLearning={() => navigate(backPath)} />
	</ModulePageLayout>
}
