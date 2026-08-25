## 1. Table purpose
`quarterlyPerformance` summarizes HeriShare's commercial performance by asset category and quarter.

Schema:
quarterlyPerformance(
    quarter,
    fiscal_year,
    category,
    revenue,
    operating_expenses,
    total_transactions,
    updated_at,
    PRIMARY KEY (quarter, fiscal_year, category)
)

Each row represents one asset category in one fiscal quarter.

The table should reveal:
- which sectors drive revenue;
- which categories are growing or shrinking;
- changes in category mix as HeriShare expands;
- the effect of the 2024 crisis;
- the shift from fractional investing to whole-asset trading;
- post-pivot concentration in commercially attractive asset categories.

The table should remain neutral filler data. Exercise-specific anomalies or manipulated records can be added later.

## 2. Metric definitions

### revenue
HeriShare revenue attributable to transactions in that category.

This is platform revenue, not total asset sale value / GMV.

Revenue can include:
- transaction commissions;
- listing/origination fees;
- buyer/seller fees;
- category-attributable service fees.

### operating_expenses
Costs reasonably attributable to operating that category.

Examples:
- appraisal;
- provenance research;
- photography;
- storage;
- insurance;
- specialist handling;
- shipping;
- listing preparation;
- category-specific legal or compliance work.

Do not repeat total company operating expenses for every category.

General costs such as HR, office rent and generic infrastructure should either:
- be allocated proportionally across active categories; or
- remain mostly outside this table.

### total_transactions
Number of commercial transactions associated with the category.

Important semantic break:

**Pre-pivot:** fractional-share purchases and secondary share trades.

**Post-pivot:** whole-asset marketplace transaction attempts.

This means pre- and post-pivot transaction counts are not directly comparable.

### updated_at
Timestamp when the category-quarter record was finalized or last refreshed.

Early reporting can be irregular.
Later reporting becomes more standardized.
Crisis quarters may be finalized later than normal.

# Phase 1 — Startup

## Q1 2023 — Prototype
No genuine commercial asset activity.

The prototype contains mock assets, but these should not generate financial performance rows.

**Generator guidance:**
- Prefer no Q1 2023 category rows.
- Do not create fake revenue for prototype assets.
- First performance records should begin when real products enter the system.

## Q2 2023 — First Real Listings
Northbridge provides the first five genuine assets in April. V1 launches in May.

Only a small number of early categories should appear.

Likely active categories:
- FURNITURE
- DESIGN_OBJECT
- CERAMIC
- PAINTING
- possibly another closely related early category based on the actual five Northbridge products

Characteristics:
- low revenue;
- modest fractional transaction counts;
- relatively high onboarding expense compared with revenue;
- some categories may be loss-making.

Typical per-category profile:
- revenue: $2k–$15k
- operating expenses: $3k–$20k
- transactions: 20–150

**Generator guidance:**
Use only categories that actually exist in the products table by the quarter end.

# Phase 2 — Accelerator and Growth

## Q3 2023 — Catalogue Expansion
Successful offerings and the August partnership expansion materially increase catalogue breadth.

More categories appear as HeriShare starts onboarding assets from museums, estates and collectors.

Likely expansion into:
- SCULPTURE
- PHOTOGRAPH
- PRINT
- DRAWING
- TEXTILE
- MANUSCRIPT
- RARE_BOOK
- HISTORIC_OBJECT
- MUSICAL_INSTRUMENT
- ARCHIVAL_COLLECTION

Performance becomes uneven by sector.

Some categories:
- generate many small transactions;
- others generate fewer but higher-value offerings;
- newly introduced sectors may initially have expenses exceeding revenue.

Typical per-category profile:
- revenue: $5k–$50k
- operating expenses: $5k–$40k
- transactions: 50–500

**Generator guidance:**
Do not activate every category simultaneously. Category introduction should follow the products timeline.

## Q4 2023 — Marketplace Expansion and Virality
Secondary trading launches and November press coverage dramatically increases user activity.

The catalogue broadens nationally and starts including more recognizable and higher-value assets.

Additional categories may include:
- FASHION
- SPORTS_MEMORABILIA
- FILM_PROP
- MUSIC_MEMORABILIA
- TECHNOLOGY
- JEWELRY
- COLLECTION
- SCIENTIFIC_INSTRUMENT
- TRANSPORTATION
- INDUSTRIAL_OBJECT

Existing categories should differ materially in performance.

Examples:
- PAINTING may generate high revenue with moderate transaction counts;
- SPORTS_MEMORABILIA may generate many smaller trades;
- MANUSCRIPT may have high costs and fewer transactions;
- DESIGN_OBJECT may remain relatively liquid.

