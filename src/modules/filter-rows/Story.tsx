import { type StoryProps, Conversation, SpeechBox } from '@/learning'
import { Par } from '@/ui'

export function Story({ completed }: StoryProps) {
	return <Conversation completed={completed} opening={StoryOpening} conclusion={StoryConclusion} />
}

function StoryOpening() {
	return <>
		<Opening />
		<Par>{'Purpose: Follow an ordinary department’s spending complaint.'}</Par>
		<Par>{'Goal: Locate requests worth reconciling without claiming payments or theft.'}</Par>
		<SpeechBox person="caesar"><Par>{'A department says its recorded spending includes requests it cannot reconcile with its purchase paperwork. Please isolate the relevant entries.'}</Par></SpeechBox>
		<SpeechBox person="elvis"><Par>{'Happy to explain the Finance fields. A request and a completed payment are different things, so let’s see what was actually recorded.'}</Par></SpeechBox>
	</>
}

function StoryConclusion() {
	return <>
		<Conclusion />
		<Par>Purpose: Connect the exercise findings.</Par>
		<Par>{'Goal: Locate requests worth reconciling without claiming payments or theft.'}</Par>
		<SpeechBox person="caesar"><Par>{'We have entries to take back to the department. I’m still allowing for bookkeeping mistakes, but the concerns deserve an answer.'}</Par></SpeechBox>
	</>
}

function Opening() {
	return <>
		<SpeechBox person="anna">
			<Par>Bob, could you help me find our active contracts? This list includes expired contracts too, and checking every row by hand will take ages.</Par>
		</SpeechBox>
		<SpeechBox person="bob" picturePosition="right">
			<Par>We can ask the database to show only the rows we need. Each contract has a status, so we can use that to select the active ones.</Par>
		</SpeechBox>
		<SpeechBox person="carl">
			<Par>And could we find contracts for a particular position? I'd like to review those next.</Par>
		</SpeechBox>
		<SpeechBox person="bob" picturePosition="right">
			<Par>Certainly! Let's learn how to filter rows with a WHERE clause. Then we can answer both questions.</Par>
		</SpeechBox>
	</>
}

function Conclusion() {
	return <>
		<SpeechBox person="anna">
			<Par>That's much easier to read! Now we can find the active contracts without searching through the entire table.</Par>
		</SpeechBox>
		<SpeechBox person="bob" picturePosition="right">
			<Par>Exactly. The WHERE clause keeps the rows that match our condition. We can filter by status, position, dates, or amounts.</Par>
		</SpeechBox>
		<SpeechBox person="carl">
			<Par>Thanks! I'll use that to find the contracts for the position I'm reviewing.</Par>
		</SpeechBox>
	</>
}
