import { type StoryProps, Conversation, SpeechBox } from '@/learning'
import { Par } from '@/ui'

export function Story({ completed }: StoryProps) {
	return <Conversation completed={completed} opening={StoryOpening} conclusion={StoryConclusion} />
}

function StoryOpening() {
	return <>
		<Par>{'Purpose: Follow up staff complaints with focused personnel extracts.'}</Par>
		<Par>{'Goal: Compare recorded values with independently supplied staff information.'}</Par>
		<SpeechBox person="paris"><Par>{'More salary, leave and travel questions have reached me. The staff have supplied their approved information, so I need focused extracts to compare it with.'}</Par></SpeechBox>
		<SpeechBox person="caesar"><Par>{'A single mistake is ordinary. Recurring disagreements across these processes are becoming harder to dismiss.'}</Par></SpeechBox>
	</>
}

function StoryConclusion() {
	return <>
		<Par>Purpose: Connect the exercise findings.</Par>
		<Par>{'Goal: Compare recorded values with independently supplied staff information.'}</Par>
		<SpeechBox person="paris"><Par>{'These differences affect real staff requests. Could the records have been mishandled during the systems work? We should establish that carefully.'}</Par></SpeechBox>
		<SpeechBox person="caesar"><Par>{'We need independent checks, not a name attached to a suspicion.'}</Par></SpeechBox>
	</>
}
