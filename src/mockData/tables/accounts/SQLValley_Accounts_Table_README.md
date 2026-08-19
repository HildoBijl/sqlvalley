# SQLValley Accounts Table README

## 1. Purpose

`accounts` is the identity and ownership registry for HeriShare/SQLValley. Its rows represent several different populations accumulated over the company's history: prototype users, retail signups, wealthy investors, duplicate or coordinated accounts, former institutional partners, and post-pivot buyers and sellers.

The table is intentionally imperfect. A username identifies an account, not necessarily a unique human or legal entity. The same person or institution may control several accounts, while an institutional account may be stored in fields designed for a natural person.

**Final dataset size:** 1,500 rows.

## 2. Columns

| Column | Meaning and interpretation |
|---|---|
| `username` | Primary key and account identifier used as a foreign key in other tables. Unique per row, but not per person or organisation. |
| `phone` | Contact number stored as `AAA-EEE-NNNN`. Nullable. Reuse across related accounts is possible. |
| `email` | Personal or institutional contact address. Nullable. Consumer domains dominate before the pivot; institutional domains become common after migration. |
| `verified` | Historical meaning changes. Before the pivot, it generally means signup verification was completed. After the pivot, it means the account or representative was manually approved or administratively confirmed. |
| `first_name`, `last_name` | Name fields for an individual. Nullable. Migrated institutions are sometimes split across these fields or stored entirely in one field. |
| `address` | Residence, institutional office, estate, storage site, or representative address. Nullable. Shared addresses can indicate households, dorms, organisations, family offices, or coordinated accounts. |
| `city` | City and state, formatted as `City, ST`. |
| `created_at` | SQLite-compatible datetime text: `YYYY-MM-DD HH:MM:SS`. For migrated clients, this is the migration date rather than the original partnership date. |
| `last_login_at` | Latest recorded login, or `NULL` if no successful login occurred. It is a behavioural clue, not a formal account or partnership status. |
| `relevant_later` | Author-facing flag marking accounts intended for later plot points or exercises. This is metadata rather than normal production data. |
| `phase` | Numeric story phase: `1` startup, `2` accelerator, `3` loophole/crisis, `4` pivot/recovery. |
| `event_number` | Event from the main SQLValley timeline that produced the row. |

## 3. Dataset milestones

| Event | Data represented | New rows | Running total |
|---:|---|---:|---:|
| 2 | Prototype founders, relatives, roommates, and test accounts | 15 | 15 |
| 3 | Student Startup Night registrations | 30 | 45 |
| 4 | First museum partnership interest | 35 | 80 |
| 5 | Public V1.0 launch | 95 | 175 |
| 6, 7, 11-14 | Registration, accelerator exposure, listings, Demo Day, marketplace launch | 125 | 300 |
| 15 | Viral coverage and its continued national growth | 630 | 930 |
| 16 | First coordinated majority accumulation | 25 | 955 |
| 17 | Loophole spreads to additional wealthy users | 25 | 980 |
| 18 | Relocation dispute and final coordinated signups | 20 | 1,000 |
| 19 | Media leak, duplicate surge, and speculative accounts | 200 | 1,200 |
| 20-21 | Signup freeze and full shutdown | 0 | 1,200 |
| 23 | Former `clients` migrated into `accounts` | 150 | 1,350 |
| 24 | Exclusive marketplace relaunch | 40 | 1,390 |
| 25 | Recovery-period applicants and professionals | 110 | 1,500 |

Event 15 is intentionally split across two generated batches: the initial ten-day viral spike and the slower continuation through 20 April 2024.

## 4. Global data rules

- Approximately 5% of each generated batch contains a `NULL` in `phone`, `email`, a name field, or `address`.
- CSV files use the literal text `NULL`; import logic should convert it to SQL `NULL`.
- Phone and email values are synthetic but formatted to look plausible.
- Early signups are concentrated in Silicon Valley. Event 15 expands the user base across the United States, with a strong bias toward large urban and financial markets.
- Shared addresses are often deliberate and may represent families, dorms, roommates, institutions, or coordinated ownership.
- Pre-pivot usernames are informal and varied. Migrated usernames are usually systematic, lower-case, and derived from an institution or representative.
- Account deletion is rare because usernames are referenced by ownership and transaction history. Obsolete, duplicate, rejected, and inactive rows therefore remain in the table.

