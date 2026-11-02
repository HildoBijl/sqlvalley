
import { Page, Section, Par, List, Term, Em } from '@/ui'
import { DatalogTypeVennDiagram } from './Theory'

export function Summary() {
	return <Page>
		<Section>
			<Par>A <Term>model</Term> is a set of facts such that <Em>all</Em> rules of a Datalog program hold true. Positive Datalog has a unique least model, although other models may satisfy the rules. Negation with recursion requires care because there may be several stable outcomes.</Par>
			<Par>To obtain a well-defined intended result, we must limit the use of negation. There are three options.</Par>
			<List items={[
				<>In <Term>positive Datalog</Term> negation may not be used at all.</>,
				<>In <Term>semi-positive Datalog</Term> negation may only be applied to the original database tables: the EDBs.</>,
				<>In <Term>stratified Datalog</Term> negation may not appear in any dependency cycle. In other words, if you draw the predicate dependency graph and mark negative dependencies with a minus sign, there may not be a cycle containing a minus sign.</>,
			]} />
			<Par>Positive Datalog has a unique least model. Semi-positive and stratified programs have a unique intended result under stratified semantics. With the original database fixed, positive and semi-positive rule evaluation is monotonic in derived facts: adding facts does not invalidate earlier consequences. With negation, however, adding facts to the original database may remove query answers. Stratified programs are evaluated one stratum at a time.</Par>
			<DatalogTypeVennDiagram />
		</Section>
	</Page>
}
