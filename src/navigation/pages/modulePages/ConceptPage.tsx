import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Button } from '@mui/material'
import { Bolt, CheckCircle, Lightbulb, MenuBook, School } from '@mui/icons-material'

import { useModuleCompletion } from '@sqlvalley/progress'

import { useAdminMode, useLearningStore, useSettingsStore, useSkillTreeSettingsStore } from '@/store'
import { type TabConfig, LearningTabs, ModuleContentView, ConceptCompletionDialog } from '@/learning'
import { type ModuleId, getModulePresentation, getNextModuleIds, isModuleId, moduleTree, moduleComponents } from '@/curriculum'

import { getModulePath } from '../../paths'
import { useLearningNavigation } from '../../useLearningNavigation'
import { NotFoundPage } from '../NotFoundPage'
import { ModulePageLayout } from './ModulePageLayout'
import { useModuleTabs } from './useModuleTabs'

export function ConceptPage() {
	const { conceptId } = useParams()
	if (!conceptId || !isModuleId(conceptId) || moduleTree[conceptId].type !== 'concept') return <NotFoundPage message="Concept not found" />
	return <ConceptPageContent key={conceptId} conceptId={conceptId} />
}

function ConceptPageContent({ conceptId }: { conceptId: ModuleId }) {
	const navigate = useNavigate()
	const { backPath, tree } = useLearningNavigation(conceptId)
	const hideStories = useSettingsStore(state => state.hideStories)
	const completeConcept = useLearningStore(state => state.completeConcept)
	const isAdmin = useAdminMode()
	const [showCompletionDialog, setShowCompletionDialog] = useState(false)
	const moduleStates = useLearningStore(state => state.modules)
	const { isCompleted } = useModuleCompletion(moduleTree, moduleStates)
	const completed = isCompleted(conceptId)
	const goalNodeId = useSkillTreeSettingsStore(state => tree ? state.goalNodeIdByTreeId[tree.id] : undefined)
	const nextUp = getNextModuleIds(conceptId, tree?.moduleIds ?? new Set(), isCompleted, goalNodeId)
	const nextId = nextUp[0]
	const content = moduleComponents[conceptId]
	const allTabs: TabConfig[] = [
		{ key: 'story', label: 'Story', icon: <MenuBook /> },
		// { key: 'video', label: 'Video', icon: <OndemandVideo /> },
		{ key: 'theory', label: 'Theory', icon: <Lightbulb /> },
		{ key: 'summary', label: 'Summary', icon: <Bolt />, align: 'end' },
	]
	const tabs = allTabs.filter(tab => {
		if (tab.key === 'story') return !hideStories
		if (tab.key === 'summary') return completed || isAdmin
		return true
	})
	const { currentTab, handleTabChange, selectTab } = useModuleTabs(conceptId, 'concept', tabs)
	const complete = () => {
		completeConcept(conceptId)
		setShowCompletionDialog(true)
	}

	return <ModulePageLayout moduleId={conceptId} onBack={() => navigate(backPath)}
		icon={<School color="primary" sx={{ fontSize: 32 }} />} isCompleted={completed}>
		<LearningTabs value={currentTab} tabs={tabs} onChange={handleTabChange}>
			{currentTab === 'theory' && <ModuleContentView content={content} section="Theory" />}
			{currentTab === 'video' && <ModuleContentView content={content} section="Video" />}
			{currentTab === 'summary' && <ModuleContentView content={content} section="Summary" />}
			{currentTab === 'story' && <ModuleContentView content={content} section="Story" />}
		</LearningTabs>
		{!completed && <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
			<Button variant="contained" onClick={complete} startIcon={<CheckCircle />}>Mark as Complete</Button>
		</Box>}
		<ConceptCompletionDialog open={showCompletionDialog} conceptName={getModulePresentation(conceptId)!.name}
			onContinue={nextId && isModuleId(nextId) ? () => navigate(getModulePath(nextId)) : undefined}
			onClose={() => setShowCompletionDialog(false)}
			onViewSummary={() => { setShowCompletionDialog(false); selectTab('summary') }}
			onReturnToOverview={() => navigate(backPath)} />
	</ModulePageLayout>
}
