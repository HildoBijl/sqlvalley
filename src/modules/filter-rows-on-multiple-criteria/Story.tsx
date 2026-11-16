import { type StoryProps, Conversation, SpeechBox } from '@/learning'
import { Par } from '@/ui'

export function Story({ completed }: StoryProps) {
	return <Conversation completed={completed} opening={StoryOpening} conclusion={StoryConclusion} />
}

function StoryOpening() {
	return <>
		<Par>{'Purpose: Narrow the department’s disputed expense entries.'}</Par>
		<Par>{'Goal: Find a repeatable record pattern without equating it to a payment.'}</Par>
		<SpeechBox person="caesar"><Par>{'The department has followed up: its paperwork still does not match the expense list. Please narrow the entries by the period, service and approval details they supplied.'}</Par></SpeechBox>
	</>
}

function StoryConclusion() {
	return <>
		<Par>Purpose: Connect the exercise findings.</Par>
		<Par>{'Goal: Find a repeatable record pattern without equating it to a payment.'}</Par>
		<SpeechBox person="caesar"><Par>{'These are specific, repeatable discrepancies. I’m concerned this is more than a display issue, although we still need to establish what happened.'}</Par></SpeechBox>
	</>
}
