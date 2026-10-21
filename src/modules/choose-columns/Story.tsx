import { Par } from '@/ui'
import { type StoryProps, Conversation, SpeechBox } from '@/learning'

export function Story({ completed }: StoryProps) {
	return <Conversation completed={completed} opening={Opening} conclusion={Conclusion} />
}

function Opening() {
	return <>
		<SpeechBox person="paris">
			<Par>You must be the data engineering intern Marcelle was supposed to onboard. I’m Paris Morgan—I coordinate strategy, corporate affairs, and more internal handoffs than anyone should admit to.</Par>
			<Par>I could use your help. My department has had travel questions that do not match our staff locations, employees whose payroll records seem incomplete, and internal reports whose labels disagree with the source tables.</Par>
			<Par>Before anyone starts correcting records, I need clean extracts of the relevant columns. Let’s establish what the database actually says.</Par>
		</SpeechBox>
	</>
}

function Conclusion() {
	return <>
		<SpeechBox person="paris">
			<Par>So I wasn’t imagining it. Ordinary company information is incomplete or inconsistent in places, and those errors are already interfering with real work.</Par>
			<Par>We still don’t know whether this is careless entry, a migration problem, or something deliberate. I’ll arrange for the records we found to be corrected. For now, keep a note of every mismatch—you may be the first person seeing the pattern.</Par>
		</SpeechBox>
	</>
}

export default Story
