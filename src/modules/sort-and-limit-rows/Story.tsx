import { type StoryProps, Conversation, SpeechBox } from '@/learning'
import { Par } from '@/ui'

export function Story({ completed }: StoryProps) {
	return <Conversation completed={completed} opening={StoryOpening} conclusion={StoryConclusion} />
}

function StoryOpening() {
	return <>
		<Par>{'Purpose: Give Wheatley an isolated, questionable request.'}</Par>
		<Par>{'Goal: Provide ranked internal information without revealing why he wants it.'}</Par>
		<SpeechBox person="wheatley"><Par>{'I’m coordinating some internal reporting. Senior reporting. Could you arrange a few lists for me? The order is rather important.'}</Par></SpeechBox>
	</>
}

function StoryConclusion() {
	return <>
		<Par>Purpose: Connect the exercise findings.</Par>
		<Par>{'Goal: Provide ranked internal information without revealing why he wants it.'}</Par>
		<SpeechBox person="wheatley"><Par>{'That’s the set I needed. Very useful for the internal work. I’ll take it from here.'}</Par></SpeechBox>
	</>
}
