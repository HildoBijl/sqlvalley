import { Page, Section, Par, List, Warning, Em, Term } from '@/ui'
import { DL, IDL, TableQueryFigure } from '@/learning'

export function Theory() {
	return <Page>
		<Section>
			<Par>We know how to write safe Datalog programs with the <IDL>not</IDL> keyword. We can set up recursive predicates. We can check if our program is stratified and hence is guaranteed to have a unique intended model under stratified semantics. Let's bring all these skills together to tackle some very complex data requests.</Par>
		</Section>

		<Section title="Step 1: Simplify the situation">
			<Par>Let's come up with a tricky data request for the SQL Valley database. For an audit of non-painting collectibles, we want to find products that passed through <Em>at least two completed transactions</Em> in chronological order. We want the name of each product, together with the usernames of the original vendor and final buyer in the chain. How could we do so?</Par>
			<Par>The first step in tackling a complicated data request like this is to define predicates that <Term>simplify the situation</Term>.</Par>
			<List items={[
				<>Apply respective filters where possible.</>,
				<>Remove arguments that we don't need.</>,
			]} />
			<Par>This should give us various small easy-to-use predicates.</Par>
			<Par>In the example case, we first identify the paintings so we can exclude them from our audit. We extract their product IDs.</Par>
			<DL>{`
painting(p) :- product(p, _, 'PAINTING', _, _, _).
`}</DL>
			<Par>Using this predicate, we can find all eligible transactions: completed sales of products that are not paintings. We only take those arguments that we'll need later on.</Par>
			<DL>{`
eligibleTransaction(v, b, pid, d) :-
	transaction(_, v, b, pid, d, _, _, 'COMPLETED'),
	not painting(pid).
`}</DL>
			<Par>This gives us the vendor, buyer, product ID and timestamp of each eligible transaction. It's a really useful starting point!</Par>
		</Section>

		<Section title="Step 2: Set up the recursive predicate(s)">
			<Par>With our new set of clean-and-simple predicates, we can <Term>apply recursion</Term>. First we could set up a recursive predicate without a counter. This predicate tracks which vendor transferred ownership of which product to which buyer, either directly or indirectly.</Par>
			<DL>{`
transferredProduct(v, b, p) :- eligibleTransaction(v, b, p, _).
transferredProduct(v, b, p) :-
	transferredProduct(v, x, p),
	eligibleTransaction(x, b, p, _).
`}</DL>
			<Par>This tracks connections, but it does not yet enforce chronological order or count the transactions. To distinguish chains with <Em>at least two</Em> transactions from direct sales, we first add a counter. We could change the above rules to</Par>
			<DL>{`
transferredProduct(v, b, p, 1) :- eligibleTransaction(v, b, p, _).
transferredProduct(v, b, p, n) :-
	transferredProduct(v, x, p, m),
	eligibleTransaction(x, b, p, _),
	n = m + 1.
`}</DL>
			<Par>However, this program could get stuck in an infinite loop if the data contains a cycle. For example, if A sold a product to B, and B sold it back to A, these rules would reuse those same transactions to derive chains of two, four, six, eight, etcetera steps. The counter would keep on increasing!</Par>
			<Warning>When recursion generates new counter values, make sure the counter cannot increase indefinitely. For example, bound the counter or ensure in some way that links in the chain are not reused.</Warning>
			<Par>We already want transactions to occur in chronological order, and we have a <Em>timestamp</Em> argument. If every sale in a chain must be <Em>strictly later</Em> than the previous one, we cannot reuse a transaction. With finitely many transactions, chains therefore have a finite length. A product may still return to an earlier owner; what we prevent is repeatedly traversing the same transactions.</Par>
			<Par>To implement this idea into our recursion, we add the "timestamp of the last sale" to the recursive predicate.</Par>
			<DL>{`
transferredProduct(v, b, p, 1, d) :- eligibleTransaction(v, b, p, d).
transferredProduct(v, b, p, n, d2) :-
	transferredProduct(v, x, p, m, d1),
	eligibleTransaction(x, b, p, d2),
	n = m + 1,
	d1 < d2.
`}</DL>
			<Par>This successfully sets up the recursive predicate. It now finds all chains of people who sold a product to one another through eligible transactions, where each transaction occurred <Em>after</Em> the previous transaction.</Par>
		</Section>

		<Section title="Step 3: Add more predicates to obtain the final result">
			<Par>The next step is to use the recursive predicate to <Term>answer the actual question</Term>. In our case, we want products with a chain of at least two completed sales, together with the original vendor and final buyer in that chain. This is given by the following rule.</Par>
			<DL>{`resoldProduct(p, v, b) :- transferredProduct(v, b, p, n, _), n >= 2.`}</DL>
			<Par>We keep both endpoints of the chain and require at least two transactions. The last timestamp is no longer relevant to the output. With this, we are done!</Par>
			<Warning>It's a common mistake to forget which output was actually requested.</Warning>
			<Par>Actually we're not done. We had to find the <Em>usernames</Em> of the original vendor and final buyer (we have those) and the <Em>name</Em> of the product (we don't have that one). We only have the product ID available for the product, so we still have to join in the product name.</Par>
			<DL>{`resoldProductName(name, v, b) :- resoldProduct(p, v, b), product(p, name, _, _, _, _).`}</DL>
			<Par>Finally, we have to make sure this predicate is generated and given as output. We set up the final query with sensible argument names.</Par>
			<DL>{`?- resoldProductName(productName, originalVendor, finalBuyer).`}</DL>
			<Par>For the small example dataset, this gives the following result.</Par>
			<TableQueryFigure query={`WITH RECURSIVE
eligible_transaction AS (
	SELECT vendor, buyer, prod_id, date_time
	FROM transactions
	WHERE status = 'COMPLETED'
		AND prod_id NOT IN (SELECT p_id FROM products WHERE category = 'PAINTING')
),
transferred_product(original_vendor, final_buyer, prod_id, num_transactions, last_date) AS (
	SELECT vendor, buyer, prod_id, 1, date_time
	FROM eligible_transaction
	UNION
	SELECT chain.original_vendor, sale.buyer, chain.prod_id, chain.num_transactions + 1, sale.date_time
	FROM transferred_product chain
	JOIN eligible_transaction sale ON chain.final_buyer = sale.vendor AND chain.prod_id = sale.prod_id
	WHERE chain.last_date < sale.date_time
)
SELECT DISTINCT p.name AS productName, chain.original_vendor AS originalVendor, chain.final_buyer AS finalBuyer
FROM transferred_product chain
JOIN products p ON chain.prod_id = p.p_id
WHERE chain.num_transactions >= 2;`} tableWidth={700} />
			<Par>And with that we are done! Well, almost...</Par>
		</Section>

		<Section title="Step 4: Run final checks on safety, stratification and termination">
			<Par>After the program has been written, the work is not over. It's very easy to slip up and make a mistake, so always <Term>check your program</Term>.</Par>
			<List items={[
				<>Check for <Term>safety</Term>: are all the rules safe? Are there no unbound variables? Also check that recursion is properly bounded.</>,
				<>Check for <Term>stratification</Term>: make a quick sketch of the dependency diagram. Are all the cycles that appear in your program free of negative dependencies?</>,
			]} />
			<Par>If your program meets these checks, it's a good sign that it's well-formed.</Par>
			<Par>For our example, gathering everything we have written, we can assemble the full Datalog program.</Par>
			<DL>{`
painting(p) :- product(p, _, 'PAINTING', _, _, _).
eligibleTransaction(v, b, pid, d) :-
	transaction(_, v, b, pid, d, _, _, 'COMPLETED'),
	not painting(pid).
transferredProduct(v, b, p, 1, d) :- eligibleTransaction(v, b, p, d).
transferredProduct(v, b, p, n, d2) :-
	transferredProduct(v, x, p, m, d1),
	eligibleTransaction(x, b, p, d2),
	n = m + 1,
	d1 < d2.
resoldProduct(p, v, b) :- transferredProduct(v, b, p, n, _), n >= 2.
resoldProductName(name, v, b) :- resoldProduct(p, v, b), product(p, name, _, _, _, _).
?- resoldProductName(productName, originalVendor, finalBuyer).
`}</DL>
			<Par>To check for safety, we walk through all the rules and check if there are any potential causes that a rule may not be safe.</Par>
			<List items={[
				<>Rule 2 has <IDL>not painting(pid)</IDL> which looks risky, but <IDL>pid</IDL> is already defined through <IDL>transaction</IDL>.</>,
				<>Rule 4 contains <IDL>{`d1 < d2`}</IDL> which is arithmetic, but both <IDL>d1</IDL> and <IDL>d2</IDL> are bound by positive non-arithmetic literals.</>,
				<>Rule 5 contains <IDL>{`n >= 2`}</IDL> which may be unsafe, but <IDL>n</IDL> comes directly from <IDL>transferredProduct</IDL>.</>,
			]} />
			<Par>Only the literal <IDL>n = m + 1</IDL> from rule 4 causes an unsafe rule: <IDL>n</IDL> does not follow from a non-arithmetic literal. However, this is a recursion counter, and since we have guaranteed that there are no cycles in the recursion by comparing timestamps, this is considered acceptable.</Par>
			<Par>To check for stratification, we can draw a quick dependency diagram. In this case that's a bit overkill though: the only cycle that appears is the one where <IDL>transferredProduct</IDL> refers to itself. This is done through a <Em>positive</Em> dependency, so there is certainly no cycle with a negative dependency in it. Everything is in order: the program is stratified.</Par>
			<Par>And with that we now <Em>are</Em> done. (Yes, really.) We have seen all the steps involved in writing recursive Datalog programs and are ready to put them into practice.</Par>
		</Section>
	</Page>
}
