import { type SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import type { ModuleType } from '@sqlvalley/skill-tree-definition';

import {
	type ConceptState,
	type ModuleState,
	type SkillState,
	useLearningStore,
	useModuleState,
} from '@/store';

import type { TabConfig } from '../types';

interface UseContentTabsOptions {
	defaultTab?: string;
}

export interface ContentTabsState<State> {
	currentTab: string;
	handleTabChange: (_event: SyntheticEvent, value: string) => void;
	selectTab: (value: string) => void;
	tabs: TabConfig[];
	moduleState: State;
}

export function useContentTabs(
	moduleId: string | undefined,
	moduleType: 'concept',
	tabs: TabConfig[],
	options?: UseContentTabsOptions,
): ContentTabsState<ConceptState>;
export function useContentTabs(
	moduleId: string | undefined,
	moduleType: 'skill',
	tabs: TabConfig[],
	options?: UseContentTabsOptions,
): ContentTabsState<SkillState>;
export function useContentTabs(
	moduleId: string | undefined,
	moduleType: ModuleType,
	tabs: TabConfig[],
	options?: UseContentTabsOptions,
): ContentTabsState<ModuleState>;
export function useContentTabs(
	moduleId: string | undefined,
	moduleType: ModuleType,
	tabs: TabConfig[],
	options?: UseContentTabsOptions,
): ContentTabsState<ModuleState> {
	const normalizedId = moduleId ?? '';
	const moduleState = useModuleState(normalizedId, moduleType);
	const setModuleTab = useLearningStore((state) => state.setModuleTab);
	const [searchParams, setSearchParams] = useSearchParams();

	const tabKeys = useMemo(() => tabs.map((tab) => tab.key), [tabs]);
	const searchParamsString = searchParams.toString();
	const normalizedTabParam = searchParams.get('tab')?.toLowerCase() ?? null;

	const defaultTab = useMemo(() => {
		const preferred = options?.defaultTab;
		if (preferred && tabKeys.includes(preferred)) {
			return preferred;
		}
		if (tabKeys.includes('theory')) {
			return 'theory';
		}
		if (tabKeys.includes('practice')) {
			return 'practice';
		}
		return tabKeys[0] ?? '';
	}, [options?.defaultTab, tabKeys]);

	const resolveInitialTab = useCallback(() => {
		if (normalizedTabParam && tabKeys.includes(normalizedTabParam)) {
			return normalizedTabParam;
		}
		if (moduleState.tab && tabKeys.includes(moduleState.tab)) {
			return moduleState.tab;
		}
		return defaultTab;
	}, [moduleState.tab, defaultTab, normalizedTabParam, tabKeys]);

	const [currentTab, setCurrentTab] = useState<string>(() => resolveInitialTab());

	useEffect(() => {
		const nextTab = resolveInitialTab();
		if (nextTab && nextTab !== currentTab) {
			setCurrentTab(nextTab);
		}

		if (nextTab && moduleState.tab !== nextTab) {
			setModuleTab(normalizedId, moduleType, nextTab);
		}

		if (nextTab && normalizedTabParam !== nextTab) {
			const params = new URLSearchParams(searchParamsString);
			params.set('tab', nextTab);
			setSearchParams(params, { replace: true });
		}
	}, [
		moduleState.tab,
		currentTab,
		moduleType,
		normalizedId,
		normalizedTabParam,
		resolveInitialTab,
		searchParamsString,
		setModuleTab,
		setSearchParams,
	]);

	const selectTab = useCallback(
		(value: string) => {
			if (!tabKeys.includes(value)) {
				return;
			}

			setCurrentTab(value);

			if (moduleState.tab !== value) {
				setModuleTab(normalizedId, moduleType, value);
			}

			if (normalizedTabParam !== value) {
				const params = new URLSearchParams(searchParamsString);
				params.set('tab', value);
				setSearchParams(params, { replace: true });
			}
		},
		[
			moduleState.tab,
			moduleType,
			normalizedId,
			normalizedTabParam,
			searchParamsString,
			setModuleTab,
			setSearchParams,
			tabKeys,
		],
	);

	const handleTabChange = useCallback(
		(_event: SyntheticEvent, value: string) => {
			selectTab(value);
		},
		[selectTab],
	);

	return {
		currentTab,
		handleTabChange,
		selectTab,
		tabs,
		moduleState,
	};
}
