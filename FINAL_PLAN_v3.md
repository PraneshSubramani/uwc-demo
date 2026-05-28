# UWC Demo — FINAL PLAN v3 (definitive, post live-CRM audit)

**Date:** 27 May 2026 (Wed evening)
**Demo:** Mon 1 June 2026 · 15:00–17:00 BST
**Presenter:** Akanksha Anand
**Internal review:** Fri 29 May AM (Paul Whitelock + Dash Bunyan)
**Build window:** Wed evening 27 — Fri 29 May
**Author:** Sam Prabhu

**Supersedes:** `FINAL_PLAN_v2.md`
**Companion doc:** `CRM_ARCHITECTURE_DELTA.md` (live audit + module-by-module current-vs-target)
**Working folder:** `/Users/raviagentstudio/workspace/uwc-demo-project/uwc-demo/`

---

## 0. What changed since v2

1. **Live CRM audit complete.** I logged into `crm.zoho.eu` org `20114943111` as `uwc_admin@a2zcloud.eu.com` via Playwright. Captured 5 reference screenshots covering Contacts list, Leads list, Applications Kanban, Programmes empty state, Accounts permission-denied error. All in `wireframes/_shared/assets/zoho-reference/`.
2. **Major architectural pattern discovered.** The team renamed standard modules: **Applications = Potentials** (Deals module renamed), **Programmes = Products**. Plus 4 net-new custom modules (Local Questions, Academic Details, Documents Details, Questions).
3. **Critical blockers found.** `uwc_admin` profile has no access to Accounts module or Setup. Without a higher-privilege account, NCs/Schools/Blueprint/Roles cannot be built in live Zoho.
4. **UWC brand assets fetched.** Official logo SVG, hero photo of students with flags, wordmark, 21 country flag SVGs — all live from uwc.org. Live logo navy is `#004A97` (3-point shift from Build Plan's `#003087`).
5. **Zoho UI fidelity now locked.** I have 5 real screenshots of the actual CRM showing exactly the dark-topbar / left-sidebar / blue-CTA / light-grey-content density. Wireframes will match this pixel-by-pixel for CRM-side screens.

---

## 1. The strategy in one sentence

**~75% of the demo runs from the 7 wireframe HTML files** (which assume the target architecture), with the live Zoho org used as the "this is real — switch tabs to prove it" moment in each scenario. The wireframes carry the role-switcher pattern that lets Akanksha demonstrate UWC's "different perspectives" requirement live in one click.

This split is explicitly allowed by UWC's brief:
> "UWC International does not expect suppliers to present a fully configured solution; however, the environment must be configured sufficiently to demonstrate the concepts and workflows within each scenario."

---

## 2. Locked decisions (all from your reply on plan v2 + today's audit)

| # | Decision | Status |
|---|---|---|
| D1 | Ignore old `uwc_full_scenario B_demo.html`. Build 7 new HTML files A–G. | ✅ Locked |
| D2 | **Role-switcher dropdown in topbar of every scenario file.** Akanksha can change View as → Marcus / Sofia / Data Protection Lead / etc. and the screen re-renders with that role's field-level visibility, action affordances, and dashboard. | ✅ Locked |
| D3 | NCs as Account record types (target state). Live state: Accounts is permission-denied for uwc_admin — needs unlock. | ⚠️ Target locked; live blocker |
| D4 | Akanksha pre-briefed. | ✅ |
| D5 | Drop Technical Questions written response from this build. | ✅ |
| D6 | Build `00_index.html` landing page. | ✅ |
| D7 | Two visual modes per file — UWC-branded for portal pages, pixel-accurate Zoho CRM for back-office. I now have live reference screenshots locked. | ✅ |
| D8 | No GitHub Pages required. Optional non-blocking push to gh-pages on Sat 30 if time allows. | ✅ |
| D9 | Data model file = Salesforce Schema-Builder-style ERD + overall architecture diagram. | ✅ Locked. **NEW: ERD will show both current state (greyed) and target state (coloured)** based on the audit. |
| D10 | UWC logo + assets — fetched from uwc.org. ✅ Done. | ✅ |

---

## 3. Final file structure

```
uwc-demo/
├── docs/                                  (existing UWC briefs + Build Plan + old scenario B — untouched)
├── wireframes/                            (NEW — everything I produce)
│   ├── _shared/
│   │   ├── uwc-tokens.css                 UWC palette, fonts, spacing
│   │   ├── zoho-tokens.css                Zoho UI tokens from live audit
│   │   ├── role-switcher.js               cross-file role-switching engine
│   │   ├── sample-data.js                 Sofia, Ana, Marcus, etc. — single source
│   │   ├── components.html                annotated component library
│   │   └── assets/
│   │       ├── uwc-brand/
│   │       │   ├── uwc-logo.svg          ✅ DOWNLOADED (29 KB)
│   │       │   ├── uwc-wordmark-192.png  ✅ DOWNLOADED
│   │       │   ├── hero-students-flags.jpeg  ✅ DOWNLOADED (219 KB)
│   │       │   └── flags/                 ✅ 21 country SVGs (br, ke, pt, gh, gn, gb, no, in, de, ca, us, etc.)
│   │       └── zoho-reference/
│   │           ├── 01-contacts-list.png   ✅ CAPTURED (live)
│   │           ├── 02-leads-list.png      ✅ CAPTURED
│   │           ├── 03-applications-kanban.png  ✅ CAPTURED
│   │           ├── 04-programmes-list.png ✅ CAPTURED (empty state)
│   │           └── 05-accounts-list.png   ✅ CAPTURED (permission-denied dialog)
│   ├── 00_index.html                       UWC-branded picker: 7 scenario cards + data model + reference
│   ├── 01_scenario_A.html                  NC Admin · Permissions · Programme Config  (9 steps · ~8 min)
│   ├── 02_scenario_B.html                  Applicant Registration · Eligibility · Form  (10 steps · ~10 min)
│   ├── 03_scenario_C.html                  Selection · Scoring · Safeguarding  (10 steps · ~10 min)
│   ├── 04_scenario_D.html                  Nomination · Place Allocation · Pack  (10 steps · ~9 min)
│   ├── 05_scenario_E.html                  Governance Structure · Body Management  (8 steps · ~7 min)
│   ├── 06_scenario_F.html                  NC Management · Volunteer Oversight  (8 steps · ~8 min)
│   ├── 07_scenario_G.html                  Comms · Mailing Lists · Bulk Updates  (9 steps · ~8 min)
│   └── 99_data_model.html                  Salesforce-style ERD (current vs target) + architecture diagram
├── PLAN_FOR_PRANESH_REVIEW.md             (v1 — superseded)
├── FINAL_PLAN_v2.md                       (v2 — superseded)
├── CRM_ARCHITECTURE_DELTA.md              ✅ WRITTEN — current-state audit + delta
└── FINAL_PLAN_v3.md                       (this file)
```

---

## 4. The role-switcher — final spec

Topbar of every scenario file:
```
[ UWC International · DEMO ]    View as: [👤 Marcus Weber · NC Admin (DE) ▼]    [Step 4 of 9]
```

Dropdown contents are scoped per scenario. When the user changes:
- Data-attribute-driven show/hide: `data-role-show="ios,nc-admin-de"` / `data-role-hide="data-protection"`
- Field-level masking: `data-role-fields-mask="dob,financial_aid"` → renders as `••••••••`
- Content variants: `data-role-variant="ios:Full audit|nc-admin-de:Germany only|data-protection:Restricted"`
- Topbar role badge colour-codes by role family (blue=IO, green=NC Admin, amber=Reviewer, red=Data Protection, purple=School, white=Portal)

Engine is `_shared/role-switcher.js`, also inlined into each file as fallback for `file://` CORS.

Per-scenario dropdown options:
| Scenario | Roles available |
|---|---|
| A | Marcus (NC Admin DE) · Ana (NC Admin BR) · Akanksha (IO Super Admin) · Data Protection Lead |
| B | Public visitor · Sofia (Portal) · Maria Almeida (Guardian) · Ana (NC Admin) · IO Marketing |
| C | Clara (Reviewer) · Paulo (Reviewer) · Ana (NC Admin) · Akanksha (IO Super Admin) |
| D | Fatima (IO Admissions) · Ana (NC Admin) · Helen (Atlantic School) |
| E | Akanksha (IO Super Admin) · IO CRM Administrator |
| F | Akanksha (IO Super Admin) · Grace (NC Chair Kenya) |
| G | IO Marketing · Akanksha (IO Super Admin) · Individual Contact (Jonathan Osei) · Marcus (opted-out) |

---

## 5. Visual fidelity — Zoho UI tokens from live audit

Captured from live Zoho EU org screenshots:

```css
/* Zoho CRM UI (Vertical / modern) — from live audit 27-May-2026 */
:root {
  --zoho-topbar-bg: #1c1f25;          /* dark navy/charcoal */
  --zoho-topbar-text: #ffffff;
  --zoho-sidebar-bg: #f7f8fa;         /* very light grey */
  --zoho-sidebar-active-bg: #e6efff;  /* light blue active state */
  --zoho-sidebar-active-text: #2563eb;
  --zoho-content-bg: #ffffff;
  --zoho-content-alt: #f9fafb;        /* zebra rows */
  --zoho-border: #e5e7eb;
  --zoho-primary: #3b6ef5;            /* Create Contact, Create Lead buttons */
  --zoho-primary-hover: #2563eb;
  --zoho-text: #1f2937;
  --zoho-text-secondary: #6b7280;
  --zoho-pill-today: #ffa940;         /* orange "Today" pill */
  --zoho-pill-recent: #4ade80;        /* green date pills */
  --zoho-pill-overdue: #ef4444;       /* red overdue pill */
  --zoho-kanban-col: #e8f4f4;         /* Kanban column header tint */
  --zoho-sidebar-width: 225px;
  --zoho-topbar-height: 48px;
  --zoho-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Open Sans", sans-serif;
}
```

```css
/* UWC brand tokens — from Build Plan v4.1 §1.1, cross-checked vs live uwc.org */
:root {
  --uwc-navy: #003087;                /* Build Plan primary; Pantone 2945 */
  --uwc-navy-live: #004A97;           /* What the live website renders; secondary */
  --uwc-red: #C8102E;                 /* Accent — CTAs, safeguarding */
  --uwc-teal: #009482;                /* From logo decorative motif; charts/data viz */
  --uwc-white: #ffffff;
  --uwc-tint: #E8EEF6;                /* Light navy tint — table rows, panels */
  --uwc-grey: #6C757D;                /* Helper text */
  --uwc-title-font: 'Playfair Display', Georgia, serif;
  --uwc-body-font: 'DM Sans', system-ui, sans-serif;
  --uwc-mono-font: 'DM Mono', ui-monospace, monospace;
}
```

---

## 6. Per-scenario screen plan (unchanged from v2 — included for reference)

All 7 scenarios use the role-switcher topbar + sidebar step nav + main scroll area. Details in `FINAL_PLAN_v2.md §4` — not duplicating here.

**Step counts per scenario:**
| Scenario | Steps | Time |
|---|---|---|
| A | 9 | ~8 min |
| B | 10 | ~10 min |
| C | 10 | ~10 min |
| D | 10 | ~9 min |
| E | 8 | ~7 min |
| F | 8 | ~8 min |
| G | 9 | ~8 min |
| **Total** | **64 steps** | **~60 min** (exact UWC slot) |

---

## 7. Build sequence (locked timeline)

**Now → Mon 1 June 15:00 = 4 calendar days + tonight**

| When | Output | Dep |
|---|---|---|
| **Wed 27 May evening** (now → +3h) | `_shared/uwc-tokens.css`, `_shared/zoho-tokens.css`, `_shared/role-switcher.js`, `_shared/sample-data.js`, `00_index.html` | Plan approval (this doc) |
| Wed 27 May late (+2h) | `99_data_model.html` ERD + architecture diagrams (SVG hand-laid) | None |
| **Thu 28 May AM** | `01_scenario_A.html` + `02_scenario_B.html` | None |
| Thu 28 May PM | `03_scenario_C.html` + `04_scenario_D.html` | None |
| **Fri 29 May AM** | `05_scenario_E.html` + `06_scenario_F.html` + `07_scenario_G.html` | None |
| Fri 29 May lunchtime | All 9 files complete · internal review with Paul + Dash | Internal review attendees |
| **Sat 30 May** | Apply fix list · final Zoho fidelity pass (now that I have the live screenshots) | Fix list from Paul + Dash |
| Sun 31 May | Polish · Akanksha dry-run · final tab-preload script | Akanksha availability |
| **Mon 1 June 14:30** | Tab pre-load per Presenter Guide | — |
| **Mon 1 June 15:00** | Live demo | — |

**In parallel** (owned by Sagar + Priyanka if Setup access lands):
- P0-1 unlock Accounts for the demo profile
- P0-3 replace org logo
- P0-4 clear default sample data
- P0-5/6/7 create UWC sample data
- P0-8 build Application Blueprint (10 stages)
- P0-9 create 8 named users with role boundaries

Per `CRM_ARCHITECTURE_DELTA.md §4.1`, these P0 items total ~7h of work — feasible across two people if Setup is unlocked tonight.

---

## 8. Dependencies still outstanding

| # | Need | From | Hard or Soft? |
|---|---|---|---|
| Dep1 | **Approval to start executing** | Pranesh | Hard — I won't write code until you say go |
| Dep2 | **Setup access** for whoever is configuring real Zoho (Sagar/Priyanka) | Pranesh / Paul | Hard for the live-Zoho parts of the demo |
| Dep3 | **Accounts module unlock** for the demo user(s) | Same as Dep2 | Hard for any NC/School live demo |
| Dep4 | **UWC org logo replacement** in Personalisation | Sagar (once Setup access) | Soft but visible |
| Dep5 | Confirmation on Q5 — keep or call out the renamed-Potentials strategy in the wireframes | Pranesh | Soft |
| Dep6 | Confirm: Q7 — 8 named users as real Zoho licences? | Pranesh / Paul | Soft for wireframe; hard for live demo of role boundaries |

---

## 9. What you get when this is done

1. **Seven scenario wireframe HTML files** — each self-contained, opens in any browser, with role-switcher topbar, scenario step nav, and a UWC-portal-mode + Zoho-CRM-mode visual split.
2. **One landing page** — UWC-branded, picks A–G with one click.
3. **One data model page** — Salesforce Schema-Builder-style ERD showing current state (greyed boxes for what exists) vs target state (coloured boxes for what needs build), connector arrows with cardinality, plus an 8-layer architecture diagram (external actors → portals → API → CRM core → automations → storage → integrations → security).
4. **One CRM architecture delta doc** (`CRM_ARCHITECTURE_DELTA.md`) — already written. Module-by-module audit, P0/P1/P2 priorities for Sagar + Priyanka.
5. **A `_shared/` library** Akanksha or anyone else can re-edit single-source — design tokens, role-switcher engine, sample data, real UWC assets, real Zoho UI reference screenshots.

---

## 10. Acceptance checklist before I begin

- [ ] You've read `CRM_ARCHITECTURE_DELTA.md` and approve the rename-Potentials-for-demo strategy
- [ ] You confirm I should proceed with the wireframes assuming the **target** architecture (not the current state)
- [ ] You'll route Q1 (Super Admin access for Sagar/Priyanka) to Paul tonight or tomorrow AM
- [ ] You're happy with the live UWC navy `#003087` (Build Plan) — OR you want me to switch to `#004A97` (live website)
- [ ] You're happy with the role-switcher dropdown pattern per scenario
- [ ] You confirm I should start NOW with `_shared/*` + `00_index.html` + `99_data_model.html`

**Reply with one line:**
- `GO` → I start tonight, deliver per the table in §7
- `GO, switch to #004A97` → same, with navy adjusted
- `WAIT: <changes>` → I redline and re-issue

— Final plan v3 ends —