## 5. How the data changes over time

### Startup data: Events 2-5

The earliest rows are relatively clean but manually entered. Family addresses and dorm addresses are reused openly. Most users are legitimate; incomplete rows usually represent people who helped test or briefly explored the platform.

`caesar` and `bobby` remain active long after the prototype. Their family members and dorm roommates mostly log in only during testing. Event 3 contains visible roommate clusters created within seconds or minutes of one another. Event 4 broadens the users to museum supporters and art enthusiasts. Event 5 introduces the first substantial public signup wave.

### Growth data: Events 6-15

Organic growth produces mostly genuine, verified accounts. The internal marketplace attracts more investment-oriented usernames and longer-lasting activity. Event 15 changes the geography of the table: New York, Los Angeles, San Francisco, Chicago, Boston, Miami, Seattle, Washington, Austin, Dallas, Houston, Atlanta, and Philadelphia become major sources of accounts.

### Loophole data: Events 16-19

A username no longer approximates a unique person. Wealthy users create alternate, holding, family-office, and collector accounts. Event 19 then adds large clusters of near-duplicates, abbreviated names, altered emails, and inconsistent verification states.

The obvious duplicates are intentional. They are designed for exercises involving self-joins, grouping by shared data, CTEs, window functions, and reconstruction of beneficial ownership.

### Migration and pivot data: Events 23-25

Event 23 imports 150 former partner records from the obsolete `clients` table. All rows receive a 3 September 2024 `created_at`, even though the relationships are older.

The migration contains four main patterns:

1. **Departing partners:** most log in during September to inspect or reject the pivot and never return.
2. **Unresponsive partners:** no login, missing data, outdated representative, or unsuccessful activation.
3. **Reluctant survivors:** occasional post-relaunch logins and limited marketplace activity.
4. **Active survivors:** verified, complete, and active into 2025.

Among the 150 imported rows, approximately 90 reject the pivot, 25 never respond, 15 log in mainly to object, 12 continue reluctantly, and 8 actively embrace the new model.

Event 24 introduces manually reviewed collectors, dealers, family offices, auction houses, and professional sellers. Event 25 adds slower, steadier growth during recovery.

## 6. Important individual accounts

### Founders and prototype group

| Username | Entry | Importance |
|---|---|---|
| `caesar` | Caesar Vallelonga | Co-founder and one of the earliest rows. Remains active throughout the dataset. |
| `bobby` | Bob Andrews | Technical co-founder. His activity persists beyond the prototype and ties the account table to later internal events. |
| `bobmom`, `robertandrews` | Linda and Robert Andrews | Bob's parents. Shared address provides a legitimate family-account pattern. |
| `GabrielV`, `CarmenV` | Gabriel and Carmen Vallelonga | Caesar's parents. Another legitimate shared-household cluster. |
| `skyl4r27` | Incomplete Event 3 signup | Example of a genuine but abandoned account with missing identity and contact data. |
| `ZeeWilliams` | Zoe Williams | Early student-era user who remains active much longer than most Event 3 signups. |

### Principal wealthy users and their linked accounts

The following users are the clearest beneficial-ownership clusters. Their records deliberately reuse names and addresses while changing usernames, emails, account styles, and verification states.

