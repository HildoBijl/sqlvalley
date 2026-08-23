## 1. Generation rules

Final table schema remains unchanged. The generated CSV may contain only four helper columns: `phase`, `event`, `listed_at`, and `is_relevant`. No `listed_by`, creator, year, initial appraisal, buyer, or narrative helper columns are added.

`owned_by` initially stores the supplier that listed the asset. Pre-pivot this identifier conceptually belonged to the defunct `clients` table; after Event 23 the same stable identifier exists in `accounts`. After the transactions table is generated, `owned_by` will be updated to the latest completed buyer.

## 2. Product naming

Names use mixed levels of detail. High-value or renowned assets usually include artist, title, year, edition, or provenance. Lower-value and everyday cultural assets may use concise catalogue names such as `Bon Jovi Tour Outfit`, `Victorian Era Monocle`, `Star Wars Lightsaber Prop`, `Closed Cinema Ticket Machine`, or `Olympic Relay Torch`.

Scope should broaden over time: early inventory is dominated by local design, craft, records, and restoration material; recognizable fine art, entertainment memorabilia, sports heritage, technology, transport, and high-value private collections appear only after the company establishes credibility.

## 3. Status model

|Status|Meaning|Business phase|
|---|---|---|
|DRAFT|Internal prototype or demonstration record; never commercially available.|Prototype only|
|SUBMITTED|Supplier has created an intake record but HeriShare has not accepted the asset.|Both|
|UNDER_REVIEW|Appraisal, title, provenance, condition, authenticity, or compliance review is active.|Both|
|LISTED|Pre-pivot asset is open for fractional participation.|Pre-pivot|
|PARTIALLY_SUBSCRIBED|Some fractional interests have been allocated, but the offering is incomplete.|Pre-pivot|
|FULLY_SUBSCRIBED|The fractional offering completed; the physical asset remains owned by the supplier.|Pre-pivot|
|AVAILABLE|Post-pivot asset is approved and available for a whole-asset transaction.|Post-pivot|
|UNDER_OFFER|One or more active offers are being negotiated.|Post-pivot|
|RESERVED|Commercial terms are agreed, subject to completion conditions.|Post-pivot|
|SALE_PENDING|Payment, title, export, insurance, or custody transfer is still incomplete.|Post-pivot|
|SOLD|A whole-asset sale has completed.|Post-pivot|
|WITHDRAWN|The supplier voluntarily removed the asset.|Both|
|REJECTED|HeriShare declined the submission.|Both|
|INACTIVE|The record remains for history or audit but is not commercially active.|Both|
|DISPUTED|Ownership, title, provenance, or transaction rights are unresolved.|Both|

Story reactions are represented through normal business statuses. When the platform shuts down, open pre-pivot assets become `INACTIVE`, `WITHDRAWN`, or `DISPUTED`; statuses such as `FROZEN`, `DELISTED`, or `FUNDING` are not used.

## 4. Scale and scope progression

|Stage|Listing date/window|New rows|Table rows|Commercial products|Latest appraisal|Scope|
|---|---|---|---|---|---|---|
|Event 2 — Prototype|2023-02-09|8|8|0|$0|Internal mock catalogue; no commercial inventory|
|Event 4 — First partnership|2023-04-11|5|13|5|$0.72M|Small Bay Area design museum|
|Event 5 — V1 launch|2023-05-06|12|25|17|$2.6M|First public catalogue|
|Event 11 — Second successful offering|2023-07-18|20|45|37|$8.4M|Repeatability proven|
|Event 12 — Major partnership|2023-08-25|55|100|92|$31M|Small and mid-sized cultural suppliers|
|Event 13 — Demo Day|2023-09-01|20|120|112|$43M|Private estates and specialist collections|
|Natural September bursts|2023-09-08 to 2023-09-30|45|165|157|$66M|Three smaller onboarding waves|
|Event 14 — Marketplace launch|2023-10-05 to 2023-11-18|80|245|237|$120M|Nationally credible catalogue|
|Event 15 — Press coverage|2023-11-19|125|370|362|$215M|High-profile suppliers and recognizable assets|
|Natural growth|2023-11-20 to 2024-01-31|100|470|462|$305M|Sustained national intake|
|Natural growth|2024-02-01 to 2024-03-31|120|590|582|$425M|Broader categories and higher average value|
|Pre-leak pipeline|2024-04-01 to 2024-05-10|60|650|642|$510M|Peak pre-pivot scope|
|Post-leak residual intake|2024-05-11 to 2024-06-08|30|680|672|$519M|Smaller, lower-value sources only|
|Event 21 — Platform offline|2024-06-09|0|680|672|$519M|No further intake|
|Event 23 — Migration repair|2024-09-03|20|700|692|$536M|Missing historical products restored|
|Event 24 — Quiet reopening|2024-09-29 to 2024-10-31|70|770|762|$650M|Private whole-asset marketplace|
|Event 25 — Early recovery|2024-11-01 to 2024-12-31|180|950|942|$790M|Dealers, estates, auction houses, collectors|
|Event 25 — Expansion|2025-01-01 to 2025-02-28|150|1100|1092|$900M|Higher repeat trading and broader inventory|
|Event 25 — Current snapshot|2025-03-01 to 2025-04-30|150|1250|1242|$1.02B|Mature post-pivot marketplace|

