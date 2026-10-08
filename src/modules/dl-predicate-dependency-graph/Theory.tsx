import type { ReactNode } from 'react'

import { Drawing as StepWiseDrawing, HtmlElement, Curve as StepWiseCurve, anchors } from '@step-wise/drawing'

import { useThemeColor, Page, Section, Par, List, Info, Warning, Term, Em } from '@/ui'
import { DL, IDL } from '@/learning'
import { SQLValleySchema } from '@/curriculum'

function DPGDL({ children }: { children: ReactNode }) {
	return <DL style={{ padding: '10px 20px' }}>{children}</DL>
}

export function Theory() {
	return <Page>
		<Section>
			<Par>We know that Datalog programs can consist of many predicates, each having rules linking them to other predicates. We also know that, through recursion, predicates can refer to themselves.</Par>
			<Par>As Datalog programs grow larger, it helps to visualize their structure, showing which predicate depends on which other predicate. This is done through a <Term>predicate dependency graph</Term>. Let's take a look at how it works.</Par>
		</Section>

		<Section title="Predicates as nodes, dependencies as edges">
			<Par>Let's consider an example database, containing a list of products, a list of user accounts, and a list of transactions made of product sales between users.</Par>
			<SQLValleySchema tables={['products', 'accounts', 'transactions']} singular />
			<Par>We could set up (as an example) a Datalog program that finds the first and last name of every user that has sold a product and subsequently bought it back, including the product name of said product.</Par>
			<Info>It doesn't matter if you don't understand the given program just yet. The only thing to look for is which predicate depends on which predicate.</Info>
			<DL>{`
sold(v, b, p, d) :- transaction(_, v, b, p, d, _, _, _).
soldAndBoughtBack(v, p) :- sold(v, _, p, d1), sold(_, v, p, d2), d2 > d1.
withNames(fn, ln, pn) :-
        soldAndBoughtBack(v, p),
        account(v, _, _, _, fn, ln, _, _, _, _),
        product(p, pn, _, _, _, _).
`}</DL>
			<Par>The idea now is to make an overview of <Em>which</Em> predicate <Term>directly depends</Term> on <Em>which other</Em> predicate(s): they are referenced within the rules describing the predicate. We can see from the above program that ...</Par>
			<List items={[
				<><IDL>sold</IDL> directly depends on <IDL>transaction</IDL>.</>,
				<><IDL>soldAndBoughtBack</IDL> directly depends on <IDL>sold</IDL>.</>,
				<><IDL>withNames</IDL> directly depends on <IDL>soldAndBoughtBack</IDL>, but also on <IDL>account</IDL> and <IDL>product</IDL>.</>,
			]} />
			<Par>All these dependencies can be drawn out in a graph. We draw every predicate as a node, and we draw an edge (including arrow) from one node to another if the first node directly depends on the second node. The result is a first (still messy) version of a <Term>predicate dependency graph</Term>.</Par>
			<FirstDependencyGraph />
			<Warning>There's a distinction between "direct dependence" and "indirect dependence". We say that <IDL>soldAndBoughtBack</IDL> <Term>directly depends</Term> on <IDL>sold</IDL>, but it only <Term>indirectly depends</Term> on <IDL>transaction</IDL>, and it does not depend at all on <IDL>withNames</IDL>. In practice, when we use the word "depends", it usually varies by context whether we mean "directly depends" or "directly or indirectly depends".</Warning>
		</Section>

		<Section title="Layers in the predicate dependency graph">
			<Par>We can structure our dependency graph further. Let's for now assume that there are no cycles in our dependency graph: recursion is not applicable here. In other words, our graph is a <Term>Directed Acyclic Graph</Term> (DAG). When this is the case, we can divide the dependency graph into <Term>layers</Term>.</Par>
			<Par>We start with all the original predicates, the so-called <Term>Extensional Database</Term> (EDB). These predicates form layer 0. It's what is known in advance, before running any program. These predicates do not depend on anything.</Par>
			<CleanedFirstDependencyGraph layer={0} />
			<Par>We then have to add the <Term>Intensional Database</Term> (IDB) to our graph: all the new predicates we defined. We will divide them over several layers. Layer 1 consists of all predicates that <Em>only</Em> depend on predicates in layer 0.</Par>
			<CleanedFirstDependencyGraph layer={1} />
			<Warning>The predicate <IDL>sold</IDL> belongs in layer 1 since it only depends on <IDL>transaction</IDL>. The predicate <IDL>withNames</IDL> depends on <IDL>account</IDL> and <IDL>product</IDL> (both from layer 0) but it <Em>also</Em> depends on <IDL>soldAndBoughtBack</IDL> (not in a layer yet) so it does not belong in layer 1.</Warning>
			<Par>We continue with layer 2. This one contains all predicates that only directly depend on predicates from layers 0 <Em>and</Em> 1.</Par>
			<CleanedFirstDependencyGraph layer={2} />
			<Par>We continue in this way until all predicates have been added to the graph. Every time, in every layer, we add all predicates that <Em>only</Em> depend on the previous layers. This gives our final dependency graph.</Par>
			<CleanedFirstDependencyGraph layer={3} />
			<Par>The above graph gives a good overview of the Datalog program. And sure, the example is a rather small script, so a fancy graph is not <Em>that</Em> valuable. But as Datalog programs get larger, a predicate dependency graph can be <Em>really</Em> helpful at understanding the program.</Par>
			<Info>The graph also shows how Datalog can evaluate predicates. It already knows everything from layer 0. It can then compute everything from layer 1 (possibly in parallel if there are multiple nodes in that layer), then everything from layer 2, and so forth.</Info>
		</Section>

		<Section title="Cycles in the predicate dependency graph">
			<Par>The previous example was of a Datalog program with no cycles. Now let's study an example <Em>with</Em> cycles. We'll use an abstract example here, to keep it simple to grasp. Let's consider a database where the EDB consists of predicates <IDL>A</IDL>, <IDL>B</IDL> and <IDL>C</IDL>. We examine the following program. (The arguments within the predicates are irrelevant, so we just call them <IDL>x</IDL>.)</Par>
			<SampleDatalogScriptForDependencyGraph />
			<Par>We could draw a predicate dependency graph for this script. The first version (without layers) looks like this.</Par>
			<SecondDependencyGraph />
			<Par>Note that there is a <Term>cycle</Term> in the dependency graph! Specifically, <IDL>E</IDL> depends on <IDL>F</IDL>, <IDL>F</IDL> depends on <IDL>G</IDL>, and <IDL>G</IDL> depends on <IDL>E</IDL>. When there is a cycle in the dependency graph, it is impossible to create layers. After all, each of these three predicates should be lower than the other ones.</Par>
			<Par>To solve this, we first have to get rid of the cycles. The trick is to find a <Term>Strongly Connected Component</Term> (SCC) in our graph: a set of nodes in which <Em>every</Em> node in this component can be reached (directly or indirectly) from <Em>every</Em> other node of the component. Here we see that <IDL>(E,F,G)</IDL> is a SCC.</Par>
			<Par>When we find a SCC within our dependency graph, we <Term>collapse</Term> it into a single node. We draw this node in our graph in the place of the original nodes.</Par>
			<SecondDependencyGraph collapsed />
			<Par>We continue doing this until there are no cycles left, and we are once more left with a DAG. (Luckily our example only had one cycle.) Since we now have a DAG, we can divide the graph into layers as usual. The result is a dependency graph with layers, where some predicates are grouped together into a single node.</Par>
			<CleanedSecondDependencyGraph />
			<Par>Now it's once more possible to compute all the predicates layer by layer.</Par>
			<Info>Whenever Datalog encounters multiple predicates in a single node, it knows it has to apply the fixed-point algorithm to compute the predicates within this node.</Info>
		</Section>
	</Page>
}

