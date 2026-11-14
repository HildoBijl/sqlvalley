import type { StoryProps } from '@/learning'
import { StoryModule } from '@/curriculum/exercises'

export function Story(props: StoryProps) {
	return <StoryModule moduleId="write-single-table-query" {...props} />
}