## 5. Phase 1 — Startup

### Event 2 — First prototype, 9 February 2023

**8 new rows; 8 total rows; 0 commercial products.** Caesar and Bob create aspirational mock listings to demonstrate the concept. They intentionally exceed the company's realistic scope and use `DRAFT`: examples include the `Mona Lisa`, an Apollo command module, a Stradivarius violin, a famous film vehicle, and a major royal jewel. The rows remain permanently inactive and are never presented as genuine supplier listings.

### Event 4 — First partnership, 11 April 2023

**5 new rows; 13 total rows; 5 commercial products; $0.72M latest appraisal.** `northbridgemuseumofmoderncra`, a small Bay Area museum struggling to finance maintenance and storage, provides the first real inventory:

|Asset|Category|Initial status|Indicative appraisal|
|---|---|---|---|
|The Orlov Modular Chair Series, 1974|FURNITURE|UNDER_REVIEW|$180,000|
|Signal Loom, 1982|TEXTILE|UNDER_REVIEW|$145,000|
|The Van Acker Ceramic Prototype Set, 1968|CERAMIC|UNDER_REVIEW|$95,000|
|The Luma-3 Exhibition Lamp, 1979|DESIGN_OBJECT|UNDER_REVIEW|$120,000|
|Blue Factory Window, 1934; acquired 1978|PAINTING|UNDER_REVIEW|$180,000|

The assets are locally significant rather than famous. The batch tests appraisal, catalogue photography, insurance, conservation requirements, and public participation terms.

### Event 5 — V1 launch, 6 May 2023

**12 new rows; 25 total rows; 17 commercial products; $2.6M latest appraisal.** The first five assets become `LISTED`. New suppliers are two community arts groups and one small estate. Inventory remains modest: studio ceramics, local photography, a railway poster archive, furniture prototypes, regional paintings, and restoration drawings. Typical values range from $45,000 to $350,000.

### Events 6–10 — Registration and accelerator period

No large intake occurs. The company focuses on legal structure, supplier onboarding, and customer acquisition. Normal product traffic includes submissions that are rejected, two voluntary withdrawals, and several assets moving from `UNDER_REVIEW` to `LISTED`.

## 6. Phase 2 — Growth and visible scope creep

### Event 11 — Second successful offering, 18 July 2023

**20 new rows; 45 total rows; 37 commercial products; $8.4M latest appraisal.** A second successful subscription attracts more small estates, artist trusts, and regional institutions. The catalogue adds better-known designers, signed first editions, a historic theatre costume, a 1950s racing helmet, and a minor work by a recognized modern artist. Values now reach approximately $900,000, but the median remains below $200,000.

### Event 12 — Major partnership deal, 25 August 2023

**55 new rows; 100 total rows; 92 commercial products; $31M latest appraisal.** Several small and mid-sized suppliers join in one burst: museums, libraries, archives, restoration foundations, universities, religious institutions, private estates, and local-history organizations. The category range expands to manuscripts, maps, religious objects, design archives, historic instruments, scientific equipment, and transportation memorabilia.

Representative additions include a Victorian-era monocle with documented political provenance, a closed theatre's painted scenery, an early telephone exchange panel, a regional suffrage archive, and a lesser-known signed work by a recognizable artist.