export function SampleDatalogScriptForDependencyGraph() {
	return <DL>{`
D(x) :- A(x), B(x).
E(x) :- C(x), F(x).
F(x) :- G(x).
G(x) :- D(x), E(x).
H(x) :- D(x), B(x).
I(x) :- G(x), H(x).
`}</DL>
}

export function FirstDependencyGraph() {
	const themeColor = useThemeColor()

	return <StepWiseDrawing view={{ type: 'identity', width: 500, height: 250 }} maxWidth={500}>
		<HtmlElement target="p1" position={[80, 80]}><DPGDL>product</DPGDL></HtmlElement>
		<HtmlElement target="p2" position={[240, 20]}><DPGDL>account</DPGDL></HtmlElement>
		<HtmlElement target="p3" position={[420, 80]}><DPGDL>transaction</DPGDL></HtmlElement>
		<HtmlElement target="p4" position={[80, 170]}><DPGDL>sold</DPGDL></HtmlElement>
		<HtmlElement target="p5" position={[420, 170]}><DPGDL>soldAndBoughtBack</DPGDL></HtmlElement>
		<HtmlElement target="p6" position={[240, 230]}><DPGDL>withNames</DPGDL></HtmlElement>

		<StepWiseCurve positions={[
			{ target: 'p4', anchor: anchors.topRight, pixelOffset: [2, 3] },
			{ target: 'p3', anchor: anchors.bottomLeft, pixelOffset: [-2, -1] },
		]} endArrow stroke={themeColor} strokeWidth={2} />
		<StepWiseCurve positions={[
			{ target: 'p5', anchor: anchors.left, pixelOffset: [-3, 0] },
			{ target: 'p4', anchor: anchors.right, pixelOffset: [3, 0] },
		]} endArrow stroke={themeColor} strokeWidth={2} />
		<StepWiseCurve positions={[
			{ target: 'p6', anchor: anchors.topRight, pixelOffset: [-1, 0] },
			{ target: 'p5', anchor: anchors.bottomLeft, pixelOffset: [0, -2] },
		]} endArrow stroke={themeColor} strokeWidth={2} />
		<StepWiseCurve positions={[
			{ target: 'p6', anchor: anchors.top, pixelOffset: [-40, -4] },
			{ target: 'p1', anchor: anchors.bottomRight },
		]} endArrow stroke={themeColor} strokeWidth={2} />
		<StepWiseCurve positions={[
			{ target: 'p6', anchor: anchors.top, pixelOffset: [0, -3] },
			{ target: 'p2', anchor: anchors.bottom, pixelOffset: [0, 3] },
		]} endArrow stroke={themeColor} strokeWidth={2} />
	</StepWiseDrawing>
}

