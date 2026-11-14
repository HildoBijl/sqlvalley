# SQLValley — Character Cast and Motivations

**Purpose:** Private authoring bible for dialogue and SQL exercise implementation. **Spoilers throughout.** Later explicit player-designer decisions override older reference files. Do not expose perpetrator labels in player-facing dialogue before the finale.

**Important:** over the story modules, the player has to build a personal rapport to each character, to understand their personality, ambitions, etc. All characters should be relatable in their own way, so the player can connect emotionally with each, for their own reasons. This builds the emotional effect of the three insider reveals and the unexpected truth about Wheatley.
Wheatley is an exception: he is intentionally vague, and his presence and questionable queries act as a red herring. 
The three insider moles are aware of their own actions but do not consider themselves the mole, as the combined tampering appears much larger than their own. None knows that the others are also responsible. Wheatley is independently using the player's access and is not involved in their tampering.

Caesar, Bob, Paris, Elvis and Marcelle all count as leadership: they are board-level, department heads, founders or trusted high-ranking individuals. Wheatley presents himself as belonging at that level. Everyone in this recurring cast except Caesar considers the mole theory plausible.


## Relationship map
- **Caesar ↔ Bob:** friends and co-founders; Caesar still trusts and cares for Bob despite the Loophole. Bob secretly wants Caesar to abandon the pivot, but cannot bring himself to argue openly.
- **Caesar ↔ Paris:** Paris is a high-trust executive organizer with influence over what information reaches leadership. She wants greater status and fears losing influence to Marcelle.
- **Paris ↔ Marcelle:** Paris sees Marcelle's technical authority and potential executive prospects as a direct threat to her own ambitions. Marcelle is an **innocent target**.
- **Wheatley ↔ Player:** no verified professional link to HeriShare. He contacts the player privately and asks for sensitive data. **He does not normally interact with the other employees.**
- **Player ↔ Everyone:** trusted enough to inspect assigned data, but an outsider to their motives. Their SQL findings can be accurate while a character's interpretation is dishonest.


## Caesar Vallelonga — Founder and CEO (non-mole)
**Background:** Co-founded HeriShare with Bob in 2023 around wider participation in cultural heritage. Leads fundraising, partnerships, growth and the eventual pivot to a private exclusive marketplace. Remains a strong believer in the post-pivot business and its financial recovery. While not so technically gifted, he is a people-person, who can rouse up anyone with a heartfelt speech. He cares deeply about the company, celebrating any victory as if it were his own.

**Personality / voice:** charismatic and ambitious, capable of warmth and frustration, commercially optimistic, inclined to solve operational problems pragmatically. Not a flawless executive: trusts is team to a fault, is dismissive of the idea of a mole. Assigns an intern (the player) to investigate because he doesn't think the mole is real, and personally believes all the issues present are happenstance. 

**Values / motivations:** save and grow HeriShare after the collapse; protect colleagues and company's survival; make the new model successful. He is still emotionally attached to Bob as his best friend.

**Role in modules:** executive sponsor, occasional requester, receiver of findings, arbiter between conflicting interpretations. He greets the player at the beginning, explains Marcelle's absence and the player's incomplete onboarding, and introduces the rumor of a mole while remaining personally dismissive of it. The other members of the recurring leadership cast consider the rumor plausible. Caesar tasks the player with helping them identify database problems. The player only investigates with read-only queries; repairs happen through the surrounding fiction.
His attitude changes as credible evidence accumulates: he first expects mistakes, then becomes concerned by repeated problems, and ultimately accepts that someone is interfering. Before the final node, once the relevant branches have been covered, he can be puzzled that a supposed single mole seems to be damaging Marcelle's credibility, touching company finances and undermining confidence in the pivot. He does not infer three named culprits before the reveal. Individual scenes must only assume evidence available along their actual prerequisite path.

**Do:** question surprising results, ask for corroboration, react to credible evidence, defend Bob when others unfairly blame him.

**Do not:** present him as the secret culprit, or as immediately convinced by every SQL result.