### Event 13 — Accelerator Demo Day, 1 September 2023

**20 new rows; 120 total rows; 112 commercial products; $43M latest appraisal.** Private-estate representatives and collectors in the audience submit higher-value items. The company accepts its first assets above $1M: a major design prototype, a rare scientific manuscript, a modern sculpture, and an important musician's instrument.

### Natural September bursts

**45 new rows across three bursts; 165 total rows; $66M latest appraisal.** The bursts remain uneven and relationship-driven. Some suppliers contribute one item; a few archives contribute groups of related records as separate product rows. More recognizable names appear, but most products are still regional or specialist cultural material.

### Event 14 — Marketplace launch, 5 October 2023

**80 new rows through 18 November; 245 total rows; $120M latest appraisal.** The catalogue now looks national rather than local. It includes fine art, fashion, music, film, sports, technology, industrial heritage, natural history, and architectural fragments.

Representative names include `Bon Jovi Tour Outfit`, `Star Wars Lightsaber Prop`, `Muhammad Ali Training Robe`, `Apple-1 Computer`, `Art Deco Cinema Ticket Booth`, and detailed entries for higher-value paintings and sculptures. Most memorabilia and everyday-heritage products remain below $500,000; renowned fine art and rare manuscripts reach several million.

### Event 15 — Press coverage, 19 November 2023

**125 new rows; 370 total rows; 362 commercial products; $215M latest appraisal.** National attention brings the first genuinely high-profile suppliers: larger artist estates, wealthy collectors, specialist dealers, corporate archives, foundations, and a few adventurous museums following the same experimental logic that drove institutional NFT projects.

The batch introduces recognizable real works, screen-used props, couture, historic sports equipment, important first editions, rare instruments, early computing hardware, and celebrity or political personal effects. Detailed naming increases with value and renown. The five products later central to the Plot Hole come from this higher-profile part of the catalogue.

### Natural additions, 20 November 2023–31 January 2024

**100 new rows; 470 total rows; $305M latest appraisal.** Inventory arrives in monthly bursts. The company is still selective, but popularity allows it to accept both multimillion-dollar art and lower-value cultural objects that broaden public appeal.

### Natural additions, February–March 2024

**120 new rows; 590 total rows; $425M latest appraisal.** Scope reaches its pre-pivot peak. The platform includes museum-quality fine art, archives, entertainment memorabilia, fashion, sports, transport components, scientific collections, and local heritage. Values range from approximately $25,000 to $12M.

### Pre-leak pipeline, 1 April–10 May 2024

**60 new rows; 650 total rows; $510M latest appraisal.** Many products were negotiated months earlier, so high-quality inventory continues to arrive even as ownership concentrations begin to emerge. The company has enough credibility to list major private-estate works and recognizable cultural objects, but it still does not receive institutions' untouchable centrepieces.

## 7. Phase 3 — Loss of confidence

### Event 19 — Media leak, 11 May 2024

The leak does not create a special product status. Reputable museums and NGOs pause future cooperation, request reviews of existing agreements, or withdraw products that have not yet completed subscription. Products already fully subscribed remain `FULLY_SUBSCRIBED`; products affected by ownership questions become `DISPUTED`.

### Residual intake, 11 May–8 June 2024

**30 new rows; 680 total rows; 672 commercial products; $519M latest appraisal.** This is a visible contraction. The average new appraisal falls sharply because the remaining pipeline consists of creators, private families, small estates, local organizations, and distressed sellers. No major museum or high-profile institutional supplier begins a new relationship after the leak.

Representative additions include a local club archive, a retired musician's stage clothes, a closed factory sign, a Victorian-era monocle, a regional racing trophy, and household objects from an inherited historic property.

### Event 21 — Internal breakdown, 9 June 2024

**0 new rows; 680 total rows.** The platform stops accepting products. Open `LISTED` and `UNDER_REVIEW` products become `INACTIVE` unless the supplier withdraws them. Only the small number with genuine ownership or title problems become `DISPUTED`. No product rows are deleted.

## 8. Phase 4 — Pivot and private trading

### Event 22 — Pivot decision, 25 August 2024

