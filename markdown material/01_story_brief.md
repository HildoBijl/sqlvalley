# SQLValley — Story Brief

**Purpose:** Canon and framing for the LLM implementing SQL exercises. This is an authoring reference, **not player-facing dialogue**. Later explicit decisions from the designer override older draft documents. The current repository module tree, table access rules, schemas, and finalized baseline table contents take precedence over conflicting older material. `accounts timeline cleaned.md` is the canonical account history.


## Logline
A player learning SQL is asked to help investigate suspicious data inside **HeriShare**, a cultural-asset marketplace in Santa Clara, California. Most of the recurring leadership cast considers the rumor of **a mole** plausible; CEO Caesar Vallelonga remains personally skeptical. Each skill module exposes a concrete problem through three increasingly useful SQL queries. What initially looks like one insider's sabotage is ultimately revealed to involve **three independent insider saboteurs**—Bob, Paris and Elvis—and **Wheatley**, an unrelated undercover operative who exploits the player's access. All four are suspicious figures, but Wheatley does not tamper with the company data.


## The player
- **Role:** a new data engineering intern helping employees identify suspicious/malformed database records. Marcelle was supposed to manage and onboard them, but began her sabbatical before completing that process. Other characters bring problems; the player interrogates the database and reports what the results show.
- **Starting knowledge:** the player is told **from the outset** that a mole is believed to be responsible for data issues, and is tasked with helping identify the tampered data, figure out the motives and the culprit. Neither the player, nor the characters know there are four culprits.
- **Capabilities:** query only the tables unlocked for the current skill node; learn SQL progressively. The interface may reveal query output, but **the player does not edit data simply by writing SELECT queries**. Fixes/repairs, where part of the fiction, occur via the surrounding workflow/dialogue unless an implementation feature explicitly supports them.
- **Database identity:** the player's incomplete onboarding explains why they do **not** have a row in `employees` or an ordinary contract. It also explains why the player cannot reply to messages for most of the story. Do not invent a player record.
- **Agency:** The player can only solve queries. They are talked to by the characters and asked to investigate certain issues. Avoid having other characters conclusively solve the mystery for them before Node 25.


## Company and setting
### The original HeriShare (2023–mid 2024)
HeriShare begins in January 2023 when friends **Caesar Vallelonga** and **Bob Andrews** devise a mission-driven way to make culturally significant artworks and objects more accessible. The founding ethos is to preserve cultural heritage and loosen private ownership's grip by letting ordinary users participate fractionally in assets and restoration projects.

Core history:
- **18 Jan 2023:** Caesar and Bob develop the idea as a student-led venture.
- **9 Feb:** proof-of-concept prototype; initial assets are mock listings.
- **11 Apr:** first genuine institutional supplier, the small **Northbridge Museum of Modern Craft & Design**.
- **6 May:** public V1 launch and first real commercial activity.
- **2–23 Jun:** incorporation, accelerator entry, seed financing and formal employment begin.
- **25 Aug–19 Nov:** partnerships, staff and product categories proliferate; an internal secondary market launches on **5 Oct**. November publicity accelerates national growth.

### The Loophole and collapse (Apr–Aug 2024)
A flaw in the fractional-ownership model allows a wealthy beneficial owner to aggregate majority influence via multiple apparently separate accounts/entities. Majority holders start exercising control in ways that undermine the preservation/public-access mission, including a request to relocate an asset to private property. Internal confusion escalates, a media leak occurs **11 May 2024**, and HeriShare shuts down its platform **9 June 2024**. Lawsuits, institutional withdrawals, staff departures and financial distress follow.

**Bob feels personally responsible** for the weakness in the system. The company does not turn him into a scapegoat; Caesar still cares for and trusts his friend.

### The pivot and recovery (Aug 2024–Apr 2025)
- **25 Aug 2024:** the board approves a pivot to a more exclusive, private whole-asset marketplace for collectors, estates, dealers, auction houses, family offices and select institutions.
- Bob steps down as CTO **voluntarily**, remaining a founder and principal systems architect. He would rather repair the original vision but feels too guilty and insecure to argue against the pivot openly.
- **3 Sep:** senior data/systems specialist **Marcelle Johnson** arrives to repair/migrate the messy legacy database, including merging former institutional clients into `accounts`.
- **29 Sep:** quiet relaunch as an **Exclusive Asset Marketplace**.
- **Oct–Apr 2025:** selective hiring, increasing whole-asset trading and commercial recovery. The new model can earn more revenue per deal, despite having far fewer transactions than the former fractional system.

