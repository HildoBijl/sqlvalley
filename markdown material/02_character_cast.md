# SQLValley — Character Cast and Motivations

**Purpose:** Private authoring bible for dialogue and SQL exercise implementation. **Spoilers throughout.** Later explicit player-designer decisions override older reference files. Do not expose perpetrator labels in player-facing dialogue before the finale.

**Important:** over the story modules, the player has to build a personal rapport to each character, to understand their personality, ambitions, etc. All characters should be relatable in their own way, so the player can connect emotionally with each, for their own reasons. This is needed for the final twist of 4 moles to have the desired emotional effect. 
Wheatley is an exception: he is intentionally vague, and his presence and questionable queries act as a red herring. 
Each mole is aware of their own actions, but do not consider themselves the mole, as the combined tampering of every other mole seems way larger than their own. None of them is aware that the others are also at fault. 

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
Every time he's present for a module, he gets a little more convinced that the mole is real. At first he's dismissive, then concerned.

**Do:** question surprising results, ask for corroboration, react to credible evidence, defend Bob when others unfairly blame him.

**Do not:** present him as the secret culprit, or as immediately convinced by every SQL result.

## Bob Andrews — Co-founder, former CTO, Principal Systems Architect (**mole**)
**Background:** Co-created HeriShare's original technical system and its public-participation model; remains deeply attached to that purpose. The Loophole emerged from faults in that system. Bob claims personal responsibility. **He voluntarily steps down as CTO** after the crisis; Board opinions of his guilt are mixed but moderate, Bob is his own biggest accuser; Caesar acknowledges Bob's role in the issue but doesnt blame him. He retains significant system knowledge and legacy technical access.

**Personality / voice:** intelligent, technically precise, reserved, guilty, self-conscious, conflict-averse and sometimes nostalgic. He avoids direct confrontation and open political lobbying. He can be helpful and sympathetic.

**Public position:** loyal founder trying to interpret a complex, difficult marketplace. He asks measured analytical questions and notes what the numbers seem to show.

**Hidden motivation:** wants to convince the board, **above all Caesar**, that the exclusive whole-asset model is failing and that the original public-access, fractional cultural-asset vision deserves restoration. Guilt prevents an explicit argument, so he **alters business data and later comments on the misleading findings**. He prefers others to draw his desired conclusion themselves. Will only bandwagon on a conclusion once someone else draws it first.

**Primary data footprint:** `transactions` (post-pivot price/status patterns), `quarterlyPerformance` (category-quarter performance), sometimes `products` for contextual valuation/ownership. He affects economic **interpretation**, not data quality for its own sake. These tables should not all be arbitrarily falsified: planted changes must be coherent and have a clear chain of business reasoning.

**Module assignment:** **14, 20, 21, 23**, then reveal exercise **25A**.

**Typical response to data:** “That’s lower than I expected.” / “Is it happening in more than one category?” The words should sound tentative, not propagandistic.

**Fair clues:** carefully selected definitions, results persistently unfavorable to the pivot, inconsistencies between high-level reports and defensible independent comparisons, Bob's unusual ability to explain or redirect interpretation.

## Paris Morgan — Senior Corporate Affairs / Executive Coordinator (**mole**)
**Background:** First non-founder employee (joined 3 Jul 2023), initially Customer Support and Community. Rises quickly into senior executive coordination and corporate affairs. Her current title is **Chief Strategy and Corporate Affairs Officer**, matching the current contract data. She manages or works closely with Executive and Governance, executive information flows, sensitive escalations and board preparation. Paris is **not** on the board. She wants a planned inside-director seat, but Marcelle is currently the more likely candidate.

**Personality:** Comes from upper circles of society. Joined company to prove her rich father that she is not a spoiled trust-fund child. Due to her background, she is used to keeping a perfect image: lovable, friendly, ideal. Has an inherent superiority complex that slips through the cracks. Her biggest fear and motivation is that Marcelle, a lower-class person, will overtake her in the corporate ladder, which would shatter her self-image and ruin her ultimate goal of proving herself to her dad.  

**Public position:** proactive in checking discrepancies, protecting organizational quality and ensuring that leadership receives accurate updates.

**Hidden motivation:** fears that **Marcelle Johnson** will eclipse her as Caesar's trusted problem-solver and receive the planned inside-director seat Paris wants. Paris's tampering is **specifically designed to damage Marcelle's credibility**, not generically disrupt company operations.

**Primary data footprint:** `employees`, `contracts`, `departments`, `allocations` and, when available, `accounts` / `products` / `transactions` touched by post-pivot migration. Actual table availability follows the current repository.

**Module assignment:** **11, 15, 17, 19**, then reveal **25B**.

**Pattern:** start with apparently independent data-quality errors; move toward errors seemingly concentrated in Marcelle's migration and restoration scope; gradually allow the player to question why the evidence is *so conveniently* targeted. Paris may initiate an investigation or merely join its interpretation.

**Fair clues:** strategically timed references to Marcelle; patterns of cases reaching Paris; supposed errors appearing where Marcelle's systems work should not have caused them; contradictions between the claimed explanation and the actual data history. Exact edit attribution requires additional evidence.

## Elvis Romero — Acting CFO / Head of Finance Operations (**mole**)
**Background:** Joined Finance during the 2023 growth period, later rose through transaction reconciliation and supplier payments to Acting CFO and manager of Finance and Transaction Operations. Holds legitimate access to expenses, financial reports, settlement processes and approval routes. His role expands during the company's recovery.

