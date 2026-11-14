import type { StoryProps } from '@/learning'
import { StoryModule } from '@/curriculum/exercises'

export function Story(props: StoryProps) {
	return <StoryModule moduleId="filter-rows-on-multiple-criteria" {...props} />
}
