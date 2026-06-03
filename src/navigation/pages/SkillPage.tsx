import { Suspense, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Box, Button, CircularProgress, Container, Typography } from '@mui/material';
import { Bolt, CheckCircle, Edit, EditNote, Lightbulb, MenuBook, Storage } from '@mui/icons-material';

import {
  type SkillModuleState,
  useLearningStore,
  useSettingsStore,
  useSkillTreeSettingsStore,
} from '@/store';
import { skillTree } from '@/curriculum';
import {
  defaultSkillTreeVisualization,
  isSkillTreeVisualizationId,
  skillTreeVisualizationById,
  type SkillTreeVisualizationId,
} from '@/curriculum/skillTreeVisualizations';
import { moduleComponents } from '@/curriculum/utils/loaders';
import { getModuleTables } from '@/curriculum/utils/moduleAccess';

import { ContentHeader } from '@/learning/components/ContentHeader';
import { ContentTabs } from '@/learning/components/ContentTabs';
import { DataExplorerTab } from '@/learning/components/DataExplorerTab';
import { CompletionDialog, SkillPracticeTab } from '@/learning/components/SkillPractice';
import { StoryTab, SummaryTab, TheoryTab, VideoTab } from '@/learning/components/TabContent/ContentTab';
import { useContentTabs } from '@/learning/hooks/useContentTabs';
import { useSkillContent } from '@/learning/hooks/useSkillContent';
import { useSkillExerciseController } from '@/learning/hooks/useSkillExerciseController';
import { useModuleProgress } from '@/learning/progress';
import { useAdminMode } from '@/store/adminMode';

import type { TabConfig } from '@/learning/types';

const REQUIRED_EXERCISE_COUNT = 3;

