import type { PlaceholderLine } from '@/learning/story'

interface StoryModuleDefinition {
	keys: readonly string[]
	purpose: string
	goal: string
	opening: readonly PlaceholderLine[]
	conclusion: readonly PlaceholderLine[]
}

export const storyModules = {
	'choose-columns': {
		keys: ['contacts', 'leave-fields', 'cities'], purpose: 'Introduce staff complaints through Paris’s coordination work.', goal: 'Establish what the recorded fields say without attributing an error.',
		opening: [{ person: 'paris', text: 'Staff have brought me failed notifications, leave discrepancies and travel claims assessed from unexpected locations. Could you pull the relevant fields before we try to explain them?' }, { person: 'caesar', text: 'Let’s get the facts first. This may simply be a handoff problem.' }],
		conclusion: [{ person: 'paris', text: 'The extracts give us specific records to compare with the staff’s approved information. I’ll follow up through the teams handling those requests.' }, { person: 'caesar', text: 'There are problems to address, but that does not yet tell us someone caused them deliberately.' }],
	},
	'filter-rows': {
		keys: ['department-expenses', 'amounts', 'descriptions'], purpose: 'Follow an ordinary department’s spending complaint.', goal: 'Locate requests worth reconciling without claiming payments or theft.',
		opening: [{ person: 'caesar', text: 'A department says its recorded spending includes requests it cannot reconcile with its purchase paperwork. Please isolate the relevant entries.' }, { person: 'elvis', text: 'Happy to explain the Finance fields. A request and a completed payment are different things, so let’s see what was actually recorded.' }],
		conclusion: [{ person: 'caesar', text: 'We have entries to take back to the department. I’m still allowing for bookkeeping mistakes, but the concerns deserve an answer.' }],
	},
	'sort-and-limit-rows': {
		keys: ['budgets', 'expense-pages', 'contract-endings'], purpose: 'Give Wheatley an isolated, questionable request.', goal: 'Provide ranked internal information without revealing why he wants it.',
		opening: [{ person: 'wheatley', text: 'I’m coordinating some internal reporting. Senior reporting. Could you arrange a few lists for me? The order is rather important.' }],
		conclusion: [{ person: 'wheatley', text: 'That’s the set I needed. Very useful for the internal work. I’ll take it from here.' }],
	},
	'process-columns': {
		keys: ['commissions', 'report-fields', 'price-flags'], purpose: 'Examine the meaning of recorded deal values.', goal: 'Distinguish calculations and assumptions from real profit.',
		opening: [{ person: 'bob', text: 'Some recorded deal values look lower than I expected. Perhaps we should calculate what the figures imply before treating the report as a business conclusion.' }, { person: 'caesar', text: 'All right. Make the assumptions explicit; I don’t want an estimate presented as actual revenue.' }],
		conclusion: [{ person: 'bob', text: 'The calculations help us see the consequences of the recorded prices. We should check the source figures before deciding what they say about the marketplace.' }],
	},
	'write-single-criterion-query': {
		keys: ['salary-extract', 'leave-extract', 'travel-extract'], purpose: 'Follow up staff complaints with focused personnel extracts.', goal: 'Compare recorded values with independently supplied staff information.',
		opening: [{ person: 'paris', text: 'More salary, leave and travel questions have reached me. The staff have supplied their approved information, so I need focused extracts to compare it with.' }, { person: 'caesar', text: 'A single mistake is ordinary. Recurring disagreements across these processes are becoming harder to dismiss.' }],
		conclusion: [{ person: 'paris', text: 'These differences affect real staff requests. Could the records have been mishandled during the systems work? We should establish that carefully.' }, { person: 'caesar', text: 'We need independent checks, not a name attached to a suspicion.' }],
	},
	'filter-rows-on-multiple-criteria': {
		keys: ['expense-periods', 'expense-ranges', 'approval-conditions'], purpose: 'Narrow the department’s disputed expense entries.', goal: 'Find a repeatable record pattern without equating it to a payment.',
		opening: [{ person: 'caesar', text: 'The department has followed up: its paperwork still does not match the expense list. Please narrow the entries by the period, service and approval details they supplied.' }],
		conclusion: [{ person: 'caesar', text: 'These are specific, repeatable discrepancies. I’m concerned this is more than a display issue, although we still need to establish what happened.' }],
	},
	'write-single-table-query': {
		keys: ['selected-sales', 'sale-estimates', 'sale-shortlists'], purpose: 'Examine weak-looking commercial reports in detail.', goal: 'Avoid interpreting a selected report as proof the pivot is failing.',
		opening: [{ person: 'caesar', text: 'The recorded sale figures have raised questions. Give us a properly scoped report before we discuss it with leadership.' }, { person: 'bob', text: 'Yes. A subset can be misleading, and I’d rather be sure about what the numbers actually show.' }],
		conclusion: [{ person: 'caesar', text: 'The reported outcomes need verification. I’m not prepared to decide the business is failing on these extracts alone.' }, { person: 'bob', text: 'That seems sensible. We should compare the underlying records as well.' }],
	},
	'write-lookup-query': {
		keys: ['requesters', 'cost-centres', 'approvers'], purpose: 'Connect a disputed expense to its recorded responsibilities.', goal: 'Distinguish a listed requester or approver from the person who entered a record.',
		opening: [{ person: 'caesar', text: 'A department cannot match these requests to the purchase or approval it expected. Please identify the people and cost centres listed in the records.' }],
		conclusion: [{ person: 'caesar', text: 'We can ask precise questions now. The names in those fields are recorded responsibilities, not evidence of who created the entries.' }],
	},
	'join-tables': {
		keys: ['salary-comparison', 'leave-comparison', 'allocation-handoffs'], purpose: 'Compare records behind staff-facing failures.', goal: 'Establish discrepancies while keeping blame provisional.',
		opening: [{ person: 'paris', text: 'Staff are disputing information used for payroll, leave and departmental handoffs. We need to compare the linked records rather than looking at each in isolation.' }, { person: 'caesar', text: 'Between these complaints and the Finance questions, I’m taking deliberate interference seriously. Show me the comparisons.' }],
		conclusion: [{ person: 'paris', text: 'The linked records disagree with the approved information in ways that make the systems work look unreliable.' }, { person: 'caesar', text: 'That is a concern, but someone could also be making the work look unreliable. We must establish who changed what.' }],
	},
	'write-multi-table-query': {
		keys: ['asset-sales', 'universal-sales', 'client-details'], purpose: 'Let Wheatley retrieve client-related information under a dubious pretext.', goal: 'Connect recorded assets and transactions without suggesting criminality.',
		opening: [{ person: 'wheatley', text: 'I need some asset and account relationships for a confidential internal task. Routine, really. Please stick to the conditions I give you.' }],
		conclusion: [{ person: 'wheatley', text: 'Excellent. The relationships and contact details complete what I needed. There’s no need to forward this conversation anywhere else.' }],
	},
	'aggregate-columns': {
		keys: ['status-counts', 'quarter-totals', 'expense-statistics'], purpose: 'Supply Wheatley with another isolated set of internal summaries.', goal: 'Summarize stored activity without identifying a client or an editor.',
		opening: [{ person: 'wheatley', text: 'A few summaries would help with my internal brief. Counts and totals, please. I don’t need a long discussion of the individual records.' }],
		conclusion: [{ person: 'wheatley', text: 'That gives me a useful picture of the activity. Thanks. I have some other work to do now.' }],
	},
	'write-filtered-aggregation-query': {
		keys: ['category-results', 'shortfalls', 'quarter-comparisons'], purpose: 'Test the scope of the weak-looking performance reports.', goal: 'Separate recorded financial patterns from independently verified business results.',
		opening: [{ person: 'caesar', text: 'I want to know whether the concerning figures are isolated or part of a pattern. We also have signed quarterly close statements to compare against the reports.' }, { person: 'bob', text: 'We should be precise about the periods and categories. The assumptions matter.' }],
		conclusion: [{ person: 'caesar', text: 'The selected figures conflict with the independently retained close statements. I now believe someone is interfering with these records. Why would they want the new model to look weaker?' }],
	},
	'write-multi-step-query': {
		keys: ['commercial-attribution', 'personnel-attribution', 'expense-attribution'], purpose: 'Combine earlier discrepancies with independently retained evidence.', goal: 'Identify the responsible insiders only after complete evidence chains are checked.',
		opening: [{ person: 'caesar', text: 'Staff administration, company money, and the case for the pivot: the apparent motives are scattered. I still cannot understand why one mole would want all of this.' }, { person: 'marcelle', text: 'I obtained an independently retained, signed change-log export. It records authenticated individual accounts, not just who was present. Combine those events with the business discrepancies; an unrelated edit proves nothing.' }],
		conclusion: [{ person: 'caesar', text: 'These were separate actions by three people. That explains why the supposed single mole’s motives never fitted together.' }, { person: 'marcelle', text: 'Before this argument goes any further—breaking news. Exposés, raids, arrests and asset freezes across several countries. Every person named in this report is a HeriShare client.' }, { person: 'caesar', text: 'Those confidential client requests… who was Wheatley actually working for?' }, { person: 'marcelle', text: 'Epilogue: Wheatley was an operative for Glasshouse. Our client information supplied missing links in their long-running corruption investigations. Their evidence went to journalists and authorities. He deceived us, but he was not behind the sabotage, and HeriShare’s legal business was not the criminal network.' }],
	},
} satisfies Record<string, StoryModuleDefinition>

export type StoryModuleId = keyof typeof storyModules
export const STORY_EXERCISE_VERSION = 1
export function isStoryModuleId(value: string): value is StoryModuleId { return Object.prototype.hasOwnProperty.call(storyModules, value) }
export const storyExerciseId = (moduleId: StoryModuleId, key: string) => `story-${moduleId}-${key}`
