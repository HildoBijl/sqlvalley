import { type StoryProps, Conversation, SpeechBox } from '@/learning'
import { Par } from '@/ui'

export function Story({ completed }: StoryProps) {
	return <Conversation completed={completed} opening={StoryOpening} conclusion={StoryConclusion} />
}

function StoryOpening() {
	return <>
		<Par>{'Purpose: Examine the meaning of recorded deal values.'}</Par>
		<Par>{'Goal: Distinguish calculations and assumptions from real profit.'}</Par>
		<SpeechBox person="bob"><Par>{'Some recorded deal values look lower than I expected. Perhaps we should calculate what the figures imply before treating the report as a business conclusion.'}</Par></SpeechBox>
		<SpeechBox person="caesar"><Par>{'All right. Make the assumptions explicit; I don’t want an estimate presented as actual revenue.'}</Par></SpeechBox>
	</>
}

function StoryConclusion() {
	return <>
		<Par>Purpose: Connect the exercise findings.</Par>
		<Par>{'Goal: Distinguish calculations and assumptions from real profit.'}</Par>
		<SpeechBox person="bob"><Par>{'The calculations help us see the consequences of the recorded prices. We should check the source figures before deciding what they say about the marketplace.'}</Par></SpeechBox>
	</>
}
