import { ISQL } from '@sqlvalley/sql'

import { Page, Section, Par, List, Warning, Info, Term, Em } from '@/ui'
import { TableSchema, TableQueryFigure } from '@/learning'

export function Theory() {
	return <Page>
		<Section>
			<Par>We know that, in a database table, the columns have names but the rows do not. How can we then point to a specific row? The key (pun intended) lies in <Term>keys</Term>.</Par>
		</Section>

		<Section title="Superkey: a set of attributes uniquely identifying a row">
			<Par>Let's consider the table of all user accounts for an online platform.</Par>
			<TableQueryFigure query={`SELECT * FROM accounts;`} title="List of user accounts" tableWidth={1400} tableScale={0.7} />
			<Par>If you want to point someone to a specific row, you could try the following.</Par>
			<List items={[
				<>"Take the eighth row." This may fail, since the ordering is arbitrary. Maybe someone orders the rows differently, and we end up at a different row.</>,
				<>"Take the row where the city is San Jose." This also fails, since there are multiple people living there.</>,
				<>"Take the row of Harper Ellis." Now we're getting somewhere! After all, the combination of <ISQL>first_name</ISQL> and <ISQL>last_name</ISQL> seems to be unique.</>
			]} />
			<Par>Let's assume our table does not have duplicate rows. (That is, there are no two rows with the same value for <Em>all</Em> columns.) A <Term>superkey</Term> is a set of attributes (for instance <ISQL>{`{first_name, last_name}`}</ISQL>) whose values are unique for all rows. These attributes can then be used to uniquely identify the row.</Par>
			<Info>Just to be clear: we don't mean that <Em>every</Em> value of a superkey is unique. Not everyone has to have a different first name! We mean that the <Em>combined</Em> values are unique. For example, we may consider <ISQL>{`{first_name, last_name}`}</ISQL> a superkey if <Em>everyone</Em> has a different combination of first and last name.</Info>
			<Par>But what if the table does potentially have duplicate rows? In this case, there is <Em>no</Em> way of distinguishing between identical rows. The best we can do is distinguish between non-identical rows. To do so, we extend the definition of the superkey: A <Term>superkey</Term> is a set of attributes such that, whenever two rows have the same value for <Em>these</Em> attributes, then they always have the same value for <Em>all</Em> attributes (and are hence duplicate rows). Note that, if there are no duplicate rows, this definition reduces to our earlier definition.</Par>
		</Section>

		<Section title="Candidate key: a minimal superkey">
			<Par>If I tell you to find the row of "Harper Ellis from San Jose" then you can uniquely do so. The set <ISQL>{`{first_name, last_name, city}`}</ISQL> is a superkey. However, we don't need the city. The smaller set <ISQL>{`{first_name, last_name}`}</ISQL> is also a superkey for this table! So the first set had superfluous attributes. This idea leads to the following definition.</Par>
			<Par>A <Term>candidate key</Term> is a set of attributes that is a superkey, but if we remove any single attribute, the set is not a superkey anymore, irrespective of which attribute we remove. So in a way, a candidate key is a <Em>minimal</Em> superkey. Note that <ISQL>{`{first_name, last_name, city}`}</ISQL> is not a candidate key (only a superkey) but <ISQL>{`{last_name, city}`}</ISQL> is a candidate key. After all, we can use it to uniquely identify the row, but neither <ISQL>last_name</ISQL> nor <ISQL>city</ISQL> alone would be enough for that.</Par>
			<Warning>Note that a candidate key is not necessarily minimal in the <Em>number</Em> of attributes. Whereas the set containing only the username <ISQL>{`{username}`}</ISQL> is a candidate key with one attribute, the set <ISQL>{`{last_name, city}`}</ISQL> is a candidate key with two attributes. Given our data, they're both valid candidate keys! The fact that one candidate key has more attributes than the other is irrelevant. The candidate key definition only requires us to not be able to <Em>remove</Em> any attributes without losing superkey status.</Warning>
			<Info>When finding candidate keys, it is very important to not only look at your data now, but also what <Em>future</Em> data you may obtain. In the small example above, all <ISQL>{`{last_name, city}`}</ISQL> combinations are unique, and even all <ISQL>{`{first_name}`}</ISQL> values are unique. But this is unlikely to be the case in the future! When determining the candidate keys for a table, we are looking for sets of attributes that are guaranteed to <Em>remain</Em> unique, given the rules of our application.</Info>
		</Section>

		<Section title="Primary key: a chosen candidate key">
			<Par>Once we have determined various candidate keys for a table, we choose one as the so-called <Term>primary key</Term>. This primary key is effectively an "agreement": whenever we refer to a specific row within a table, we agree to refer to it through <Em>those</Em> attributes.</Par>
			<Par>The choice of primary key is not a mathematical one, but one of convenience. What do we consider to be a good way of referring to a specific row? One might argue that <ISQL>email</ISQL> is a good way, as it's recognizable. However, what if multiple people use the same email address? Then it fails. And it's also helpful if the primary key value does not change: otherwise we have to update all our references whenever it changes. Given these considerations, the <ISQL>username</ISQL> seems to be the best choice for the primary key here.</Par>
			<Info>Note that the definitions of superkey and candidate key are mathematical: it is always clear which sets of attributes are superkeys and candidate keys. However, the primary key is a human choice: there could always be arguments to use one over the other.</Info>
			<Par>The primary key is indicated in the schema through an underline.</Par>
			<List items={[<TableSchema key="accounts" table="accounts" primaryKeys={['username']} />]} />
			<Par>In the hypothetical case where the primary key consists of multiple attributes (like for instance <ISQL>{`{first_name, last_name}`}</ISQL>) then <Em>all</Em> the respective attributes are underlined.</Par>
			<List items={[<TableSchema key="accounts" table="accounts" primaryKeys={['first_name', 'last_name']} />]} />
			<Warning>By defining a primary key, we <Em>require</Em> these attributes (their combination) to be unique. If we define <ISQL>{`{first_name, last_name}`}</ISQL> as primary key, no two people with the same name may be entered into the table. The database won't allow it! That's yet another reason why it's important to carefully choose the primary key of each table.</Warning>
		</Section>
	</Page>
}
