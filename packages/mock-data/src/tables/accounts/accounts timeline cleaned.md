# Phase 1 — The Startup

## Event 2 — 9 February 2023: First Proof-of-Concept Prototype
Caesar and Bob populate the prototype with mock accounts representing themselves, relatives, friends, and invented users.  
The records are entered manually and contain relatively clean but unrealistic data. Some fields may be incomplete because the accounts are intended only for demonstrations.

**Account activity:**
- Accounts represent the founders, relatives, friends, and invented wealthy users.
- Most accounts are verified manually.
- Creation timestamps are clustered around the prototype-development period.
- Some accounts never log in again after the demonstration.
- Mock accounts are retained when the platform becomes operational.  
    **New accounts:** 15  
    **Running total:** 15 accounts.

## Event 3 — 3 March 2023: Student Startup Night
Following the presentation at Student Startup Night, Caesar and Bob open the platform for expressions of interest.  
Most registrations come from students, friends of attendees, and young professionals connected to the university community.

**Account activity:**
- Registrations are concentrated on the evening of 3 March.
- Most users are legitimate and have complete personal information.
- Verification rate is high.
- Several groups of friends or roommates register within minutes of one another.
- Some incomplete accounts belong to attendees who begin registration but do not return.  
    **New accounts:** 30  
    **Running total:** 45 accounts.

## Event 4 — 11 April 2023: First Museum Partnership
After announcing the partnership with the Northbridge Museum of Modern Craft & Design, HeriShare promotes the platform through university networks, museum channels, and social media.  
The platform is not yet open for purchases, so users register primarily to receive launch updates or reserve early access.

**Account activity:**
- Signups are spread over several days following the announcement.
- Users include students, art enthusiasts, museum supporters, and speculative early adopters.
- Most accounts are verified.
- Some users register for updates but never return.  
    **New accounts:** 35  
    **Running total:** 80 accounts.

## Event 5 — 6 May 2023: Platform V1.0 Launch
The public launch and promotional campaign generate HeriShare’s first major registration wave.

**Account activity:**
- Signups are concentrated between 6 and 14 May.
- Users are more diverse in age, location, and occupation than earlier groups.
- Verification remains relatively high.
- Some users register only to browse the platform and never complete a transaction.
- Early transactional accounts begin appearing in the `transactions` table.  
    **New accounts:** 95  
    **Running total:** 175 accounts.

## Events 6–14 — 7 May to 18 November 2023: Organic Growth
Between the platform launch and the viral press article, HeriShare grows steadily through partnerships, accelerator exposure, successful listings, Demo Day, and the launch of the internal marketplace.

Important account-related growth points include:

- **Event 7:** Entry into the accelerator.
- **Event 11:** Second listing sells out.
- **Event 12:** Major partnership expansion.
- **Event 13:** Accelerator Demo Day.
- **Event 14:** Internal marketplace launch.

The marketplace launch produces the strongest increase because users can now trade shares rather than only fund newly listed assets.

**Account activity:**
- Approximately 40 accounts are created between May and July.
- Approximately 30 accounts follow the August partnership expansion and Demo Day.
- Approximately 55 accounts follow the internal marketplace launch.
- Signup rates gradually increase over time.
- Noticeable registration clusters occur around major announcements.
- Marketplace users are more investment-oriented than earlier museum supporters.
- Most accounts are genuine and verified.
- A small number of users create secondary accounts, but the behaviour is not yet widespread.  
    **New accounts:** 125  
    **Running total:** 300 accounts.

# Phase 2 — The Accelerator
## Event 15 — 19 to 28 November 2023: Viral Press Coverage
A technology article describing HeriShare as “The Robinhood of Art Ownership” goes viral.  
The article produces an unprecedented registration wave and more than doubles the platform’s user base.

**Account activity:**
- Signups peak during the first two or three days and decline gradually afterward.
- Users include ordinary retail investors, celebrities, public figures, collectors, and speculative traders.
- Verification rates remain reasonably high because the platform is still viewed as legitimate.
- Some public figures use aliases, assistants’ contact details, or representatives’ addresses.
- A small number of duplicate accounts appear.
- Several prominent accounts are designed to be recognisable in later exercises.  
    **New accounts:** 450  
    **Running total:** 750 accounts.

## Events 15–18 — 29 November 2023 to 10 May 2024: Continued Growth
Following the viral article, the platform continues growing at a higher baseline than before.  
Growth is driven by media exposure, referrals, new assets, secondary trading, and increasing speculation.

**Account activity:**
- Daily signup rates remain higher than during the startup phase but gradually decline.
- Duplicate and partially completed accounts become more common.
- A handful of key users maintain multiple accounts for different investment strategies.
- Inactive accounts accumulate as users register after seeing publicity but never participate.
- Some accounts share addresses, contact details, or login patterns without necessarily belonging to the same person.
- The users who later exploit the ownership loophole establish several of their secondary accounts during this period.  
    **New accounts:** 250  
    **Running total:** 1,000 accounts.

# Phase 3 — The Loophole