export function CleanedFirstDependencyGraph({ layer = 3 }) {
	const themeColor = useThemeColor()

	return <StepWiseDrawing view={{ type: 'identity', width: 500, height: 40 + 80 * layer }} maxWidth={500}>
		<HtmlElement position={[0, 20]}><strong>Layer 0:</strong></HtmlElement>
		<HtmlElement target="p1" position={[120, 20]}><DPGDL>product</DPGDL></HtmlElement>
		<HtmlElement target="p2" position={[265, 20]}><DPGDL>account</DPGDL></HtmlElement>
		<HtmlElement target="p3" position={[420, 20]}><DPGDL>transaction</DPGDL></HtmlElement>

		{layer >= 1 ? <>
			<HtmlElement position={[0, 100]}><strong>Layer 1:</strong></HtmlElement>
			<HtmlElement target="p4" position={[420, 100]}><DPGDL>sold</DPGDL></HtmlElement>
			<StepWiseCurve positions={[{ target: 'p4', anchor: anchors.top, pixelOffset: [0, -3] }, { target: 'p3', anchor: anchors.bottom, pixelOffset: [0, 2] }]} endArrow stroke={themeColor} strokeWidth={2} />
		</> : null}

		{layer >= 2 ? <>
			<HtmlElement position={[0, 180]}><strong>Layer 2:</strong></HtmlElement>
			<StepWiseCurve positions={[{ target: 'p5', anchor: anchors.top, pixelOffset: [0, -3] }, { target: 'p4', anchor: anchors.bottom, pixelOffset: [0, 2] }]} endArrow stroke={themeColor} strokeWidth={2} />
			<HtmlElement target="p5" position={[420, 180]}><DPGDL>soldAndBoughtBack</DPGDL></HtmlElement>
		</> : null}

		{layer >= 3 ? <>
			<HtmlElement position={[0, 260]}><strong>Layer 3:</strong></HtmlElement>
			<HtmlElement target="p6" position={[265, 260]}><DPGDL>withNames</DPGDL></HtmlElement>
			<StepWiseCurve positions={[{ target: 'p6', anchor: anchors.top, pixelOffset: [30, -2] }, { target: 'p5', anchor: anchors.bottomLeft, pixelOffset: [20, 2] }]} endArrow stroke={themeColor} strokeWidth={2} />
			<StepWiseCurve positions={[{ target: 'p6', anchor: anchors.top, pixelOffset: [-30, -2] }, { target: 'p1', anchor: anchors.bottom, pixelOffset: [20, 2] }]} endArrow stroke={themeColor} strokeWidth={2} />
			<StepWiseCurve positions={[{ target: 'p6', anchor: anchors.top, pixelOffset: [0, -3] }, { target: 'p2', anchor: anchors.bottom, pixelOffset: [0, 3] }]} endArrow stroke={themeColor} strokeWidth={2} />
		</> : null}
	</StepWiseDrawing>
}

