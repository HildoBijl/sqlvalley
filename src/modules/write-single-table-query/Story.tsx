import { type StoryProps, Conversation, SpeechBox } from '@/learning'
import { Par } from '@/ui'

export function Story({ completed }: StoryProps) {
	return <Conversation completed={completed} opening={StoryOpening} conclusion={StoryConclusion} />
}

function StoryOpening() {
	return <>
		<Par>{'Purpose: Examine weak-looking commercial reports in detail.'}</Par>
		<Par>{'Goal: Avoid interpreting a selected report as proof the pivot is failing.'}</Par>
		<SpeechBox person="caesar"><Par>{'The recorded sale figures have raised questions. Give us a properly scoped report before we discuss it with leadership.'}</Par></SpeechBox>
		<SpeechBox person="bob"><Par>{'Yes. A subset can be misleading, and I’d rather be sure about what the numbers actually show.'}</Par></SpeechBox>
	</>
}

function StoryConclusion() {
	return <>
		<Par>Purpose: Connect the exercise findings.</Par>
		<Par>{'Goal: Avoid interpreting a selected report as proof the pivot is failing.'}</Par>
		<SpeechBox person="caesar"><Par>{'The reported outcomes need verification. I’m not prepared to decide the business is failing on these extracts alone.'}</Par></SpeechBox>
		<SpeechBox person="bob"><Par>{'That seems sensible. We should compare the underlying records as well.'}</Par></SpeechBox>
	</>
}
