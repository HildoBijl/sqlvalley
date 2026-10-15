# Skill tree

`@sqlvalley/skill-tree` visualizes a module tree with positioned cards, prerequisite connectors, navigation, zooming, progress, and optional learning-goal planning.

The package does not define the educational dependencies itself. Supply a `ModuleTree` from `@step-wise/module-tree-definition`, presentation text for its modules, and grid positions describing how those modules should appear.


## Basic setup

Define a grid position for every module that should appear. Coordinates describe cell centers: increasing `x` moves right and increasing `y` moves down. `defineModulePositioning` converts these positions to drawing coordinates and creates the prerequisite connectors.

```tsx
import { type ModuleGridPositions, defineModulePositioning, SkillTreeVisualization } from '@sqlvalley/skill-tree'

import { moduleTree, modulePresentation } from './curriculum'

const gridPositions: ModuleGridPositions = {
	database: [0, 0],
	selectRows: [-1, 1],
	filterRows: [1, 1],
}

const modulePositioning = defineModulePositioning(moduleTree, gridPositions)

export function LearningOverview() {
	return <SkillTreeVisualization
		moduleTree={moduleTree}
		modulePresentation={modulePresentation}
		modulePositioning={modulePositioning}
		getModuleHref={moduleId => `/module/${moduleId}`}
	/>
}
```

Module cards are native links. Normal clicks, modifier clicks, middle clicks, keyboard activation, and browser context menus therefore retain their standard behavior. On touchscreens, the first tap highlights a module and its prerequisites; tapping that module again follows its link.


## Visualization settings

Pass `settings` to customize navigation and the initial view.

```tsx
<SkillTreeVisualization
	{...props}
	settings={{
		allowZoom: true,
		initialScale: 1,
		minScale: 0,
		maxScale: 1.5,
		treePadding: 30,
		initialModuleId: 'database',
	}}
/>
```

Available settings are:

- `allowZoom`: enables wheel, pinch, and button zooming. Defaults to `true`.
- `initialScale`: scale used initially and by the reset button. Defaults to `1`.
- `minScale` and `maxScale`: requested scale limits. The effective minimum is raised when necessary to fit the drawing and its padding inside the viewport.
- `treePadding`: movable space retained around the drawing. Defaults to `30` drawing pixels.
- `initialModuleId`: module to center initially and when resetting.
- `initialGridPosition`: grid coordinate to center instead. It cannot be combined with `initialModuleId`.
- `allowPlanningMode`: enables learning-goal planning. It is disabled by default and discussed below.

Without an initial module or grid position, the visualization focuses on the midpoint of the drawing.


## Controlling basic state

The introduction and legend use local component state by default. Supply state handles when their state should be controlled or persisted by the application. Each handle is a standard React `[value, setValue]` tuple.

```tsx
import { useState } from 'react'

export function LearningOverview() {
	const [hasSeenIntro, setHasSeenIntro] = useState(false)
	const [legendHidden, setLegendHidden] = useState(false)

	return <SkillTreeVisualization
		{...props}
		stateHandles={{
			intro: {
				hasSeenIntro: [hasSeenIntro, setHasSeenIntro],
			},
			legend: {
				hidden: [legendHidden, setLegendHidden],
			},
		}}
	/>
}
```

For asynchronously hydrated storage, set `stateHandles.isReady` to `false` until hydration finishes. This prevents the introduction from appearing before the persisted `hasSeenIntro` value is available.


## Tracking progress

Pass `isModuleCompleted` to enable progress styling. The callback is queried with module IDs and should report whether each module has been completed.

```tsx
const completedModuleIds = new Set(['database', 'selectRows'])

<SkillTreeVisualization
	{...props}
	isModuleCompleted={moduleId => completedModuleIds.has(moduleId)}
/>
```

With progress tracking enabled, the visualization distinguishes completed modules, modules ready to learn, and modules whose prerequisites are still incomplete. Without the callback, the tree uses neutral styling.


## Planning mode

Enable planning mode through the settings. Users can then select a goal module, inspect its required modules, and follow the suggested next step.

```tsx
<SkillTreeVisualization
	{...props}
	settings={{ allowPlanningMode: true }}
/>
```

Planning works without external state, but state handles can preserve it across remounts or page refreshes:

```tsx
const [isPlanningModeActive, setPlanningModeActive] = useState(false)
const [goalModuleId, setGoalModuleId] = useState<string | null>(null)
const [hasSeenPlanningIntro, setHasSeenPlanningIntro] = useState(false)

<SkillTreeVisualization
	{...props}
	settings={{ allowPlanningMode: true }}
	stateHandles={{
		planning: {
			isPlanningModeActive: [isPlanningModeActive, setPlanningModeActive],
			goalModuleId: [goalModuleId, setGoalModuleId],
			hasSeenPlanningModeIntro: [hasSeenPlanningIntro, setHasSeenPlanningIntro],
		},
	}}
/>
```

Combine planning with `isModuleCompleted` to calculate goal progress and the next incomplete module from the learner's actual progress. Without completion data, planning treats all modules as incomplete.


## Public API

The package root intentionally exposes only the construction and visualization API:

- `defineModulePositioning`
- `SkillTreeVisualization`
- `GridPosition` and `ModuleGridPositions`
- `ModulePositioning`, `ModulePositionData`, and `ModuleConnector`
- `ModulePresentation` and `ModulePresentationData`
- `IsModuleCompleted`
- `SkillTreeVisualizationProps`, `SkillTreeSettings`, and `SkillTreeStateHandles`

Rendering components, contexts, providers, styles, and explorer internals remain private implementation details.


## Internal structure

The source folders follow a one-way dependency hierarchy.

Fundamental folders provide independent building blocks:

- `positioning`: converts grid positions into drawing coordinates, connector paths, and bounds.
- `core`: provides the module tree, presentation, and processed positioning through context.
- `explorer`: provides viewport measurement, panning, zooming, focus, and coordinate visibility.

Feature folders extend those fundamentals:

- `intro`: introduces the available controls and interactions.
- `legend`: explains module types.
- `progress`: provides completion state and progress styling.
- `interaction`: tracks highlighted modules and their prerequisites across mouse and touch input.
- `planning`: manages planning mode, learning goals, goal progress, and planning overlays.

The final folders assemble the tool:

- `rendering`: renders module cards, connectors, tooltips, and their derived styles inside the drawing.
- `visualization`: combines all providers, the explorer, drawing, controls, overlays, and dialogs into the public `SkillTreeVisualization` component.