Typical per-category profile:
- revenue: $15k–$150k
- operating expenses: $10k–$100k
- transactions: 100–1,500

**Generator guidance:**
Viral growth should increase activity across many existing categories, not create identical growth rates.

# Phase 2 — Mature Growth

## Q1 2024 — Peak Pre-Crisis Expansion
This is the strongest clean quarter of the fractional model.

Most of the 34 product categories can now be active, although rare categories should still have few listings and low transaction counts.

High-performing sectors may include:
- PAINTING
- SPORTS_MEMORABILIA
- FASHION
- MUSIC_MEMORABILIA
- DESIGN_OBJECT
- JEWELRY
- FILM_PROP

Specialist sectors may remain smaller:
- ARCHAEOLOGICAL_OBJECT
- ETHNOGRAPHIC_OBJECT
- RELIGIOUS_OBJECT
- NATURAL_HISTORY
- ARCHITECTURAL_ELEMENT
- METALWORK
- GLASS
- MAP

Typical per-category profile:
- revenue: $20k–$250k
- operating expenses: $15k–$150k
- transactions: 150–2,500

**Generator guidance:**
A few categories should dominate revenue. Do not distribute revenue evenly across 34 categories.

# Phase 3 — Crisis

## Q2 2024 — Strong Start, Sudden Deterioration
April begins as a normal growth month. Ownership problems emerge in late April, spread during May, and the platform shuts down on 9 June.

Category performance should therefore be mixed.

Effects:
- many categories still show significant transaction volume from April and early May;
- high-value sectors incur additional legal, provenance, custody and ownership-review expenses;
- revenue falls later in the quarter;
- some categories become temporarily expensive to operate.

Particularly exposed categories can include:
- PAINTING
- SCULPTURE
- MANUSCRIPT
- HISTORIC_OBJECT
- COLLECTION
- ARCHIVAL_COLLECTION

Typical effects:
- revenue flat or lower than Q1;
- operating expenses noticeably higher in sensitive categories;
- transactions remain substantial because most of the collapse occurs mid-quarter.

**Generator guidance:**
Do not make every category collapse equally.
The quarter should look unstable rather than uniformly disastrous.

## Q3 2024 — Shutdown and Pivot
The public platform is offline for nearly the entire quarter.

Most categories should have:
- zero or near-zero revenue;
- zero transactions;
- residual operating expenses.

Residual costs may remain for:
- storage;
- insurance;
- custody;
- provenance;
- legal work;
- data reconciliation.

Only categories involved in the first transactions after the 29 September reopening should record transaction activity.

**Generator guidance:**
Rows can still exist for inactive categories if expenses continue.
Use `total_transactions = 0` rather than removing a category when it still incurs costs.
Avoid creating revenue where no post-pivot sale occurred.

# Phase 4 — Whole-Asset Marketplace

## Q4 2024 — Early Recovery
HeriShare now operates as a private marketplace for whole cultural assets.

Category economics change substantially.

Transaction counts fall compared with the fractional era, but revenue per transaction increases sharply.

Strong post-pivot sectors are likely to include:
- PAINTING
- JEWELRY
- FASHION
- SPORTS_MEMORABILIA
- MUSIC_MEMORABILIA
- FILM_PROP
- DESIGN_OBJECT
- HISTORIC_OBJECT
- RARE_BOOK
- MANUSCRIPT
- MUSICAL_INSTRUMENT

Less liquid categories should trade infrequently:
- ARCHITECTURAL_ELEMENT
- NATURAL_HISTORY
- ARCHAEOLOGICAL_OBJECT
- RELIGIOUS_OBJECT
- ETHNOGRAPHIC_OBJECT
- large ARCHIVAL_COLLECTION assets

Generated transaction data gives:
- October: 115 total attempts
- November: 180
- December: 225
- Q4 total: 520 transaction attempts

These 520 rows should be distributed across categories based on the actual products involved.

**Generator guidance:**
Use the transactions table to determine post-pivot category transaction counts rather than estimating them independently.

## Q1 2025 — Scaling Private Marketplace
The new model becomes established.

Transaction data:
- January: 275 attempts
- February: 298
- March: 335
- Q1 total: 908 attempts

Category performance becomes more differentiated.

High-liquidity categories should show:
- more transactions;
- repeat sales;
- strong revenue.

High-value specialist sectors may show:
- very few transactions;
- high revenue from individual deals;
- high per-transaction operating costs.