## Event 19 — 11 to 27 May 2024: Media Leak

The article “Fractional Ownership of Art or Billionaire Scheme?” exposes the majority-ownership loophole.  
The scandal attracts investors, journalists, critics, and users attempting to reproduce the strategy used by wealthy shareholders.

**Account activity:**
- Approximately 130 accounts are created on 11 May.
- A further 70 accounts are created between 12 and 27 May.
- Unverified and incomplete registrations increase sharply.
- Many users create multiple accounts using variations of the same names, email addresses, phone numbers, or postal addresses.
- Some accounts use false or nonsensical personal information.
- Some users register solely to observe the controversy.
- Existing users create additional accounts to circumvent ownership limits or conceal coordinated purchases.
- Several clusters contain many accounts controlled by only one or two people.
- Verification falls sharply because support staff cannot properly review the registration wave.
- This period contains the dataset’s clearest duplicate-account and identity-linking patterns.  
    **New accounts:** 200  
    **Running total:** 1,200 accounts.

## Event 20 — 28 May 2024: Signups Suspended

As the platform destabilizes, HeriShare disables new registrations and restricts access.  
The platform remains intermittently accessible, but ordinary users can no longer create accounts.

**Account activity:**
- Public account creation stops.
- Accounts created immediately before the lock may remain incomplete.
- Verification requests are left pending.
- Fake and duplicate accounts show abnormal login behaviour.
- Some `last_login_at` values result from bots, shared credentials, internal testing, or repeated attempts to access the unstable platform.
- No internal accounts are added to `accounts`; employees continue using their existing account records or separate system credentials.  
    **New accounts:** 0  
    **Running total:** 1,200 accounts.

## Event 21 — 9 June 2024: Platform Taken Fully Offline
HeriShare takes the platform fully offline following the internal breakdown.

**Account activity:**
- Normal user logins stop.
- No new public accounts are created.
- Most legacy accounts receive no later `last_login_at` value.
- A small number of accounts show later timestamps because of administrative access, testing, or migration work.
- After the platform reopens, it is no longer intended for most original retail users.
- Most pre-pivot accounts remain stored because historical transactions reference their usernames.  
    **New accounts:** 0  
    **Running total:** 1,200 accounts.

# Phase 4 — The Pivot

## Event 23 — 3 September 2024: Marcelle Johnson Begins Account Migration

Marcelle begins restructuring the database for the new marketplace business model.  
Existing client and seller records from separate systems are merged into the `accounts` table.

**Account activity:**
- New rows are created from legacy records belonging to museums, NGOs, estates, foundations, galleries, auction houses, and private asset owners.
- Phone numbers and email addresses generally belong to institutional representatives.
- Many imported records represent organisations or agents even though the schema is designed around individual users.
- Institution names are sometimes placed entirely in `first_name`, with `last_name` left `NULL`.
- Other records use the personal name of the relevant representative.
- Addresses may refer to an institution, registered office, storage facility, estate, or representative.
- `created_at` is set to 3 September 2024 for all imported records.
- `last_login_at` is initially `NULL` because former clients did not use the public platform.
- Some former clients already have retail accounts, producing duplicate or near-duplicate records.
- Imported records are generally legitimate but contain slightly incomplete and inconsistently formatted information.  
    **Imported client records:** 150  
    **Running total:** 1,350 accounts.

## Event 24 — 29 September to 31 October 2024: Quiet Rebranding and Registration Reopening

HeriShare reopens registrations under the “Exclusive Asset Marketplace” brand.  
The company receives substantially fewer signups than before the crisis because the relaunched platform targets wealthy buyers and professional sellers.

**Account activity:**
- Registrations require review by a HeriShare representative.
- Users are primarily collectors, dealers, auction-house representatives, estate managers, private sellers, and wealthy speculative buyers.
- `verified = TRUE` now means that an account has been manually approved.
- Unverified accounts represent pending applications, rejected applicants retained in the database, or abandoned applications.
- Former retail users generally do not return because the relaunched platform is not designed for them.
- A small number of previous users are invited back because of their wealth, transaction history, or asset holdings.
- Registrations are concentrated during the first week after relaunch and then fall to a low baseline. 
    **New accounts:** 40  
    **Running total:** 1,390 accounts.

## Event 25 — November 2024 to April 2025: Recovery Period
Account growth stabilizes as the company adapts to the new marketplace model.

**Account activity:**
- Signup growth is slow and consistent.
- Approximately 15–25 applications are recorded each month.
- Only some applicants are verified.
- New users are primarily professional sellers, representatives, collectors, and wealthy buyers.
- Some accounts are created manually by HeriShare employees on behalf of institutional clients.
- Some account records remain incomplete because deleting or merging them could break historical transactions.
- Verification remains inconsistent between old retail accounts, imported clients, and manually reviewed post-pivot accounts.
- Duplicate records may be identified but retained because existing transactions still reference their usernames.
- The smaller number of post-pivot accounts makes them proportionally more relevant to the story and exercises.  
    **New accounts:** 110  
    **Running total by 30 April 2025:** 1,500 accounts.