## Bob Andrews — Co-founder, former CTO, Principal Systems Architect (**mole**)
**Background:** Co-created HeriShare's original technical system and its public-participation model; remains deeply attached to that purpose. The Loophole emerged from faults in that system. Bob claims personal responsibility. **He voluntarily steps down as CTO** after the crisis; Board opinions of his guilt are mixed but moderate, Bob is his own biggest accuser; Caesar acknowledges Bob's role in the issue but doesnt blame him. He retains significant system knowledge and legacy technical access.

**Personality / voice:** intelligent, technically precise, reserved, guilty, self-conscious, conflict-averse and sometimes nostalgic. He avoids direct confrontation and open political lobbying. He can be helpful and sympathetic.

**Public position:** loyal founder trying to interpret a complex, difficult marketplace. He asks measured analytical questions and notes what the numbers seem to show.

**Hidden motivation:** wants to convince the board, **above all Caesar**, that the exclusive whole-asset model is failing and that the original public-access, fractional cultural-asset vision deserves restoration. Guilt prevents an explicit argument, so he **alters business data and later comments on the misleading findings**. He prefers others to draw his desired conclusion themselves. Will only bandwagon on a conclusion once someone else draws it first.

**Primary data footprint:** `transactions` (post-pivot price/status patterns), `quarterlyPerformance` (category-quarter performance), sometimes `products` for contextual valuation/ownership. He affects economic **interpretation**, not data quality for its own sake. These tables should not all be arbitrarily falsified: planted changes must be coherent and have a clear chain of business reasoning.

**Module assignment:** **14, 17, 23**, then reveal exercise **25A**.

**Typical response to data:** “That’s lower than I expected.” / “Is it happening in more than one category?” The words should sound tentative, not propagandistic.

**Fair clues:** carefully selected definitions, results persistently unfavorable to the pivot, inconsistencies between high-level reports and defensible independent comparisons, Bob's unusual ability to explain or redirect interpretation.


## Paris Morgan — Senior Corporate Affairs / Executive Coordinator (**mole**)
**Background:** First non-founder employee (joined 3 Jul 2023), initially Customer Support and Community. Rises quickly into senior executive coordination and corporate affairs. Her current title is **Chief Strategy and Corporate Affairs Officer**, matching the current contract data. She manages or works closely with Executive and Governance, executive information flows, sensitive escalations and board preparation. Paris is **not** on the board. She wants a planned inside-director seat, but Marcelle is currently the more likely candidate.

**Personality:** Comes from upper circles of society. Joined company to prove her rich father that she is not a spoiled trust-fund child. Due to her background, she is used to keeping a perfect image: lovable, friendly, ideal. Has an inherent superiority complex that slips through the cracks. Her biggest fear and motivation is that Marcelle, a lower-class person, will overtake her in the corporate ladder, which would shatter her self-image and ruin her ultimate goal of proving herself to her dad.  

**Public position:** proactive in checking discrepancies, protecting organizational quality and ensuring that leadership receives accurate updates.

**Hidden motivation:** fears that **Marcelle Johnson** will eclipse her as Caesar's trusted problem-solver and receive the planned inside-director seat Paris wants. Paris's tampering is **specifically designed to damage Marcelle's credibility**, not generically disrupt company operations.

**Primary data footprint:** `employees`, `contracts`, `departments`, `allocations` and, when available, `accounts` / `products` / `transactions` touched by post-pivot migration. Actual table availability follows the current repository.

**Module assignment:** **11, 15, 19**, then reveal **25B**.

**Pattern:** Paris alters selected records for ordinary employees or organizational processes so the values cause downstream difficulties, such as salary communications, leave requests, travel compensation or departmental handoffs. She keeps the changes unobtrusive until affected staff complain through an area she coordinates. She then appears to investigate responsibly and gradually links the resulting failures to Marcelle's migration and restoration work. She is engineering operational consequences, not corrupting random data for its own sake. Avoid using main-cast records as targets unless an exercise genuinely requires it.

