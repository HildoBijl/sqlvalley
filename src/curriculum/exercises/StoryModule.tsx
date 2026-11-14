import type { StoryProps } from '@/learning'
import { PlaceholderDialogue } from '@/learning/story'

import { type StoryModuleId, storyModules } from './storyModules'

export function StoryModule({ moduleId, completed, part }: StoryProps & { moduleId: StoryModuleId }) {
	const script = storyModules[moduleId]
	return <>
		{part !== 'conclusion' ? <PlaceholderDialogue purpose={script.purpose} goal={script.goal} lines={script.opening} /> : null}
		{part !== 'opening' && completed ? <PlaceholderDialogue purpose="Connect the three completed investigations." goal={script.goal} lines={script.conclusion} /> : null}
		{part === undefined && !completed ? <p>Successfully solve each of this module’s three exercise families to reveal the conclusion.</p> : null}
	</>
}