### The investigation (current story)
Marcelle is absent on **sabbatical**, leaving her transformation work—and her reputation—vulnerable to attack. Members of the recurring leadership cast detect apparently unrelated data problems and ask the player to investigate. Everyone except Caesar considers the mole theory plausible. Exactly four people independently exploit the moment:
- **Bob:** manufactures evidence that the new business model is failing, hoping Caesar and the board will conclude that the original HeriShare mission should be restored.
- **Paris:** changes selected ordinary employees' or organizational records so that downstream processes produce real complaints in areas she coordinates, such as salary communications, leave requests and travel compensation. When those complaints reach her, she investigates and steers attention toward Marcelle's data work. The purpose is to damage Marcelle's credibility while keeping the manipulation unobtrusive; use main-cast members as affected records only when necessary.
- **Elvis:** uses Finance access for financial misconduct involving questionable expenses and approvals. Departments or staff notice purchases, requests or budget impacts they cannot reconcile and bring them to Caesar; Elvis does not deliberately initiate an investigation into his own misconduct. His exact scheme and sympathetic personal motivation are not yet finalized.
- **Wheatley:** an undercover operative for **Glasshouse**, a clandestine hacktivist collective investigating corruption among the ultrawealthy. Glasshouse has extensive evidence of bribery, embezzlement and political corruption, but needs information connecting certain individuals to their networks. Some targets are HeriShare clients; the company's legal, confidential records can supply identities, assets and financial relationships. Wheatley poses unconvincingly as an employee, contacts only the player and exploits their query access. He has no legitimate employee record, does not alter HeriShare's data and has no connection to the insiders' sabotage. He seeks justice, not personal enrichment or harm to innocent clients. His identity and purpose remain hidden during the investigation.


## The central dramatic question
**Who is the mole, what have they done, and why?** The intended realization is that “the mole” is a **false singular explanation**: different suspicious patterns have different causes and motives. The player should slowly separate these patterns rather than immediately identify the associated culprits.


## Stakes
- **Business:** management and the board may make strategic decisions using fabricated performance evidence.
- **Professional:** an innocent senior employee (Marcelle) risks losing credibility or influence.
- **Financial:** money may be diverted while the company is recovering from a near-collapse.
- **Security/confidentiality:** an outsider is using the player's legitimate query access to obtain sensitive business and personal information.
- **Personal:** Caesar's friendship with Bob, Paris's ambitions, and employees' livelihoods are affected by the conclusions drawn from SQL results.
- **Mission:** the conflict between HeriShare's original public-cultural ideal and its profitable exclusivity is emotionally important, particularly to Bob.


## Tone and dialogue principles
- **Grounded workplace mystery**, not slapstick or a melodramatic thriller. Characters behave like capable employees with believable agendas and incomplete information.
- Tension emerges from **ordinary-looking rows, missing context, overconfident interpretations and repeated patterns**. Not every odd record is proof of a conspiracy.
- **Bob:** restrained, self-doubting, personally invested. His manipulation is aimed at the *interpretation* of data. Never portray him as vilified by Caesar, or openly campaigning against the pivot.
- **Paris:** controlled, credible and politically strategic. She makes small, targeted changes that cause downstream problems, then responds to the resulting complaints as an executive coordinator and uses the apparent data failures against Marcelle. She is not creating random mess for its own sake.
- **Elvis:** helpful and credible when discussing Finance; does **not** voluntarily steer the player into his own theft trail.
- **Wheatley:** isolated, oddly direct and unconvincing as an employee, with requests that become intrusive. Queries return the values recorded in the database, including any changes made by others; Wheatley does not alter them. His apparent involvement is a red herring. The player has no dialogue choice and must carry out the exercises.
- **Caesar:** earnest, optimistic about the new business and loyal to Bob; a useful listener, decision maker and skeptical questioner, not a mole. He moves from assuming mistakes, through concern about repeated discrepancies, to conviction that someone is interfering once evidence supports it. Before the finale he can notice that the apparent motives are scattered across staff administration, Finance and the pivot, and wonder why one mole would pursue all of them.
- **Marcelle:** innocent target of Paris's framing; **not** a hidden saboteur. Her absence explains why she cannot immediately defend technical decisions.
- Keep lines concise and conversational, letting results do the explaining. Avoid announcing motives before the reveal.


## Standard module loop
Every practical SQL skill module that exists in the repository contains **three procedural SQL exercises using that module's SQL topic**. A consistent framing:
1. **Pre-module dialogue:** a character (not necessarily the perpetrator) describes a real company problem or data need tied to the mole investigation.
2. **Query 1:** identify the initial symptom using the taught skill; character comments on the result.
3. **Query 2:** narrow or contextualize that issue, still using the same skill; character reacts.
4. **Query 3:** validate the scope or obtain the decisive output for that module; character reacts.
5. **Post-module dialogue:** reach a **provisional conclusion** and contribute a clue. **Do not reveal the culprit until Node 25.**
The 3 Queries do not have to forcefully follow this pattern. Its more important that they challenge the player on various aspects of the skill, and that they have modularity that allows a degree of replayability/practice. The 3 queries are preceded by the same setup dialogue regardless of the individual parameters, each have their own parametrized prompt and payoff, and all 3 share the same conclusive dialogue. Its important that these 3 separate elements flow into each other in a natural manner. 