export function SecondDependencyGraph({ collapsed = false }) {
	const themeColor = useThemeColor()
	const edge = (from: string, fromAnchor: typeof anchors[keyof typeof anchors], to: string, toAnchor: typeof anchors[keyof typeof anchors], fromOffset: [number, number] = [0, 0], toOffset: [number, number] = [0, 0]) => <StepWiseCurve positions={[{ target: from, anchor: fromAnchor, pixelOffset: fromOffset }, { target: to, anchor: toAnchor, pixelOffset: toOffset }]} endArrow stroke={themeColor} strokeWidth={2} />

	return <StepWiseDrawing view={{ type: 'identity', width: 500, height: 220 }} maxWidth={500}>
		<HtmlElement target="p1" position={[80, 20]}><DPGDL>A</DPGDL></HtmlElement>
		<HtmlElement target="p2" position={[240, 20]}><DPGDL>B</DPGDL></HtmlElement>
		<HtmlElement target="p3" position={[420, 20]}><DPGDL>C</DPGDL></HtmlElement>
		<HtmlElement target="p4" position={[80, 110]}><DPGDL>D</DPGDL></HtmlElement>
		<HtmlElement target="p8" position={[240, 110]}><DPGDL>H</DPGDL></HtmlElement>
		<HtmlElement target="p9" position={[80, 200]}><DPGDL>I</DPGDL></HtmlElement>

		{collapsed ? <>
			<HtmlElement target="p567" position={[420, 200]}><DPGDL>(E,F,G)</DPGDL></HtmlElement>
		</> : <>
			<HtmlElement target="p5" position={[420, 110]}><DPGDL>E</DPGDL></HtmlElement>
			<HtmlElement target="p6" position={[420, 200]}><DPGDL>F</DPGDL></HtmlElement>
			<HtmlElement target="p7" position={[240, 200]}><DPGDL>G</DPGDL></HtmlElement>
		</>}

		{edge('p4', anchors.top, 'p1', anchors.bottom, [0, -2], [0, 2])}
		{edge('p4', anchors.topRight, 'p2', anchors.bottomLeft)}
		{edge('p8', anchors.top, 'p2', anchors.bottom, [0, -2], [0, 2])}
		{edge('p8', anchors.left, 'p4', anchors.right, [-2, 0], [2, 0])}
		{edge('p9', anchors.topRight, 'p8', anchors.bottomLeft)}
		{collapsed ? <>
			{edge('p567', anchors.topLeft, 'p4', anchors.bottomRight, [-2, 1], [1, -2])}
			{edge('p9', anchors.right, 'p567', anchors.left, [2, 0], [-2, 0])}
			{edge('p567', anchors.top, 'p3', anchors.bottom, [0, -2], [0, 2])}
		</> : <>
			{edge('p7', anchors.topLeft, 'p4', anchors.bottomRight)}
			{edge('p9', anchors.right, 'p7', anchors.left, [2, 0], [-2, 0])}
			{edge('p5', anchors.top, 'p3', anchors.bottom, [0, -2], [0, 2])}
			{edge('p7', anchors.topRight, 'p5', anchors.bottomLeft)}
			{edge('p5', anchors.bottom, 'p6', anchors.top, [0, 2], [0, -2])}
			{edge('p6', anchors.left, 'p7', anchors.right, [-2, 0], [2, 0])}
		</>}
	</StepWiseDrawing>
}