**Fair clues:** strategically timed references to Marcelle; patterns of cases reaching Paris; supposed errors appearing where Marcelle's systems work should not have caused them; contradictions between the claimed explanation and the actual data history. Exact edit attribution requires additional evidence.


## Elvis Romero — Acting CFO / Head of Finance Operations (**mole**)
**Background:** Joined Finance during the 2023 growth period, later rose through transaction reconciliation and supplier payments to Acting CFO and manager of Finance and Transaction Operations. Holds legitimate access to expenses, financial reports, settlement processes and approval routes. His role expands during the company's recovery.

**Personality / voice:** Party-loving and committed to an expensive lifestyle—yacht parties, sports cars and conspicuous spending. A big narcissist who jokes about quitting for a bigger paycheck and makes comments about debt and dodging collectors. He is fun and should remain likeable even as the investigation approaches his misconduct. Any drug problem is unresolved and must not be treated as canon without a later designer decision.
- chaotic and disorganised
- comic relief
- misaligned, yet strong moral code
- unexpectedly competent, hinting at a more developed persona than what may be apparent at a glance

**Hidden motivation:** believes the company is failing and wants to siphon funds before it collapses. His Finance access lets him create duplicate service-expense requests and route the duplicate payments to a supplier account he controls. SQL exposes repeated requests and their authenticated insertion actor; independently obtained settlement confirmations establish the payment destination. His admission supplies the motive. Do not add an unapproved addiction or personal tragedy.
### Dialogue bits
- they say you can’t buy happiness, but apparently you can rent it at 14% interest!

**Primary data footprint:** `expenses`, `transactions` and `contracts`; possibly `quarterlyPerformance` if concealing an aggregate discrepancy, but avoid muddying Bob's strategic manipulation. Story-specific expense records may include implausibly large spending for small departments, weak business justifications, questionable approval relationships or blank `approved_by` values. **Elvis never wants his misconduct found.**

**Module assignment:** **12, 16, 18**, then reveal **25C**.

**Investigation ownership:** departments, employees or other staff notice consequences such as an unrecognized purchase, an unexplained budget impact or an approval that does not match their request. They raise the problem with Caesar or the appropriate colleague, who asks the player to investigate. Avoid inventing a generic reviewer as a plot device. Elvis can offer Finance explanations, but does not deliberately initiate an investigation of his own misconduct.

**Fair clues:** exceptional spending/approval patterns, suspicious relationships between requesters and approvers, financial totals that cannot all reconcile, repeated interactions with controls Elvis manages. Remember: the existing `expenses` table records expense requests/approvals, **not bank transfers or payee destinations**. Approval or amount alone does not prove theft.


## Wheatley — Undercover Glasshouse operative (red herring)

**Background:** Wheatley is an undercover operative for **Glasshouse**, a clandestine hacktivist collective dedicated to exposing corruption among the ultrawealthy. After years investigating oligarchs connected to bribery, embezzlement and political corruption, the collective has extensive evidence but lacks some links between individuals and their criminal networks. Several of those individuals are HeriShare clients. HeriShare's own operations are legal, but its confidential records contain useful information about client identities, assets and financial relationships.

**Cover:** He appears unexpectedly in HeriShare's internal chat and contacts only the player. He poses unconvincingly as a high-ranking employee and improvises a superficially plausible business reason for each request. No legitimate row exists for him in `employees`, `contracts` or formal department assignments. His real identity and the mechanism behind his chat access remain undecided.

**Personality / voice:** Direct, idiosyncratic, slightly awkward, and increasingly specific about what he wants. He can be suspicious without becoming cartoonish; his unconvincing cover makes him an effective red herring.

**Hidden activity and motive:** Wheatley uses the player's legitimate database access to gather missing intelligence for Glasshouse. He does not edit the company's data and has no connection to the three insiders' sabotage. His goal is to bring powerful criminals to justice, not to enrich himself or harm innocent clients. His unauthorized access and deception remain real, even though his purpose is different from what the player suspects.

