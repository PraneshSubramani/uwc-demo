# UWC Demo — Zoho CRM Build Bundle (Scenarios C–G)

**Org:** `20114943111` on `crm.zoho.eu` · admin `uwc_admin@a2zcloud.eu.com`
**Audience:** Sagar + Priyanka — paste‑ready assets to build live CRM by Fri 29 May EOD.
**Companion docs (in `..`):**
- `SCENARIOS_C_TO_G_ZOHO_CRM_PLAN.md` — strategic plan (read first)
- `SCENARIOS_C_TO_G_BUILD_HANDBOOK.md` — step‑by‑step click guide (read second)
- `BLUEPRINT_AND_WORKFLOW_SPEC.md` — Applications Blueprint (10 stages, 8 WRs) — already locked
- `BUILD_DECISIONS_v4.md` — strategic decisions
- `CRM_ARCHITECTURE_DELTA.md` — live‑org audit

## Folder contents

```
zoho-build/
├── README.md                        ← this file
├── csv/                             Sample data — Zoho CRM Import-tool ready
│   ├── 01_national_committees.csv
│   ├── 02_schools.csv
│   ├── 03_programmes.csv
│   ├── 04_contacts.csv
│   ├── 05_applications.csv
│   ├── 06_review_scores.csv         (subform — manual add or API)
│   ├── 07_safeguarding_cases.csv
│   ├── 08_place_allocations.csv
│   ├── 09_nomination_packs.csv
│   ├── 10_governance_bodies.csv
│   ├── 11_governance_memberships.csv
│   ├── 12_competencies.csv
│   ├── 13_nc_volunteers.csv
│   ├── 14_training_records.csv
│   ├── 15_mou_obligations.csv
│   ├── 16_mailing_lists.csv
│   ├── 17_campaigns.csv
│   ├── 18_communication_logs.csv
│   └── 19_consent_records.csv
├── deluge/                          Paste-into-Zoho Setup → Functions
│   ├── _all_functions.deluge        Master file with every function below
│   ├── increment_review_count.deluge
│   ├── unlock_all_review_scores.deluge
│   ├── create_safeguarding_case.deluge
│   ├── generate_nomination_pack.deluge
│   ├── send_to_business_central.deluge
│   ├── decrement_school_quota.deluge
│   ├── recompute_competency_gaps.deluge
│   ├── lapse_expired_memberships.deluge
│   ├── recompute_mou_health.deluge
│   ├── recompute_volunteer_training_status.deluge
│   ├── build_mailing_list.deluge
│   ├── log_campaign_sends.deluge
│   ├── mirror_consent_to_contact.deluge
│   ├── generate_consent_audit_trail.deluge
│   └── demo_reset.deluge            Resets all state — re-runnable demos
├── email-templates/                 HTML email templates (Setup → Templates)
│   ├── applicant_submission_to_nc.html
│   ├── reviews_complete_for_nc_admin.html
│   ├── safeguarding_flag_raised.html
│   ├── shortlist_congratulations.html
│   ├── nomination_to_school.html
│   ├── place_confirmed.html
│   ├── place_confirmed_nc.html
│   ├── place_confirmed_io.html
│   └── membership_renewal_due.html
└── screenshots/                     (filled in during build for QA evidence)
```

## Build order

1. **Sample-data CSVs first** — build modules, import CSVs, verify lookups resolve.
2. **Email templates** — needed before workflow rules reference them.
3. **Deluge functions** — paste each, click "Save and Execute" once to verify syntax.
4. **Blueprint + Workflow Rules + Layout Rules** — last, since they call functions and templates.
5. **Demo reset** — run before every dry‑run.

## Conventions used in CSVs

| Column suffix | Meaning |
|---|---|
| `_id` | Zoho record ID — leave blank, Zoho assigns on import. |
| `_lookup` | Display value of the linked record (Zoho resolves by name match). Use the EXACT Display Name. |
| `_picklist` | One of the picklist values defined in the field. |
| `_yyyy_mm_dd` | Date in `yyyy-mm-dd` format (ISO). |
| `_yyyy_mm_dd_hh_mm` | DateTime in `yyyy-mm-dd HH:mm:ss` (org timezone). |

## Sample data principles

- **No default Zoho sample data** — purge Christopher Maclead, Sage Wieser, etc., first.
- **All names match `BUILD_DECISIONS_v4 §2`** — Sofia / Ana / Marcus / etc.
- **Pre-seeded "natural state"** for Mon 1 June demo:
  - Sofia = `Under Review`, Clara's row already submitted.
  - Miguel = `Under Review`, NO safeguarding flag (live flip during demo).
  - Place Allocations: Atlantic × Brazil = 4 allocated / 0 used.
  - MoU Annual Report Q2 2026 for Kenya = `Overdue` (Due 2026-03-31).
  - Marcus Weber = `Opted Out` (Consent Records: 2 rows).
  - Dr Ravi Menon + Thomas Berger = `Lapsed` Governance Memberships.

Run `demo_reset.deluge` (single Deluge function, takes ~10 seconds) to restore this state between dry‑runs.
