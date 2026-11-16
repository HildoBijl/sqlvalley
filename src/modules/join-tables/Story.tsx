import { type StoryProps, Conversation, SpeechBox } from '@/learning'
import { Par } from '@/ui'

export function Story({ completed }: StoryProps) {
	return <Conversation completed={completed} opening={StoryOpening} conclusion={StoryConclusion} />
}

function StoryOpening() {
	return <>
		<Par>{'Purpose: Compare records behind staff-facing failures.'}</Par>
		<Par>{'Goal: Establish discrepancies while keeping blame provisional.'}</Par>
		<SpeechBox person="paris"><Par>{'Staff are disputing information used for payroll, leave and departmental handoffs. We need to compare the linked records rather than looking at each in isolation.'}</Par></SpeechBox>
		<SpeechBox person="caesar"><Par>{'Between these complaints and the Finance questions, I’m taking deliberate interference seriously. Show me the comparisons.'}</Par></SpeechBox>
	</>
}

function StoryConclusion() {
	return <>
		<Par>Purpose: Connect the exercise findings.</Par>
		<Par>{'Goal: Establish discrepancies while keeping blame provisional.'}</Par>
		<SpeechBox person="paris"><Par>{'The linked records disagree with the approved information in ways that make the systems work look unreliable.'}</Par></SpeechBox>
		<SpeechBox person="caesar"><Par>{'That is a concern, but someone could also be making the work look unreliable. We must establish who changed what.'}</Par></SpeechBox>
	</>
}
