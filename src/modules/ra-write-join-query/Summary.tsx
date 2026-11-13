import { Page, Section, Par, Term } from '@/ui'
import { IRA, RelationName, RAQueryFigure } from '@/learning'

export function Summary() {
	return <Page>
		<Section>
			<Par>There are a lot of possibilities when joining relations, like joining together three or more relations, or joining relations with themselves.</Par>
			<Par>To <Term>join three or more relations</Term> together, we take the exact same steps as we do when joining two relations. We could for instance find the departments whose manager now earns more than 50% more than what they earned in a previous contract.</Par>
			<RAQueryFigure query={<>∏<sub>d_name</sub>(σ<sub>current_salary &gt; 1.5*salary</sub>(ρ<sub>manager_id→e_id</sub>(departments) ⋈ employees ⋈ contracts))</>} actualQuery="SELECT DISTINCT departments.d_name FROM departments JOIN employees ON departments.manager_id=employees.e_id JOIN contracts ON employees.e_id=contracts.e_id WHERE employees.current_salary > 1.5*contracts.salary" tableWidth={200} tableScale={0.8} />
			<Par>It is also possible to <Term>join a relation with itself</Term>. This is commonly used when we need to compare pairs of tuples from the same relation. We could for instance find all employees (their IDs) who have had contracts for at least two different positions. To do so, we join the <RelationName>contracts</RelationName> relation with itself to find all pairs of contracts from the same person but for different positions.</Par>
			<RAQueryFigure query={<>∏<sub>e_id</sub>(σ<sub>contracts.e_id = c2.e_id ∧ contracts.position ≠ c2.position</sub>(contracts ⨯ ρ<sub>c2</sub>(contracts)))</>} actualQuery="SELECT DISTINCT c1.e_id FROM contracts c1, contracts c2 WHERE c1.e_id = c2.e_id AND c1.position <> c2.position" tableWidth={120} tableScale={0.8} />
			<Par>In this latter case, when we compare a relation with itself, we need a <Term>table rename</Term> to make the attribute references work. A table rename is done through <IRA>ρ<sub>c2</sub>(contracts)</IRA>, which temporarily (only within this query) renames the second <RelationName>contracts</RelationName> relation as <RelationName>c2</RelationName>.</Par>
		</Section>
	</Page>
}
