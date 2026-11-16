import { type StoryProps, Conversation, SpeechBox } from '@/learning'
import { Par } from '@/ui'

export function Story({ completed }: StoryProps) {
	return <Conversation completed={completed} opening={StoryOpening} conclusion={StoryConclusion} />
}

function StoryOpening() {
	return <>
		<Par>{'Purpose: Supply Wheatley with another isolated set of internal summaries.'}</Par>
		<Par>{'Goal: Summarize stored activity without identifying a client or an editor.'}</Par>
		<SpeechBox person="wheatley"><Par>{'A few summaries would help with my internal brief. Counts and totals, please. I don’t need a long discussion of the individual records.'}</Par></SpeechBox>
	</>
}

function StoryConclusion() {
	return <>
		<Par>Purpose: Connect the exercise findings.</Par>
		<Par>{'Goal: Summarize stored activity without identifying a client or an editor.'}</Par>
		<SpeechBox person="wheatley"><Par>{'That gives me a useful picture of the activity. Thanks. I have some other work to do now.'}</Par></SpeechBox>
	</>
}
