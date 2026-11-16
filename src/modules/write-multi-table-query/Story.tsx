import { type StoryProps, Conversation, SpeechBox } from '@/learning'
import { Par } from '@/ui'

export function Story({ completed }: StoryProps) {
	return <Conversation completed={completed} opening={StoryOpening} conclusion={StoryConclusion} />
}

function StoryOpening() {
	return <>
		<Par>{'Purpose: Let Wheatley retrieve client-related information under a dubious pretext.'}</Par>
		<Par>{'Goal: Connect recorded assets and transactions without suggesting criminality.'}</Par>
		<SpeechBox person="wheatley"><Par>{'I need some asset and account relationships for a confidential internal task. Routine, really. Please stick to the conditions I give you.'}</Par></SpeechBox>
	</>
}

function StoryConclusion() {
	return <>
		<Par>Purpose: Connect the exercise findings.</Par>
		<Par>{'Goal: Connect recorded assets and transactions without suggesting criminality.'}</Par>
		<SpeechBox person="wheatley"><Par>{'Excellent. The relationships and contact details complete what I needed. There’s no need to forward this conversation anywhere else.'}</Par></SpeechBox>
	</>
}
