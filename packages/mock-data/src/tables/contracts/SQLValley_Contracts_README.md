# SQLValley Contracts Table README

## 1. Purpose

The `contracts` table is HeriShare's chronological employment-history ledger. It records hiring, probation, active employment, reviews, salary and title changes, significant leave, resignation, layoff, suspension, and termination.

The dataset snapshot is **2025-04-30**. It contains **286 rows** for **79 employees**.

## 2. Schema

```sql
contracts(
  e_id INTEGER NOT NULL,
  position TEXT,
  salary REAL,
  start_date TEXT,
  end_date TEXT,
  perf_score INTEGER,
  status TEXT,
  PRIMARY KEY (e_id, start_date),
  FOREIGN KEY (e_id) REFERENCES employees(e_id)
)
```

The CSV uses semicolon separators and ISO dates (`YYYY-MM-DD`). SQL `NULL` values are represented as `NULL` in the CSV.

## 3. Row types and overlap rules

The table contains two kinds of rows.

### Employment-state rows

`PROBATION`, `ACTIVE`, `SUSPENDED`, `RESIGNED`, `LAID_OFF`, and `TERMINATED` describe the employee's formal employment state. These rows must not overlap for the same employee.

### Time-off rows

`PTO`, `SICK_LEAVE`, `PARENTAL_LEAVE`, and `SABBATICAL` describe absences. They normally overlap an underlying `ACTIVE` or `PROBATION` row because the employee remains employed while absent.

Suspension is not treated as leave. The preceding employment-state row ends before `SUSPENDED` begins.

Because the primary key is `(e_id, start_date)`, one employee cannot have two different rows beginning on the same date. Generated leave dates avoid collisions with employment changes.

## 4. Field reference

| Field | Meaning |
|---|---|
| `e_id` | Eight-digit employee identifier matching `employees.e_id`. |
| `position` | Formal contractual job title during the period. It is not a department name. |
| `salary` | Gross annual base salary in USD, not monthly salary. Excludes bonus, equity, commission, benefits, severance, and expenses. |
| `start_date` | First day of the period, inclusive. |
| `end_date` | Last day of the period, inclusive. `NULL` means the row remains open. |
| `perf_score` | Performance-review score from 0 to 100. `NULL` when the row was not created by a review. |
| `status` | Controlled employment or leave status. |

Leave rows repeat the title and annual contractual salary in effect during the absence. They do not show the amount actually paid during leave.

## 5. Performance scores

| Score | Interpretation |
|---:|---|
| 90-100 | Exceptional |
| 80-89 | Strong performance |
| 70-79 | Meets expectations |
| 60-69 | Partially meets expectations |
| 50-59 | Serious improvement required |
| 0-49 | Unsatisfactory |

A performance score records the review that caused the row to begin. Initial hiring, company-wide pay adjustments, leave, and departures usually have `perf_score = NULL`.

Company finances may override normal compensation outcomes. A high score can produce no raise during a salary freeze, while a critical retention adjustment can occur without a performance score.

## 6. Standard lifecycle rules

### Hiring and probation

Most non-executive employees begin with a 90-day `PROBATION` row. Every completed probation creates a new `ACTIVE` row, even when title and salary are unchanged.

Founders and external C-level hires begin directly as `ACTIVE`. Senior external hires still receive a 90-day executive review.

### Annual reviews

Annual reviews normally occur on the hire-date anniversary. Every completed review creates a new row, including unchanged reviews.

### Salary and position changes

A new employment-state row is created whenever annual salary or formal position changes. When several changes take effect on the same date, they are combined in one row.

### Leave

Only multi-day or narratively relevant leave is included. Routine single-day absences are omitted. Leave rows overlap the continuing employment-state row.

### Departures

A resignation row covers the notice period and ends on the final working day. Layoff and termination rows are terminal; no later rows may exist for that employee.

## 7. Story-driven timeline

### 2023 startup and growth

- **2023-06-23:** Caesar and Bob enter formal payroll at below-market founder salaries.
- **2023-07-03:** Paris becomes the first non-founder hire.
- **August-November 2023:** Technology, Operations, Partnerships, Finance, Legal, Client Services, and Communications teams are established.
- **2023-11-19:** Viral growth produces founder salary corrections, selected manager increases, Paris's promotion, and a large hiring wave.

### 2024 expansion and crisis

- **February-May 2024:** Hiring continues; a small number of titles discreetly reference museums, archives, restoration, collections, and institutional relationships.
- **2024-05-11:** The media leak causes a hiring, promotion, bonus, and salary-review freeze. Salaries are not cut immediately.
- **Late May 2024:** Five employees resign and one employee is suspended and terminated.
- **2024-06-10:** Nine employees are laid off after the shutdown. Most affected roles had become unnecessary or sharply reduced.
- **2024-06-24:** After Finance confirms the cash shortage, leadership salary cuts take effect. Elvis becomes Acting CFO, and several crisis-driven role changes become formal.
- **2024-08-25:** The pivot is approved. Bob steps down as CTO and takes a permanent pay cut. Paris receives a broader strategy role. Selected positions are redesigned for the private-market business.

### 2024-2025 relaunch and recovery

- **2024-09-03:** Marcelle joins to lead data and systems transformation.
- **September 2024 onward:** HeriShare hires a new CTO and specialists in Engineering, Private Sales, Seller Partnerships, Data, and Transaction Operations.
- **Late 2024-2025:** Recovery raises are targeted rather than company-wide. Scarce technical, legal, compliance, sales, and finance roles receive the strongest adjustments.
- **2025-03-01:** Bob receives a retention increase without regaining CTO authority.
- **2025-04-14:** Marcelle begins an open-ended sabbatical that overlaps her open `ACTIVE` row.