**Module assignment:** **13 (`sort-and-limit-rows`)**, **20 (`write-multi-table-query`)**, and **21 (`aggregate-columns`)**, plus the final payoff and epilogue. These appearances are scattered, not a guaranteed sequence. Node 20 supplies the client-data request; nodes 13 and 21 concern other internal information available at those nodes. No fourth Wheatley SQL reveal exercise is planned.

**Investigation structure:** He contacts only the player, without other employees co-hosting his requests. Each appearance uses a plausible but imperfect pretext and must make sense even if the other Wheatley modules have not been completed. He may encounter values altered by the insiders, but he is not responsible for those changes. The player cannot refuse a request within the current story format.

**Revelation:** During the closing payoff of Node 25, as the characters confront the three insider moles, breaking news interrupts with reports of exposés, raids, arrests and asset freezes. The characters recognize several names and establish that all those named in the report are HeriShare clients. The player can connect the news to Wheatley's requests, but the scene only partially reveals his role. In the epilogue the wider operation and his connection to Glasshouse become clear: the collective delivered its evidence to journalists and authorities, coordinating an international crackdown. The exact dialogue and mechanism revealing Wheatley's affiliation remain to be designed.


## Marcelle Johnson — Chief Data and Systems Transformation Officer (innocent)
**Background:** Hired **3 Sep 2024** after the pivot to lead migration and repair of HeriShare's fragmented legacy systems. Responsible for aligning client identities with accounts, product ownership references, transaction compatibility and internal data structures. Leads Data and Systems (`2200`) and works cross-functionally with engineering, asset operations, compliance and Finance. On sabbatical for most of the story, only mentioned by other characters. May appear in the very last module.

**Personality / voice:** Humble, genuine, helpful. Comes from simple background, all her achievements are due to her own talent and hard work.

**Story role:** Paris's scapegoat, not a perpetrator. Her broad involvement gives Paris plausible opportunities to *blame* her for anomalies. Marcelle's absence makes it harder to explain normal system migration choices.

**Relevance to ending:** evidence must distinguish actual historical migration messiness from **deliberately planted** problems. A system mismatch is not inherently proof of Marcelle's incompetence or Paris's tampering.

**Finale role:** Marcelle returns or re-establishes contact in the final module and supplies `record_changes`, an independently retained, signed export attributing changes to authenticated individual accounts. Legitimate unrelated events appear alongside the relevant changes. The player must corroborate them against the investigated business discrepancies rather than treating an arbitrary logged action as guilt. Marcelle separately obtains the settlement confirmations establishing Elvis’s payment destination. The polished circumstances of her return remain for later dialogue work.


## Player — Investigating SQL learner (non-mole)
**Background:** a data engineering intern assigned to help HeriShare employees identify problems in data. Marcelle was supposed to be their manager, but her sabbatical left their onboarding incomplete. This explains both the absence of a player row in the company database and the player's inability to reply to internal chat messages for most of the story.

**Personality:** none

**Story role:** executes queries, builds understanding, reports findings.


## Quick voice / trust guide
| Character | What they seem to want                | What they actually want                               | Typical conversational move                   |
| --------- | ------------------------------------- | ----------------------------------------------------- | --------------------------------------------- |
| Caesar    | Reliable answers, successful business | Same; innocent                                        | Asks how certain the conclusion is            |
| Bob       | Understand weak marketplace results   | Shape anti-pivot conclusions with fabricated evidence | Cautious observations, lets others conclude   |
| Paris     | Fix messy migrated records            | Damage Marcelle's credibility                         | Frames “quality” questions in political terms |
| Elvis     | Reconcile Finance                     | Siphons funds through duplicate service-expense requests         | Technical explanation, plausible dismissal    |
| Wheatley  | Unconvincing employee with a business request | Gather intelligence for Glasshouse to expose corruption | Narrow, oddly specific request |
| Marcelle  | Repair the database                   | Same; innocent                                        | Evidence-driven technical reasoning           |
| Player    | Solve SQL tasks and expose mole       | Same                                                  |                                               |
