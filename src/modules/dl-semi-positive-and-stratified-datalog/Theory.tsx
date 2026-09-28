import { type ReactNode } from 'react';
import { useTheme } from '@mui/material';

import { type DrawingData, useRefWithValue, Drawing, Element, Curve, Rectangle, useRefWithBounds } from '@sqlvalley/drawing'

import { useThemeColor, Page, Section, Par, List, Info, Warning, Term, Em, M, DL, IDL } from '@/ui'


function DPGDL({ children }: { children: ReactNode }) {
	return <DL style={{ padding: '10px 20px' }}>{children}</DL>
}

export function Theory() {
	return <Page>
		<Section>
			<Par>We know that negation in Datalog can be tricky: we need safe queries, or we could get infinitely large outputs. Similarly recursion in Datalog is tricky: we need the fixed-point algorithm to compute predicates. When combining negation with recursion, there are even more pitfalls. We'll study some of the problems that occur, and then see what is required to avoid them.</Par>
		</Section>

		<Section title="The problem: two possible outcomes">
			<Par>Let's consider a very simple Datalog program. The fact says Alice is a person. The two rules say that a person is happy if they're not stressed, and stressed if they're not happy.</Par>
			<DL>{`
person('Alice').
happy(x) :- person(x), not stressed(x).
stressed(x) :- person(x), not happy(x).
`}</DL>
			<Par>Suppose we try evaluating this program by repeatedly replacing the derived facts with the consequences of all rules, keeping the original facts. This naive procedure need not converge when negation is present.</Par>
			<Par>In this attempted procedure, we evaluate all rules <Em>together</Em> for this set of facts. When we apply this to our example, <Em>both</Em> rules are triggered: Alice is currently neither happy nor stressed. The updated set of facts will then be <IDL>{`{ person('Alice'), happy('Alice'), stressed('Alice') }`}</IDL>. So Alice is now both happy and stressed. We then evaluate the rules again, and this time we come back to <IDL>{`{ person('Alice') }`}</IDL>. We're back where we started. This process is repeated, and the algorithm never ends!</Par>
			<Par>You might think this procedure is silly, and we should just evaluate rules one at a time. We could do so, but which of the two rules should we then check first? If we check the first rule first, we'll end up with <IDL>{`{ person('Alice'), happy('Alice') }`}</IDL>. If we check the second rule first, we'll wind up with <IDL>{`{ person('Alice'), stressed('Alice') }`}</IDL>. Both these sets won't change further, and are hence valid outcomes of the program. But they're different!</Par>
			<Par>A <Term>model</Term> is a set of facts satisfying the facts and rules of a program. Positive Datalog selects the <Term>least model</Term>: it contains only the facts required by the program. Other satisfying models may contain additional facts. With negation, we need to specify the intended semantics. The two stable outcomes above are different; the set containing both happy and stressed is also a model of the implications, but is not a stable outcome.</Par>
		</Section>

		<Section title="Why negation can remove conclusions">
			<Par>To find out what's different, we take a step back first. Let's consider a Datalog program where we don't have problems; for instance one where we track ancestry. We start with some facts about who is a parent of who. Then we say that a person is someone's ancestor if they're their parent, or if they're an ancestor of their parent.</Par>
			<DL>{`
parent('Alice', 'Bob').
parent('Bob', 'Carla').
parent('Carla', 'Dave').
ancestor(a, b) :- parent(a, b).
ancestor(a, b) :- ancestor(a, x), parent(x, b).
`}</DL>
			<Par>Let's study how Datalog evaluates this program. Particularly, let's study the facts ending up in the <IDL>ancestor</IDL> predicate.</Par>
			<List items={[
				<>We start with no facts in the <IDL>ancestor</IDL> predicate.</>,
				<>We evaluate the rules once. This results in <IDL>{`{ ancestor('Alice', 'Bob'), ancestor('Bob', 'Carla'), ancestor('Carla', 'Dave') }`}</IDL>.</>,
				<>Given this new set of facts, we evaluate the rules again. This gives two extra facts. <IDL>{`{ ancestor('Alice', 'Carla'), ancestor('Bob', 'Dave') }`}</IDL>.</>,
				<>With the five ancestor facts we have now, we evaluate all rules again. This time we also find <IDL>{`{ ancestor('Alice', 'Dave') }`}</IDL>.</>,
				<>We evaluate the rules again, but no new entries pop up. We have found a model: a set of facts for which all rules hold true.</>,
			]} />
			<Par>For positive Datalog, adding input facts cannot invalidate a conclusion. This property is called <Term>monotonicity</Term>. It lets us compute the least model by repeatedly adding consequences of the rules.</Par>
			<Par>A consequence operator <M>f</M> is <Term>monotonic</Term> if <M>X \subseteq Y</M> implies <M>f(X) \subseteq f(Y)</M>. This differs from <Term>inflationarity</Term>, which means <M>D \subseteq f(D)</M>. To evaluate a positive program, keep the original facts and repeatedly add rule consequences, starting with no derived facts. The result grows until it reaches the least fixed point.</Par>
			<Info>
				<Par sx={{ mb: 0.5 }}>For safe positive Datalog over a finite domain, this gives three useful properties.</Par>
				<List items={[
					<>They are <Term>guaranteed to converge</Term>. Since the set of facts can only grow, and the set of possible facts is finite (provided rules cannot generate new values indefinitely), we must reach the end eventually.</>,
					<>The <Term>rule order does not matter</Term>. As long as we keep checking rules, any fact that could possibly be true, given the set of initial facts, will eventually be found.</>,
					<>There is a <Term>unique least model</Term>. Every derived fact belongs to it; no unsupported facts are added.</>,
				]} />
			</Info>
			<Par>To improve our intuition of what monotonicity means, let's also study a program that's non-monotonic.</Par>
			<DL>{`
person('Alice').
happy(x) :- person(x), not stressed(x).
working(x) :- person(x).
stressed(x) :- working(x).
`}</DL>
			<Par>Let's go through the same process of evaluating the rules until nothing changes.</Par>
			<List items={[
				<>Initially the set of facts is <IDL>{`{ person('Alice') }`}</IDL>.</>,
				<>After evaluating all rules once, we have <IDL>{`{ person('Alice'), happy('Alice'), working('Alice') }`}</IDL>.</>,
				<>After evaluating the rules once more, we have <IDL>{`{ person('Alice'), happy('Alice'), working('Alice'), stressed('Alice') }`}</IDL>.</>,
				<>We evaluate the rules another time and get <IDL>{`{ person('Alice'), working('Alice'), stressed('Alice') }`}</IDL>.</>,
				<>We evaluate the rules again and get exactly the same result. So we're done.</>,
			]} />
			<Par>Crucial in this example is that, at the fourth step, the set of facts <Em>decreases</Em>. We remove a fact! Alice used to be happy, but then she started working, wound up stressed, and this removed her happiness. This shows that its consequence operator is <Em>not</Em> monotonic. This program has a unique intended model under stratified semantics. (We'll soon see why: it's "stratified".) Without such a restriction, negation can leave more than one stable outcome, as the first example showed.</Par>
			<Warning>Generally non-monotonic programs are harder to compute than monotonic ones, since facts can also disappear again.</Warning>
		</Section>

		<Section title="Different Datalog types: positive, semi-positive and stratified Datalog">
			<Par>The problem of having multiple models originates from the <IDL>not</IDL> keyword. It causes us to lose monotonicity. To fix those problems, we must apply some restrictions to when/how <IDL>not</IDL> can be used. Let's study three such possible restrictions, going from "very strict" to "less strict".</Par>
			<Par>Option one is to ban <Em>all</Em> negation. This is called <Term>positive Datalog</Term>. The <IDL>not</IDL> keyword is simply not allowed.</Par>
			<Info>Positive Datalog is monotonic and has a unique least model. Over a finite domain, repeated rule evaluation reaches that model.</Info>
			<Par>Obviously, the <IDL>not</IDL> keyword is pretty useful, so this is not an ideal solution. Let's loosen the restrictions.</Par>
			<Par>Option two is to allow the <IDL>not</IDL> keyword, but <Em>only</Em> at the original tables of our database: the EDBs. This is called <Term>semi-positive Datalog</Term>. We may use <IDL>not originalFact(x)</IDL> but we can't write <IDL>not derivedPredicate(x)</IDL>.</Par>
			<Info>For a fixed original database, semi-positive rule evaluation is monotonic in the derived facts: negation only inspects original facts, which do not change during evaluation. The query itself need not be monotonic in the original database. Adding an original fact can invalidate a conclusion that depended on its absence.</Info>
			<Par>We can allow more negation while keeping a well-defined intended result. In <Term>stratified Datalog</Term>, no dependency cycle may contain a negative edge. This lets us finish computing each negated predicate before using its absence in another rule.</Par>
			<Par>This definition may initially sound a bit vague. We can clarify it using the predicate dependency graph. Let's consider the following example program.</Par>
			<SampleNonStratifiedProgram />
			<Par>We say that a predicate <IDL>X</IDL> <Term>negatively depends</Term> on a predicate <IDL>Y</IDL> if the literal <IDL>not Y</IDL> appears in a rule for <IDL>X</IDL>. So in the above example program, <IDL>C</IDL> negatively depends on <IDL>D</IDL> and <IDL>D</IDL> negatively depends on <IDL>B</IDL>.</Par>
			<DependencyGraph />
			<Par>When drawing the dependency graph (before collapsing cycles) we always indicate negative dependencies. This is done by writing a minus sign next to the arrow. (We can also add a plus sign to all other arrows, but this is rather implicit, so it's often skipped.)</Par>
			<Par>The program is stratified if <Em>all</Em> cycles consist of <Em>only positive</Em> dependencies. If there is <Em>any</Em> cycle containing <Em>any</Em> negative dependency, then the program is <Em>not</Em> stratified. The above dependency graph shows that the example program is <Em>not</Em> stratified: there is a cycle <IDL>(C,D,E)</IDL> with a negative dependency from <IDL>C</IDL> to <IDL>D</IDL> in it. If this was a positive dependency, or if there was no cycle, the example program <Em>would</Em> be stratified.</Par>
			<Info>Stratified Datalog programs can be nonmonotonic as queries over the original database. They have a unique <Term>perfect model</Term>, computed one stratum at a time. Within each stratum, negated predicates have already been computed and positive recursion reaches its least fixed point. This does not mean that no other interpretation satisfies the rules.</Info>
			<Par>An intuitive way to keep track of these three categories is through the following thoughts.</Par>
			<List items={[
				<><Term>Positive Datalog</Term>: You can't use negation at all.</>,
				<><Term>Semi-positive Datalog</Term>: You can negate original predicates, but not new predicates you defined yourself.</>,
				<><Term>Stratified Datalog</Term>: You can negate any predicate you like, as long as we can finish computing that predicate beforehand.</>,
			]} />
			<Par>Any positive Datalog program is also semi-positive and stratified, and similarly any semi-positive Datalog program is also stratified. The opposite doesn't always hold. This is also shown by the following Venn diagram. It shows the hierarchy of types of Datalog programs, including which type of program is guaranteed to have which property.</Par>
			<DatalogTypeVennDiagram />
		</Section>
	</Page>;
}

export function SampleNonStratifiedProgram() {
	return <DL>{`
C(x) :- A(x), not D(x).
D(x) :- not B(x), E(x).
E(x) :- C(x).
`}</DL>
}

export function DependencyGraph() {
	const themeColor = useThemeColor()

	// Track bounds of components.
	const [drawingRef, drawingData] = useRefWithValue<DrawingData>();
	const [p1Ref, p1Bounds] = useRefWithBounds(drawingData);
	const [p2Ref, p2Bounds] = useRefWithBounds(drawingData);
	const [p3Ref, p3Bounds] = useRefWithBounds(drawingData);
	const [p4Ref, p4Bounds] = useRefWithBounds(drawingData);
	const [p5Ref, p5Bounds] = useRefWithBounds(drawingData);

	// Render the drawing.
	return <Drawing ref={drawingRef} width={200} height={210} maxWidth={200}>
		<Element ref={p1Ref} position={[40, 20]}><DPGDL>A</DPGDL></Element>
		<Element ref={p2Ref} position={[160, 20]}><DPGDL>B</DPGDL></Element>
		<Element ref={p3Ref} position={[40, 110]}><DPGDL>C</DPGDL></Element>
		<Element ref={p4Ref} position={[160, 110]}><DPGDL>D</DPGDL></Element>
		<Element ref={p5Ref} position={[100, 190]}><DPGDL>E</DPGDL></Element>

		{p1Bounds && p2Bounds && p3Bounds && p4Bounds && p5Bounds ? <>
			<Curve points={[p3Bounds.bottomMiddle.add([0, -2]), p1Bounds.topMiddle.add([0, 2])]} endArrow={true} color={themeColor} />
			<Curve points={[p3Bounds.middleRight.add([2, 0]), p4Bounds.middleLeft.add([-2, 0])]} endArrow={true} color={themeColor} />
			<Curve points={[p4Bounds.bottomMiddle.add([0, -2]), p2Bounds.topMiddle.add([0, 2])]} endArrow={true} color={themeColor} />
			<Curve points={[p4Bounds.topLeft.add([2, 0]), p5Bounds.bottomRight.add([-2, 0])]} endArrow={true} color={themeColor} />
			<Curve points={[p5Bounds.bottomLeft.add([2, 0]), p3Bounds.topRight.add([-2, 0])]} endArrow={true} color={themeColor} />

			<Element position={p3Bounds.middleRight.add(p4Bounds.middleLeft).divide(2).add([0, 10])} anchor={[0, 1]}><span style={{ color: themeColor, fontSize: '1.5em' }}>−</span></Element>
			<Element position={p4Bounds.bottomMiddle.add(p2Bounds.topMiddle).divide(2).add([-5, 6])} anchor={[1, 0]}><span style={{ color: themeColor, fontSize: '1.5em' }}>−</span></Element>
		</> : null}
	</Drawing>;
}

export function DatalogTypeVennDiagram() {
	const theme = useTheme();
	const themeColor = theme.palette.primary.main;
	const infoColor = theme.palette.info.main;
	const warningColor = theme.palette.warning.main;

	// Render the drawing.
	const w = 700, h = 300;
	const circleHeight = 200;
	const circleY = h / 2 + 20;
	const circles = [
		{ w: 0.25 * w, h: circleHeight / 4, x: 220, y: circleY },
		{ w: 0.50 * w, h: circleHeight / 2, x: 280, y: circleY },
		{ w: 0.75 * w, h: circleHeight * 3 / 4, x: 340, y: circleY },
		{ w: w, h: circleHeight, x: 400, y: circleY },
	]
	return <Drawing width={w} height={h} maxWidth={w}>
		<Rectangle style={{ fill: infoColor, fillOpacity: 0.06, stroke: infoColor, strokeWidth: 2 }} dimensions={[[circles[1].x - circles[1].w / 2 - 8, 40], [circles[1].x + circles[1].w / 2 + 12, h - 8]]} cornerRadius={10} />
		<Element position={[circles[1].x - circles[1].w / 2 - 8 + 6, 40 + 2]} anchor={[-1, -1]} style={{ color: infoColor, fontWeight: 'bold', textAlign: 'center' }}>Monotone evaluation<br />with fixed EDB</Element>

		<Rectangle style={{ fill: warningColor, fillOpacity: 0.06, stroke: warningColor, strokeWidth: 2 }} dimensions={[[circles[2].x - circles[2].w / 2 - 8, 0], [circles[2].x + circles[2].w / 2 + 12, h]]} cornerRadius={10} />
		<Element position={[circles[2].x - circles[2].w / 2 - 8 + 6, 2]} anchor={[-1, -1]} style={{ color: warningColor, fontWeight: 'bold', textAlign: 'center' }}>Unique intended result</Element>

		{circles.map((circle, index) => <Rectangle key={index} dimensions={[[circle.x - circle.w / 2, circle.y - circle.h / 2], [circle.x + circle.w / 2, circle.y + circle.h / 2]]} cornerRadius={circle.w / 2} style={{ fill: themeColor, fillOpacity: 0.06, stroke: themeColor, strokeWidth: 2 }} />)}

		<Element position={[circles[0].x, circles[0].y]} style={{ color: themeColor, fontWeight: 'bold', textAlign: 'center', lineHeight: 1.2 }}>Positive<br />Datalog</Element>
		<Element position={[circles[1].x + circles[1].w / 2 - 82, circles[1].y]} style={{ color: themeColor, fontWeight: 'bold', textAlign: 'center', lineHeight: 1.2 }}>Semi-Positive<br />Datalog</Element>
		<Element position={[circles[2].x + circles[2].w / 2 - 77, circles[1].y]} style={{ color: themeColor, fontWeight: 'bold', textAlign: 'center', lineHeight: 1.2 }}>Stratified<br />Datalog</Element>
		<Element position={[circles[3].x + circles[3].w / 2 - 72, circles[1].y]} style={{ color: themeColor, fontWeight: 'bold', textAlign: 'center', lineHeight: 1.2 }}>Datalog</Element>

	</Drawing>
}
