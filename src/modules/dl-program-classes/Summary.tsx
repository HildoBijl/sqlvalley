
import { Page, Section, Par, List, Term, Em } from '@/ui'
import { DatalogTypeVennDiagram } from './Theory'

export function Summary() {
	return <Page>
		<Section>
			<Par>A <Term>model</Term> is a set of facts such that <Em>all</Em> rules of a Datalog program hold true. Usually Datalog programs have a single unique model, but when we mix negation with recursion, we run the risk of having multiple possible models.</Par>
			<Par>To prevent getting multiple models, we must limit the use of negation. There are three options.</Par>
			<List items={[
				<>In <Term>positive Datalog</Term> negation may not be used at all.</>,
				<>In <Term>semi-positive Datalog</Term> negation may only be applied to the original database tables: the EDBs.</>,
				<>In <Term>stratified Datalog</Term> negation may not appear in any dependency cycle. In other words, if you draw the predicate dependency graph and mark negative dependencies with a minus sign, there may not be a cycle containing a minus sign.</>,
			]} />
			<Par>All of the three categories (positive/semi-positive/stratified) guarantee a <Term>unique model</Term>. On top of that, positive and semi-positive Datalog programs are <Term>monotonic</Term>: while evaluating the program, the set of known facts can only grow. This property makes monotonic programs relatively easy to compute.</Par>
			<DatalogTypeVennDiagram />
		</Section>
	</Page>
}
