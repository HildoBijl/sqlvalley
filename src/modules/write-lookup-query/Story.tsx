import { type StoryProps, Conversation, SpeechBox } from '@/learning'
import { Par } from '@/ui'

export function Story({ completed }: StoryProps) {
	return <Conversation completed={completed} opening={StoryOpening} conclusion={StoryConclusion} />
}

function StoryOpening() {
	return <>
		<Par>{'Purpose: Connect a disputed expense to its recorded responsibilities.'}</Par>
		<Par>{'Goal: Distinguish a listed requester or approver from the person who entered a record.'}</Par>
		<SpeechBox person="caesar"><Par>{'A department cannot match these requests to the purchase or approval it expected. Please identify the people and cost centres listed in the records.'}</Par></SpeechBox>
	</>
}

function StoryConclusion() {
	return <>
		<Par>Purpose: Connect the exercise findings.</Par>
		<Par>{'Goal: Distinguish a listed requester or approver from the person who entered a record.'}</Par>
		<SpeechBox person="caesar"><Par>{'We can ask precise questions now. The names in those fields are recorded responsibilities, not evidence of who created the entries.'}</Par></SpeechBox>
	</>
}
