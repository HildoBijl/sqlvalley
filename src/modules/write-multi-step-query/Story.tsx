import { type StoryProps, Conversation, SpeechBox } from '@/learning'
import { Par } from '@/ui'

export function Story({ completed }: StoryProps) {
	return <Conversation completed={completed} opening={StoryOpening} conclusion={StoryConclusion} />
}

function StoryOpening() {
	return <>
		<Par>{'Purpose: Combine earlier discrepancies with independently retained evidence.'}</Par>
		<Par>{'Goal: Identify the responsible insiders only after complete evidence chains are checked.'}</Par>
		<SpeechBox person="caesar"><Par>{'Staff administration, company money, and the case for the pivot: the apparent motives are scattered. I still cannot understand why one mole would want all of this.'}</Par></SpeechBox>
		<SpeechBox person="marcelle"><Par>{'I obtained an independently retained, signed change-log export. It records authenticated individual accounts, not just who was present. Combine those events with the business discrepancies; an unrelated edit proves nothing.'}</Par></SpeechBox>
	</>
}

function StoryConclusion() {
	return <>
		<Par>Purpose: Connect the exercise findings.</Par>
		<Par>{'Goal: Identify the responsible insiders only after complete evidence chains are checked.'}</Par>
		<SpeechBox person="caesar"><Par>{'These were separate actions by three people. That explains why the supposed single mole’s motives never fitted together.'}</Par></SpeechBox>
		<SpeechBox person="marcelle"><Par>{'Before this argument goes any further—breaking news. Exposés, raids, arrests and asset freezes across several countries. Every person named in this report is a HeriShare client.'}</Par></SpeechBox>
		<SpeechBox person="caesar"><Par>{'Those confidential client requests… who was Wheatley actually working for?'}</Par></SpeechBox>
		<SpeechBox person="marcelle"><Par>{'Epilogue: Wheatley was an operative for Glasshouse. Our client information supplied missing links in their long-running corruption investigations. Their evidence went to journalists and authorities. He deceived us, but he was not behind the sabotage, and HeriShare’s legal business was not the criminal network.'}</Par></SpeechBox>
	</>
}