No new products are accepted immediately. HeriShare separates legacy fractional products from assets that can support whole-asset private transactions. Most completed pre-pivot products remain `FULLY_SUBSCRIBED` or become `INACTIVE`; commercially suitable assets return to `UNDER_REVIEW`.

### Event 23 — Client migration and repair, 3 September 2024

**20 historical rows restored; 700 total rows; $536M latest appraisal.** Marcelle restores missing product records and merges supplier identities into `accounts` using stable usernames. These are historical assets, not 20 genuinely new listings.

### Who buys and sells after the pivot

**Sellers:** migrated museum and archive clients disposing only of non-core assets; private collectors; estates and heirs; artist estates; dealers; auction houses; distressed cultural institutions; studios, labels, sports organizations, hotels, factories, and companies disposing of archive material.

**Buyers:** wealthy collectors; family offices; art advisers; specialist dealers; auction houses; private foundations; corporate collections; and, occasionally, museums acquiring strategically. The former Plot Hole accounts also return as recognizable family-office or advisory accounts, now trading under stricter identity and ownership controls.

Most products sell once. Dealers, advisers, and auction houses may resell selected products once within the snapshot period. No product should have more than two completed post-pivot sales before 30 April 2025.

### Event 24 — Quiet rebranding, 29 September 2024

**70 new rows through October; 770 total rows; $650M latest appraisal.** No prestigious public institution publicly endorses the reopened platform. Supply comes mainly from private estates, collectors, dealers, auction partners, distressed institutions, and older clients willing to trade discreetly. The catalogue becomes less mission-driven and more commercially eclectic.

New inventory includes fine art, jewelry, film props, music memorabilia, fashion, sports objects, rare books, design, vehicles or components, scientific instruments, and architectural salvage. Post-pivot statuses are `AVAILABLE`, `UNDER_OFFER`, `RESERVED`, `SALE_PENDING`, and `SOLD`.

### Event 25 — Recovery and transaction volume

**480 new rows from November 2024 through April 2025; 1,250 total rows; approximately $1.02B latest appraisal.** The inventory base and transaction count are large enough to justify Product, Engineering, Compliance, Legal, Finance, Client Services, Partnerships, Art Operations, Logistics, and Private Sales teams.

|Month|Completed transactions|Transaction value|
|---|---|---|
|October 2024|28|$17M|
|November 2024|42|$24M|
|December 2024|50|$29M|
|January 2025|58|$35M|
|February 2025|65|$41M|
|March 2025|78|$51M|
|April 2025|92|$63M|

By 30 April 2025, HeriShare has processed **413 post-pivot transactions across 382 unique products**, including **31 products resold once**. The seven-month transaction value is approximately **$260M**. Annualized, this is roughly 700 transactions and $445M in marketplace volume.

At an effective blended transaction and service take of roughly 4.5%, annualized revenue is about $20M before exceptional costs. This is sufficient to support the $16.2M operating budget and modest growth without requiring every asset to trade repeatedly.

## 9. Snapshot status target — 30 April 2025

|Status|Rows|
|---|---|
|DRAFT|8|
|INACTIVE|243|
|FULLY_SUBSCRIBED|105|
|PARTIALLY_SUBSCRIBED|22|
|WITHDRAWN|35|
|REJECTED|12|
|DISPUTED|5|
|SUBMITTED|18|
|UNDER_REVIEW|95|
|AVAILABLE|245|
|UNDER_OFFER|35|
|RESERVED|25|
|SALE_PENDING|20|
|SOLD|382|

## 10. Generation constraints

- Generate exactly 1,250 rows.
- Use only the helper columns `phase`, `event`, `listed_at`, and `is_relevant`.
- Use gradual scope creep: local and low-value first, national and recognizable later.
- After 11 May 2024, new suppliers and values decline until intake stops on 9 June.
- Use a mix of detailed and concise product names; detail correlates with value and renown.
- Keep the five crucial Plot Hole assets real and set `is_relevant = TRUE`.
- Use real works only where the supplier relationship is plausible; do not list institutional crown jewels.
- Set `owned_by` to the supplier until the transactions table is generated.
- Use 413 post-pivot transactions across 382 products; 31 products trade twice and all others at most once.
- No new product is accepted between 9 June and the Event 23 historical restoration.
- Post-pivot public institutions are minor or discreet sellers, not visible platform champions.