export default function SkillPage() {
  const { skillId } = useParams<{ skillId: string }>();
  const navigate = useNavigate();

  const hideStories = useSettingsStore((state) => state.hideStories);
  const completeSkill = useLearningStore((state) => state.completeSkill);
  const isAdmin = useAdminMode();
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const skillTreeHistory = useSkillTreeSettingsStore(
    (state) => state.lastVisitedSkillTrees,
  );
  const backToLearningPath = useMemo(
    () => getBackToLearningPathFromHistory(skillTreeHistory, skillId),
    [skillTreeHistory, skillId],
  );

  const hasStaticPractice = Boolean(skillId && moduleComponents[skillId]?.Practice);
  const hasTables = skillId && getModuleTables(skillId).length > 0;

  const allTabs: TabConfig[] = [
    { key: 'story', label: 'Story', icon: <MenuBook /> },
    { key: 'theory', label: 'Theory', icon: <Lightbulb /> },
    // { key: 'video', label: 'Video', icon: <OndemandVideo /> },
    { key: 'practice', label: 'Practice', icon: <Edit /> },
    { key: 'data', label: 'Data Explorer', icon: <Storage /> },
    { key: 'summary', label: 'Summary', icon: <Bolt /> },
  ];

  const availableTabs = allTabs.filter((tab) => {
    if (tab.key === 'story' && hideStories) return false;
    if (tab.key === 'data' && !hasTables) return false;
    return true;
  });

  const {
    currentTab,
    handleTabChange,
    selectTab,
    tabs,
    moduleState,
  } = useContentTabs<SkillModuleState>(skillId, 'skill', availableTabs, {
    defaultTab: 'theory',
  });

  const { isLoading, skillMeta, skillModule, error: contentError } = useSkillContent(skillId, {
    loadExercises: !hasStaticPractice,
  });

  const hasInteractivePractice = Boolean(skillModule);
  const hasPractice = hasStaticPractice || hasInteractivePractice;

  const controller = useSkillExerciseController({
    skillId: skillId ?? '',
    skillModule: hasInteractivePractice ? skillModule : null,
    requiredCount: REQUIRED_EXERCISE_COUNT,
    moduleState,
  });

  const { isCompleted } = useModuleProgress(skillTree);
  const isSkillMastered = skillId ? isCompleted(skillId) : false;
  const summaryUnlocked = isSkillMastered || isAdmin;

  const visibleTabs = useMemo(() => {
    let filtered = tabs;
    if (!hasPractice) {
      filtered = filtered.filter((tab) => tab.key !== 'practice');
    }
    if (!summaryUnlocked) {
      filtered = filtered.filter((tab) => tab.key !== 'summary');
    }
    return filtered;
  }, [tabs, hasPractice, summaryUnlocked]);

  const handleStaticComplete = () => {
    if (!skillId) return;
    completeSkill(skillId);
    setShowCompletionDialog(true);
  };

  useEffect(() => {
    if (!summaryUnlocked && currentTab === 'summary') {
      const fallbackTab =
        tabs.find((tab) => tab.key === 'practice')?.key ??
        tabs.find((tab) => tab.key !== 'summary')?.key ??
        'practice';
      selectTab(fallbackTab);
    }
  }, [currentTab, summaryUnlocked, selectTab, tabs]);

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!skillMeta) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert severity="error">
          Skill not found.{' '}
          <Button onClick={() => navigate(backToLearningPath)}>Return to learning</Button>
        </Alert>
      </Container>
    );
  }

  const progressInfo =
    hasInteractivePractice && currentTab === 'practice'
      ? {
          current: moduleState.numSolved ?? 0,
          required: REQUIRED_EXERCISE_COUNT,
        }
      : undefined;

  const { practice, status, actions } = controller;
  const showStoryButton = visibleTabs.some((tab) => tab.key === 'story');

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <ContentHeader
        title={skillMeta.name}
        description={skillMeta.description}
        onBack={() => navigate(backToLearningPath)}
        icon={<EditNote color="primary" sx={{ fontSize: 32 }} />}
        isCompleted={isSkillMastered}
        progress={progressInfo}
      />

      {contentError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {contentError}
        </Alert>
      )}

      {visibleTabs.length > 0 && (
        <ContentTabs value={currentTab} tabs={visibleTabs} onChange={handleTabChange}>
          {currentTab === 'practice' && hasStaticPractice && (
            <StaticPracticeTab
              moduleId={skillMeta.id}
              onComplete={handleStaticComplete}
              isCompleted={isSkillMastered}
            />
          )}

          {currentTab === 'practice' && hasInteractivePractice && !hasStaticPractice && (
            <SkillPracticeTab
              practice={practice}
              status={status}
              actions={actions}
              dialogs={controller.dialogs.giveUp}
              isAdmin={isAdmin}
            />
          )}

          {currentTab === 'theory' && <TheoryTab contentId={skillMeta.id} />}
          {currentTab === 'video' && <VideoTab contentId={skillMeta.id} />}
          {currentTab === 'summary' && summaryUnlocked && <SummaryTab contentId={skillMeta.id} />}
          {currentTab === 'story' && <StoryTab contentId={skillMeta.id} />}
          {currentTab === 'data' && hasTables &&
            (status.dbReady ? (
              <DataExplorerTab skillId={skillId ?? ''} />
            ) : (
              <Typography variant="body1" color="text.secondary">
                Database is loading...
              </Typography>
            ))}
        </ContentTabs>
      )}

      {currentTab === 'practice' && hasStaticPractice && !isSkillMastered && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <span />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleStaticComplete}
              startIcon={<CheckCircle />}
            >
              I have mastered these exercises
            </Button>
          </Box>
        </Box>
      )}

      <CompletionDialog
        open={controller.dialogs.completion.open}
        onClose={controller.dialogs.completion.close}
        skillName={skillMeta.name}
        onViewStory={
          showStoryButton
            ? () => {
                controller.dialogs.completion.close();
                selectTab('story');
              }
            : undefined
        }
        onViewSummary={() => {
          controller.dialogs.completion.close();
          selectTab('summary');
        }}
        onContinueLearning={() => navigate(backToLearningPath)}
        showStoryButton={showStoryButton}
      />

      <CompletionDialog
        open={showCompletionDialog}
        onClose={() => setShowCompletionDialog(false)}
        skillName={skillMeta.name}
        onViewStory={
          showStoryButton
            ? () => {
                setShowCompletionDialog(false);
                selectTab('story');
              }
            : undefined
        }
        onViewSummary={() => {
          setShowCompletionDialog(false);
          selectTab('summary');
        }}
        onContinueLearning={() => navigate(backToLearningPath)}
        showStoryButton={showStoryButton}
      />
    </Container>
  );
}

function StaticPracticeTab({
  moduleId,
  onComplete,
  isCompleted,
}: {
  moduleId: string;
  onComplete: () => void;
  isCompleted: boolean;
}) {
  const PracticeComponent = moduleComponents[moduleId]?.Practice;

  if (!PracticeComponent) {
    return null;
  }

  return (
    <Box>
      <Suspense fallback={<CircularProgress />}>
        <PracticeComponent onComplete={onComplete} isCompleted={isCompleted} />
      </Suspense>
    </Box>
  );
}

function normalizeSkillTreeHistory(
  history: readonly string[],
): SkillTreeVisualizationId[] {
  const result: SkillTreeVisualizationId[] = [];
  const seen = new Set<SkillTreeVisualizationId>();

  for (const value of history) {
    if (!isSkillTreeVisualizationId(value) || seen.has(value)) {
      continue;
    }
    seen.add(value);
    result.push(value);
  }

  return result;
}

function getBackToLearningPathFromHistory(
  history: readonly string[],
  moduleId?: string,
): string {
  const normalized = normalizeSkillTreeHistory(history);
  const fallbackId = normalized[0] ?? defaultSkillTreeVisualization;

  if (moduleId) {
    for (const treeId of normalized) {
      const tree = skillTreeVisualizationById.get(treeId);
      if (tree?.moduleIds.has(moduleId)) {
        return tree.path;
      }
    }
  }

  return skillTreeVisualizationById.get(fallbackId)?.path ?? '/learn';
}