export function CleanedSecondDependencyGraph() {
	const themeColor = useThemeColor()

	return <StepWiseDrawing view={{ type: 'identity', width: 500, height: 275 }} maxWidth={500}>
		<HtmlElement position={[0, 25]}><strong>Layer 0:</strong></HtmlElement>
		<HtmlElement target="p1" position={[120, 25]}><DPGDL>A</DPGDL></HtmlElement>
		<HtmlElement target="p2" position={[270, 25]}><DPGDL>B</DPGDL></HtmlElement>
		<HtmlElement target="p3" position={[420, 25]}><DPGDL>C</DPGDL></HtmlElement>
		<HtmlElement position={[0, 100]}><strong>Layer 1:</strong></HtmlElement>
		<HtmlElement target="p4" position={[185, 100]}><DPGDL>D</DPGDL></HtmlElement>
		<HtmlElement position={[0, 175]}><strong>Layer 2:</strong></HtmlElement>
		<HtmlElement target="p8" position={[205, 175]}><DPGDL>H</DPGDL></HtmlElement>
		<HtmlElement target="p567" position={[345, 175]}><DPGDL>(E,F,G)</DPGDL></HtmlElement>
		<HtmlElement position={[0, 250]}><strong>Layer 3:</strong></HtmlElement>
		<HtmlElement target="p9" position={[270, 250]}><DPGDL>I</DPGDL></HtmlElement>

		<StepWiseCurve positions={[{ target: 'p4', anchor: anchors.topLeft, pixelOffset: [5, -3] }, { target: 'p1', anchor: anchors.bottomRight, pixelOffset: [-5, 3] }]} endArrow stroke={themeColor} strokeWidth={2} />
		<StepWiseCurve positions={[{ target: 'p4', anchor: anchors.topRight, pixelOffset: [0, -2] }, { target: 'p2', anchor: anchors.bottomLeft, pixelOffset: [0, 2] }]} endArrow stroke={themeColor} strokeWidth={2} />
		<StepWiseCurve positions={[{ target: 'p8', anchor: anchors.topRight, pixelOffset: [-2, -1] }, { target: 'p2', anchor: anchors.bottom, pixelOffset: [-10, 4] }]} endArrow stroke={themeColor} strokeWidth={2} />
		<StepWiseCurve positions={[{ target: 'p8', anchor: anchors.top, pixelOffset: [-5, -3] }, { target: 'p4', anchor: anchors.bottom, pixelOffset: [5, 2] }]} endArrow stroke={themeColor} strokeWidth={2} />
		<StepWiseCurve positions={[{ target: 'p567', anchor: anchors.top, pixelOffset: [20, -4] }, { target: 'p3', anchor: anchors.bottomLeft, pixelOffset: [10, 3] }]} endArrow stroke={themeColor} strokeWidth={2} />
		<StepWiseCurve positions={[{ target: 'p567', anchor: anchors.topLeft, pixelOffset: [-2, 1] }, { target: 'p4', anchor: anchors.bottomRight, pixelOffset: [1, -2] }]} endArrow stroke={themeColor} strokeWidth={2} />
		<StepWiseCurve positions={[{ target: 'p9', anchor: anchors.topLeft, pixelOffset: [5, -3] }, { target: 'p8', anchor: anchors.bottomRight, pixelOffset: [-5, 3] }]} endArrow stroke={themeColor} strokeWidth={2} />
		<StepWiseCurve positions={[{ target: 'p9', anchor: anchors.topRight, pixelOffset: [-10, -4] }, { target: 'p567', anchor: anchors.bottomLeft, pixelOffset: [10, 4] }]} endArrow stroke={themeColor} strokeWidth={2} />
	</StepWiseDrawing>
}