The assigned mole means **whose action explains the issue**, not necessarily who speaks to the player. Their identity remains hidden from the player in nonfinal modules. Wheatley's side branches are an exception: the issue is his **inappropriate request for access**, not damaged rows.


## Skill-tree and story structure
- The concept modules in the repository's SQL tree are **theory only**: conversation and explanatory material, no graded SQL exercises.
- The practical SQL modules are those currently present in the repository, each with three exercises. The order of completion can vary because the curriculum is a **directed acyclic graph**, not a single linear chapter list. Narrative progression may assume that parent modules were completed; alternative skip paths do not need separate dialogue.
- **Insider assignments:** Paris 11, 15 and 19; Elvis 12, 16 and 18; Bob 14, 17 and 23. Each is revealed in one of the three Node 25 exercises. These are thematic branches, not a guaranteed completion order.
- **Wheatley's scattered appearances:** 13 (`sort-and-limit-rows`), 20 (`write-multi-table-query`) and 21 (`aggregate-columns`). Node 20 is his client-data investigation; nodes 13 and 21 gather other internal information. Each appearance must stand alone when its other Wheatley nodes are not prerequisites. The former Pivot Table and Dynamic Aggregation modules remain removed.
- **Node 25:** three advanced investigations reveal **Bob, Paris and Elvis**. During their confrontation's closing payoff, breaking news interrupts: exposés, raids, arrests and asset freezes target wealthy individuals, and the characters recognize several and establish that all those named in the report are HeriShare clients. The connection to Wheatley's suspicious requests is suggested rather than fully explained. In the epilogue, the wider Glasshouse operation and Wheatley's role become clear to the player. Wheatley has no fourth SQL reveal exercise; the mechanism by which his affiliation is revealed is not yet specified.
- The player has **no reason at first to suspect multiple different moles**. Caesar may recognize that the interference affects different parts of the company and appears to serve different purposes, while still trying to reconcile the clues with a single mole. The conflicting motives become clearest immediately before the finale, after its prerequisite branches have been covered; the three insider identities and the fact that they acted independently are revealed in the final module.


## Data-model reality to respect
- Canonical baseline tables and their availability are defined by the current repository. This includes `allocations`, which may be used in player exercises where the repository exposes it.
- Canonical `transactions` table contains **post-pivot whole-asset transactions only** (starting September 2024); historical fractional trades are **not** present there.
- `quarterlyPerformance.total_transactions` uses **fractional-trading counts pre-pivot** and **whole-asset transaction attempts post-pivot**. Do not treat those measures as directly comparable without explanation.
- `products.owned_by` holds the **current reconciled owner**, not necessarily the seller or owner at the time of every historical transaction. **A past transaction vendor differing from the current owner is not automatically corruption.**
- `quarterlyPerformance` includes `quarter`, `fiscal_year`, `category`, `revenue`, `operating_expenses`, `total_transactions`, `updated_at`; it **has no `growth_rate` field**. `operating_expenses` can represent fully loaded category allocation, including shared overhead/payroll, and is **not** a direct sum of `expenses.amount`.
- Base CSVs were designed as **normal filler data**. Plot-critical tampering must be added separately, with exact records and expected query outcomes documented.
- `employees` and `contracts` can join on `e_id`; `departments` can join to an employee via `manager_id`; `allocations` connects employees and departments where it is available.
- The baseline schema has no explicit row-edit history, SQL-user activity ledger, cash destination/transfer table or persisted data snapshots. The final module requires additional evidence, potentially a work-presence table provisionally called `checkInOut` or an independently retained change history. The new evidence alone must not identify a mole. Each of the three final exercises combines it with earlier investigations and returns the single responsible insider: Bob, Paris, or Elvis. Its exact form, fields, semantics, and records remain to be designed. Wheatley is absent from legitimate employee records and his connection to Glasshouse is revealed through the ending, not a fourth exercise.
- Characters may repair identified data in the fiction, but the player's database does not mutate as modules are completed. The player only runs read-only queries.


## Non-goals and unresolved details
- No fixed dialogue script or exact exercise SQL is canonized by these briefs. The designer writes dialogue and final exercises; the worker LLM implements those supplied inputs.
- Exact timing of the player's arrival relative to 30 Apr 2025 and the exact circumstances of Marcelle's return or renewed internet access remain flexible until finalized.
- Exact insider edit methods, Elvis's scheme and personal motive, the finale evidence-table schema, Wheatley's real identity and chat-access method, the implicated clients, and the precise mechanism and dialogue revealing his Glasshouse role remain to be designed. His Glasshouse affiliation and purpose are established canon. **Do not invent the unresolved details.**