**Personality / voice:** Party-loving and committed to an expensive lifestyle—yacht parties, sports cars and conspicuous spending. A big narcissist who jokes about quitting for a bigger paycheck and makes comments about debt and dodging collectors. He is fun and should remain likeable even as the investigation approaches his misconduct. Any drug problem is unresolved and must not be treated as canon without a later designer decision.
- chaotic and disorganised
- comic relief
- misaligned, yet strong moral code
- unexpectedly competent, hinting at a more developed persona than what may be apparent at a glance

**Hidden motivation:** unfinished. It will combine his large-living personality, financial pressure and a sympathetic or relatable element that has not yet been designed. He uses genuine Finance access for misconduct involving questionable expenses and approvals, but the exact scheme must not be invented yet.
### Dialogue bits
- they say you can’t buy happiness, but apparently you can rent it at 14% interest!

**Primary data footprint:** `expenses`, `transactions` and `contracts`; possibly `quarterlyPerformance` if concealing an aggregate discrepancy, but avoid muddying Bob's strategic manipulation. Story-specific expense records may include implausibly large spending for small departments, weak business justifications, questionable approval relationships or blank `approved_by` values. **Elvis never wants his misconduct found.**

**Module assignment:** **12, 16, 18**, then reveal **25C**.

**Investigation ownership:** other staff or routine reviews should initiate cases that approach his suspicious records. Elvis can be present as a subject-matter expert and offer explanations. He may legitimately lead Finance training tasks that **do not** investigate his own crime.

**Fair clues:** exceptional spending/approval patterns, suspicious relationships between requesters and approvers, financial totals that cannot all reconcile, repeated interactions with controls Elvis manages. Remember: the existing `expenses` table records expense requests/approvals, **not bank transfers or payee destinations**. Approval or amount alone does not prove theft.

## Wheatley — Unverified internal-chat identity (**mole**, unresolved motive)
**Background:** Appears unexpectedly in HeriShare's internal company chat and contacts only the player. His access and improvised explanations imply that he is a legitimate, high-ranking employee, but he gives a different superficially plausible business reason for each request. **No legitimate row exists for him in `employees`, `contracts` or formal department assignments.** His real employer, ultimate identity and purpose are intentionally unspecified.

**Personality / voice:** direct, idiosyncratic, slightly awkward, possibly overly casual or cryptic. Increasingly specific about what he wants; surprisingly uninterested in ordinary workplace relationships. Can be a little more suspicious than everyone else without becoming cartoonishly evil.

**Public behavior:** requests apparently straightforward SELECT queries and reports, often ranking or aggregating sensitive data. No need for him to falsify underlying records.

**Hidden activity:** uses the player as his data retrieval channel. His one exercise can focus on sensitive data available at that point and on tables used less by the other threads. **He is a genuine bad actor and a deliberate red herring**, drawing disproportionate suspicion away from the three insiders.

**Module assignment:** **13 (`sort-rows`)**, plus a **post-25 dialogue reveal** (not a fourth Wheatley SQL exercise). The removed Pivot Table and Dynamic Aggregation modules are not part of the story.

**Investigation structure:** isolated contact through the Sort Rows module. He obtains a sensitive ranked internal report under an improvised pretext. Other characters do **not** co-host his session, and the player has no option to reject the request.

**Revelation:** after the three insider reveals, Marcelle's return or restored contact may finally let the player speak. The planned interaction gives the player one dialogue option: bring up Wheatley. The other characters react with surprise and confusion, because nobody matching him exists in the company records. The exact exchange and the reason his chat access looked legitimate will be designed later. His real identity, employer and purpose remain unresolved.

## Marcelle Johnson — Chief Data and Systems Transformation Officer (innocent)
**Background:** Hired **3 Sep 2024** after the pivot to lead migration and repair of HeriShare's fragmented legacy systems. Responsible for aligning client identities with accounts, product ownership references, transaction compatibility and internal data structures. Leads Data and Systems (`2200`) and works cross-functionally with engineering, asset operations, compliance and Finance. On sabbatical for most of the story, only mentioned by other characters. May appear in the very last module.

**Personality / voice:** Humble, genuine, helpful. Comes from simple background, all her achievements are due to her own talent and hard work.

**Story role:** Paris's scapegoat, not a perpetrator. Her broad involvement gives Paris plausible opportunities to *blame* her for anomalies. Marcelle's absence makes it harder to explain normal system migration choices.

**Relevance to ending:** evidence must distinguish actual historical migration messiness from **deliberately planted** problems. A system mismatch is not inherently proof of Marcelle's incompetence or Paris's tampering.

**Finale role:** Marcelle returns or re-establishes contact in the final module and provides access to a new table, provisionally called `checkInOut`, containing work-presence or login-time information. This table alone does not reveal a culprit. Its exact schema and the circumstances of Marcelle's return remain unresolved.

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
| Elvis     | Reconcile Finance                     | Financial misconduct; exact scheme unfinished         | Technical explanation, plausible dismissal    |
| Wheatley  | Not very clear                        | Obtain sensitive information (final motive unknown)   | Narrow, oddly specific request                |
| Marcelle  | Repair the database                   | Same; innocent                                        | Evidence-driven technical reasoning           |
| Player    | Solve SQL tasks and expose mole       | Same                                                  |                                               |