## 8. Dataset snapshot

| Metric | Value |
|---|---:|
| Contract rows | 286 |
| Employees represented | 79 |
| Employment-state rows | 259 |
| Time-off rows | 27 |
| Rows with performance scores | 105 |
| Open `ACTIVE` rows | 59 |
| Open `PROBATION` rows | 5 |
| Open `SABBATICAL` rows | 1 |
| Resignation rows | 5 |
| Layoff rows | 9 |
| Termination rows | 1 |
| Suspension rows | 1 |

Status distribution:

| Status | Rows |
|---|---:|
| `ACTIVE` | 164 |
| `PROBATION` | 79 |
| `PTO` | 15 |
| `SICK_LEAVE` | 10 |
| `PARENTAL_LEAVE` | 1 |
| `SABBATICAL` | 1 |
| `SUSPENDED` | 1 |
| `RESIGNED` | 5 |
| `LAID_OFF` | 9 |
| `TERMINATED` | 1 |

## 9. Relationship with other tables

### `employees`

- `contracts.e_id` references `employees.e_id`.
- A current employee's latest open employment-state salary must equal `employees.current_salary`.
- Former employees have `employees.current_salary = NULL`, while `contracts` preserves their historical salaries.
- The current position is derived from the open employment-state row, not from a leave row.

### `departments` and `allocations`

- Positions and department assignments are separate concepts.
- A contract title change does not automatically create or remove allocation rows.
- Current managers must have an open employment-state row. Temporary leave does not automatically remove management responsibility.

### Future evidence tables

Wheatley does not appear in `contracts` because he is not a legitimate employee. His apparent activity must instead be represented in system users, access logs, tickets, emails, tasks, or audit evidence.

## 10. Query guidance

### Current employed population

Do not use every row with `end_date IS NULL`, because Marcelle has both an open `ACTIVE` row and an open `SABBATICAL` row.

```sql
SELECT *
FROM contracts
WHERE end_date IS NULL
  AND status IN ('ACTIVE', 'PROBATION');
```

### Current time off

```sql
SELECT *
FROM contracts
WHERE end_date IS NULL
  AND status IN ('PTO', 'SICK_LEAVE', 'PARENTAL_LEAVE', 'SABBATICAL');
```

### Current position and salary

```sql
SELECT e_id, position, salary
FROM contracts
WHERE end_date IS NULL
  AND status IN ('ACTIVE', 'PROBATION');
```

### Complete employee history

```sql
SELECT *
FROM contracts
WHERE e_id = ?
ORDER BY start_date, status;
```

### Employees whose salary decreased

Use `LAG` only on employment-state rows so leave rows do not create false comparisons.

```sql
WITH employment_history AS (
  SELECT
    e_id,
    start_date,
    salary,
    LAG(salary) OVER (
      PARTITION BY e_id
      ORDER BY start_date
    ) AS previous_salary
  FROM contracts
  WHERE status IN ('PROBATION', 'ACTIVE', 'SUSPENDED', 'RESIGNED', 'LAID_OFF', 'TERMINATED')
)
SELECT *
FROM employment_history
WHERE salary < previous_salary;
```

### Leave overlapping employment

```sql
SELECT
  l.e_id,
  l.status AS leave_status,
  l.start_date,
  l.end_date,
  e.position
FROM contracts AS l
JOIN contracts AS e
  ON e.e_id = l.e_id
 AND e.status IN ('ACTIVE', 'PROBATION')
 AND e.start_date <= l.start_date
 AND (e.end_date IS NULL OR e.end_date >= l.end_date)
WHERE l.status IN ('PTO', 'SICK_LEAVE', 'PARENTAL_LEAVE', 'SABBATICAL');
```

## 11. Common pitfalls

1. **Counting open rows as employees:** open leave rows can duplicate an employed person.
2. **Using leave rows for current position:** leave rows repeat the position but are not the authoritative employment state.
3. **Assuming all rows are non-overlapping:** only employment-state rows must not overlap.
4. **Treating salary as monthly:** every salary value is annual gross USD.
5. **Treating performance as the only cause of pay changes:** company growth, distress, promotion, demotion, and retention can also change salary.
6. **Treating `RESIGNED` as a single-day event:** it normally represents a notice period.
7. **Assuming a title change implies a department transfer:** consult `allocations` separately.
8. **Ignoring inclusive end dates:** the next employment-state row normally begins the day after the previous row ends.

## 12. Validation requirements

The generated dataset satisfies the following rules:

- `(e_id, start_date)` is unique.
- All 79 employees appear.
- Performance scores are `NULL` or between 0 and 100.
- Employment-state rows do not overlap.
- Time-off rows are covered by an `ACTIVE` or `PROBATION` period.
- Suspension does not overlap active employment.
- Every current employee has exactly one open employment-state row.
- Former employees have no open employment-state row.
- No rows follow a terminal layoff or termination.
- Latest current salaries match `employees.current_salary`.
- Dates use ISO format and `end_date` is inclusive.

## 13. Files

- `sqlvalley_contracts.csv`: semicolon-delimited import data.
- `sqlvalley_contracts.sql`: SQLite table creation and insert statements.
- `sqlvalley_contracts.xlsx`: contracts data, generation references, event summary, employee summary, and validation results.