| Person | Original account | Important linked accounts | Function in the data |
|---|---|---|---|
| Augustus Vane | `AuggieVane` | `avane_alt`, `augvan_hold1`, `augvane7`, `vanecapital2`, `avane_new3`, `augustus_collector4`, `vanefamilyoffice` | Earliest and most explicit multi-account accumulation pattern; later reappears as a family-office account. |
| Celeste Roth | `CelesteRoth` | `croth_alt`, `celrot_hold2`, `celroth7`, `rothcapital2`, `croth_new3`, `celeste_collector4`, `rothartadvisory` | Parallel New York ownership cluster and post-pivot advisory entity. |
| Malcolm Wexler | `MWexler` | `mwexler_alt`, `malwex_hold3`, `malwexler7`, `wexlercapital2`, `mwexler_new3`, `malcolm_collector4`, `wexlercollection` | Los Angeles cluster showing personal, capital, collector, and collection identities. |
| Vivienne Cross | `vivienne.cross` | `vcross_alt`, `vivcro_hold4`, `vivcross7`, `crosscapital2`, `vcross_new3`, `vivienne_collector4`, `crossventuresart` | San Francisco cluster linking the pre-pivot loophole to the exclusive relaunch. |
| Ronan Ashcroft | `ronanA` | `ronash_hold5`, `ronashcroft7`, `ashcroftcapital2`, `rashcroft_new3`, `ronan_collector4`, `ashcroftcollection` | Chicago cluster with multiple Event 19 aliases and a later collection account. |
| Helena Vale | `HelenaVale` | `helval_hold6`, `helvale7`, `valecapital2`, `hvale_new3`, `helena_collector4`, `valeheritagefund` | Boston cluster that later adopts a heritage-fund identity. |

Other prominent users introduced during the national wave include `TheoKincaid`, `CeliaSterling`, `GrantMercer`, `nadia_whitmore`, `OscarBexley`, `EleanorRook`, `DominicHale`, and `PriyaSethi`. Their linked accounts appear mainly in Events 17 and 18, such as `theo_kinc2`, `celi_ster3`, `gmercer_family1`, `nwhitmore_family2`, `obexley_family3`, `erook_family4`, `dhale_family5`, and `psethi_family6`.

## 7. Important migrated and post-pivot accounts

| Username | Entity or person | Data significance |
|---|---|---|
| `northbridgemuseumofmoderncra` | Northbridge Museum of Modern Craft & Design | First institutional partner and an active survivor. The institution name is split across person fields, and the username is truncated. Active through April 2025. |
| `greatlakesindustrialartsmuse` | Great Lakes Industrial Arts Museum | Verified imported partner that logs in during September and then leaves, illustrating rejection of the pivot. Its `last_name` is `NULL`. |
| `southbanktextilearchive` | Southbank Textile Archive | Logs in shortly after migration mainly to inspect or object, then becomes inactive. |
| `redcedarfolkartfoundation` | Red Cedar Folk Art Foundation | Another verified institution that exits before rebranding. |
| `bellwethermaterialcultureins` | Bellwether Material Culture Institute | Imported but unverified, with no login. Represents unresponsive or obsolete partner data. |
| `ashlandmuseumofprintedarts` | Ashland Museum of Printed Arts | A surviving institutional account with activity after the relaunch. |
| `vanefamilyoffice`, `rothartadvisory`, `wexlercollection`, `crossventuresart`, `ashcroftcollection`, `valeheritagefund` | Post-pivot entities controlled by previously prominent users | Show how personal loophole-era identities are formalised as professional entities under the exclusive marketplace model. |
| `davisauctionpartners`, `howellartadvisory`, `howardfineobjects`, `liucollections` | New professional sellers and intermediaries | Representative Event 24 accounts: manually reviewed, business-oriented, and active after rebranding. |

Institutional usernames can be truncated because they are generated from long organisation names. The underlying row remains unique, but a username should not be treated as a complete legal name.

## 8. Interpretation cautions

- **Do not equate account with person.** One person may own several usernames; one organisation may have several representative or historical accounts.
- **Do not treat `verified` consistently across all years.** Its practical meaning changes after the pivot.
- **Do not use `last_login_at` as a formal termination flag.** It can indicate abandonment, objection, migration testing, administrative access, or continued use.
- **Do not treat `created_at` as the beginning of an institutional relationship.** Event 23 rows all use the migration date.
- **Do not deduplicate solely by address.** Families, roommates, museums, offices, and estates legitimately share addresses.
- **Do not delete obvious duplicates automatically.** Historical transactions may still reference each username.
- **Use `relevant_later` only as author metadata.** Player-facing exercises should normally discover relevant rows through the actual data patterns.

## 9. Recommended use in exercises

The table supports date filtering, `NULL` handling, grouping, `HAVING`, self-joins, duplicate detection, CTEs, window functions, activity segmentation, and joins to ownership or transaction records. The strongest investigative tasks should require combining several weak indicators rather than relying on a single field.
