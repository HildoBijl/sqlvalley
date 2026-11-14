import type { ComparisonOptions } from '@sqlvalley/sql-grading'
import { SQLDisplay } from '@sqlvalley/sql'
import { defineSQLMonoExercise } from '@sqlvalley/sql-exercises'

import { type CharacterId, PlaceholderDialogue } from '@/learning/story'
import { type StoryModuleId, STORY_EXERCISE_VERSION, storyExerciseId, storyModules } from './storyModules'

export interface StoryVariant {
	problem: string
	query: string
	evidence: string
	payoff: string
}

export interface StoryExerciseSpec {
	moduleId: StoryModuleId
	key: string
	purpose: string
	goal: string
	person: CharacterId
	variants: readonly StoryVariant[]
	comparisonOptions?: ComparisonOptions
	explanation: string
}

export function defineStoryExercise(spec: StoryExerciseSpec) {
	if (!storyModules[spec.moduleId].keys.some(key => key === spec.key)) throw new Error('Unknown story exercise key.')
	if (spec.variants.length < 2) throw new Error('A procedural story exercise needs at least two variants.')
	const getVariant = (index: number) => {
		if (!Number.isSafeInteger(index) || !spec.variants[index]) throw new Error('Outdated exercise choice. Regenerate this exercise.')
		return spec.variants[index]
	}
	const exercise = defineSQLMonoExercise({
		exerciseId: storyExerciseId(spec.moduleId, spec.key),
		definition: {
			metadata: { version: STORY_EXERCISE_VERSION },
			generateParameters: () => ({ variant: Math.floor(Math.random() * spec.variants.length) }),
			getSolution: ({ parameters }) => ({ query: getVariant(parameters.variant).query }),
			comparisonOptions: spec.comparisonOptions,
		},
		component: {
			Problem: ({ parameters }) => {
				const variant = getVariant(parameters.variant)
				return <><p>{variant.problem}</p><p><strong>Case reference: </strong>{variant.evidence}</p></>
			},
			Prompt: ({ parameters }) => <PlaceholderDialogue purpose={spec.purpose} goal={spec.goal} lines={[{ person: spec.person, text: `${getVariant(parameters.variant).evidence} ${getVariant(parameters.variant).problem}` }]} />,
			Payoff: ({ parameters }) => <PlaceholderDialogue purpose="Interpret the result and distinguish evidence from attribution." goal={spec.goal} lines={[{ person: spec.person, text: getVariant(parameters.variant).payoff }]} />,
			Solution: ({ parameters }) => <><p>{spec.explanation}</p><SQLDisplay>{getVariant(parameters.variant).query}</SQLDisplay><p>Other queries are accepted when they return the required result.</p></>,
		},
	})
	return { ...exercise, story: spec }
}