Typical per-category profile:
- revenue: $20k–$1M+
- operating expenses: $10k–$300k
- transactions: 1–150

**Generator guidance:**
Do not make revenue proportional only to transaction count.
A category with 8 expensive sales can outperform one with 70 lower-value sales.

## Q2 2025 — Partial Quarter
The database snapshot ends on 30 April 2025.

April contains:
- 356 transaction attempts;
- 305 completed sales.

Include Q2 2025 as quarter-to-date data through 30 April.

Only categories with April activity or attributable operating costs need rows.

`updated_at` should be around:
`2025-04-30`

**Generator guidance:**
Do not extrapolate April into a full-quarter result.
Q2 2025 should therefore be visibly smaller than a complete quarter.

# Category Coverage

The products table contains 34 categories:

- PAINTING
- SCULPTURE
- SPORTS_MEMORABILIA
- PHOTOGRAPH
- FILM_PROP
- MUSIC_MEMORABILIA
- PRINT
- DRAWING
- TECHNOLOGY
- MUSICAL_INSTRUMENT
- ARCHIVAL_COLLECTION
- FASHION
- HISTORIC_OBJECT
- FURNITURE
- DESIGN_OBJECT
- RARE_BOOK
- CERAMIC
- TEXTILE
- MANUSCRIPT
- TRANSPORTATION
- COLLECTION
- JEWELRY
- INDUSTRIAL_OBJECT
- RELIGIOUS_OBJECT
- ARCHITECTURAL_ELEMENT
- METALWORK
- FILM_AND_MEDIA
- THEATRE_OBJECT
- NATURAL_HISTORY
- SCIENTIFIC_INSTRUMENT
- ETHNOGRAPHIC_OBJECT
- GLASS
- MAP
- ARCHAEOLOGICAL_OBJECT

Do not create quarterly rows for a category before the first product in that category exists.

# Expected Dataset Size

The theoretical maximum across 10 quarters is:

34 categories × 10 quarters = 340 rows

The actual dataset should be lower because:
- Q1 2023 has no real commercial categories;
- few categories exist in Q2 2023;
- catalogue breadth expands gradually;
- some rare categories appear only late.

Recommended final size:
**approximately 220–280 rows.**

Do not force a round row count.

# Data Generation Guidelines

## Category activation
Use the products table as the source of truth.

For each quarter:
1. identify products listed by quarter end;
2. identify active categories;
3. generate performance only for historically plausible categories.

## Post-pivot transaction counts
For Q3 2024 onward:
- join `transactions.prod_id` to `products.p_id`;
- derive the product category;
- aggregate transaction counts by quarter and category.

Do not independently invent post-pivot transaction totals.

## Pre-pivot transaction counts
The detailed fractional transaction ledger does not exist.

Generate plausible category-level estimates using:
- number of available products;
- estimated product values;
- category liquidity;
- timing of category introduction;
- account growth;
- major timeline events.

Keep pre-pivot fractional counts much higher than post-pivot whole-asset counts.

## Revenue
Revenue should depend on:
- transaction count;
- product value;
- category;
- business model;
- platform fee structure.

Avoid:
`revenue = transactions × constant fee`

Use category-specific variation.

High-value categories should often produce greater revenue per transaction.

## Operating expenses
Base category expenses on:
- number of active products;
- value of assets;
- handling complexity;
- insurance needs;
- storage;
- provenance requirements;
- transaction volume.

Examples:

High-cost categories:
- PAINTING
- SCULPTURE
- TRANSPORTATION
- ARCHITECTURAL_ELEMENT
- ARCHIVAL_COLLECTION

Lower handling-cost categories:
- PRINT
- PHOTOGRAPH
- MAP
- smaller MEMORABILIA

Do not make these rigid rules.

## Reporting maturity
`updated_at` should evolve with the company.

Early:
- irregular;
- sometimes weeks late.

Growth:
- increasingly regular.

Crisis:
- reporting delays possible.

Post-pivot:
- consistent quarterly close.

Do not use identical quarter-end offsets.

## Exercise neutrality
Generate normal operating data only.

Do not add:
- manipulated figures;
- hidden fraud;
- false reporting;
- deliberately incorrect totals;
- exercise-specific outliers.

Those should be added later as dedicated exercise rows.

## Cross-table consistency
Use:
- `products` for category existence and catalogue growth;
- `transactions` for post-pivot transaction activity;
- `expenses` for general cost direction;
- `employees` and `contracts` for organizational scale;
- storyline events for changes in market conditions.

The table should summarize the rest of the database rather than contradict it.