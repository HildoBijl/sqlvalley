import { type StoryProps, Conversation, SpeechBox } from '@/learning'
import { Par } from '@/ui'

export function Story({ completed }: StoryProps) {
	return <Conversation completed={completed} opening={StoryOpening} conclusion={StoryConclusion} />
}

function StoryOpening() {
	return <>
		<Par>{'Purpose: Test the scope of the weak-looking performance reports.'}</Par>
		<Par>{'Goal: Separate recorded financial patterns from independently verified business results.'}</Par>
		<SpeechBox person="caesar"><Par>{'I want to know whether the concerning figures are isolated or part of a pattern. We also have signed quarterly close statements to compare against the reports.'}</Par></SpeechBox>
		<SpeechBox person="bob"><Par>{'We should be precise about the periods and categories. The assumptions matter.'}</Par></SpeechBox>
	</>
}

function StoryConclusion() {
	return <>
		<Par>Purpose: Connect the exercise findings.</Par>
		<Par>{'Goal: Separate recorded financial patterns from independently verified business results.'}</Par>
		<SpeechBox person="caesar"><Par>{'The selected figures conflict with the independently retained close statements. I now believe someone is interfering with these records. Why would they want the new model to look weaker?'}</Par></SpeechBox>
	</>
}
