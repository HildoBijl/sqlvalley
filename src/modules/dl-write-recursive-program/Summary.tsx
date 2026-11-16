import { Page, Section, Par, List, Info, Term, Em } from '@/ui'

export function Summary() {
	return <Page>
		<Section>
			<Par>If you have a complicated data request that requires recursion in its execution, there are generally four steps to take to write a functioning Datalog program.</Par>
			<List useNumbers items={[
				<><Term>Simplify the situation</Term>: Already apply relevant filters where possible, and remove unnecessary predicate arguments. In this way, we can set up several small and easy-to-use predicates to support the next steps.</>,
				<><Term>Apply recursion</Term>: Set up the required recursive predicates. If a counter is needed, make sure it cannot increase indefinitely. For example, require strictly increasing timestamps over a finite set of transactions. Returning to an earlier person is fine, as long as the same transactions cannot be reused indefinitely.</>,
				<><Term>Answer the question</Term>: Use the recursive predicates, and set up even more predicates, such that you eventually deliver <Em>exactly</Em> the data that was requested. Don't forget to add the query.</>,
				<><Term>Check your program</Term>: Make sure that all your rules are safe. If there is an (unsafe) recursion counter, check that it is guaranteed to terminate. Also sketch a quick dependency graph to ensure that your program is stratified. Finally, make sure that the output answers the original question.</>,
			]} />
			<Info>Being skilled at writing Datalog programs requires experience. Just write lots of programs. So go forth and practice!</Info>
		</Section>
	</Page>
}
