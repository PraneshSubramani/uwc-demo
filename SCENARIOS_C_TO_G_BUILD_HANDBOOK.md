# UWC Demo — Scenarios C–G — Zoho CRM Build Handbook

**For:** Sagar + Priyanka — click‑by‑click build instructions
**Org:** `20114943111` on `crm.zoho.eu` · admin login `uwc_admin@a2zcloud.eu.com`
**Companion docs:**
- Strategy: `SCENARIOS_C_TO_G_ZOHO_CRM_PLAN.md`
- Applications Blueprint: `BLUEPRINT_AND_WORKFLOW_SPEC.md` (already locked)
- Paste‑ready assets: `zoho-build/` folder
**Drafted:** Thu 28 May 2026 (evening) by Sam Prabhu
**Window:** Thu eve + Fri 29 = ≈14h. Parallel build (Sagar = data + modules; Priyanka = automation + Blueprint).

> **Convention used throughout.** Every step starts at the gear icon (top‑right of `crm.zoho.eu` after login). Every click path is written as breadcrumb: `gear → Customisation → Modules and Fields → Applications`. Field labels in **bold**, API names in `monospace`. Picklist values are `code-quoted`.

---

## 0 — Pre‑flight (DO FIRST — 30 min)

### 0.1 Confirm Super Admin access (P0)
1. Log in as `uwc_admin@a2zcloud.eu.com`.
2. Click **gear** (top‑right) → "Setup".
3. If you see a side menu with "Users and Control" → "Customisation" → "Automation" → **you have access**. Skip to §0.2.
4. If you get "Insufficient privileges": stop. Pranesh must promote your profile to **Administrator** before any of this build can start.

### 0.2 Purge default Zoho sample data
The org currently has placeholder data ("Christopher Maclead", "Sage Wieser", "Benton", "Chemel" etc.) — Build Plan §2 forbids these on demo day.

| Module | Action |
|---|---|
| Leads | Module → List View "All Leads" → Select All → "Delete Selected" → confirm. |
| Contacts | Module → All Contacts → Select All → Delete. Keep your own user record + Akanksha if she's a Contact. |
| Applications (Potentials) | Module → "All Applications" → Select All → Delete (Benton, Truhlar, Chemel, Chanay). |
| Tasks | Filter `Owner = uwc_admin` → Delete demo tasks. |
| Meetings | Filter for "Demo" / "Webinar" / "TradeShow" → Delete. |

### 0.3 Brand fix
gear → **Personalisation** → **Company Details**:
- **Logo:** Upload `wireframes/_shared/assets/uwc-brand/uwc-logo.svg` — the navy UWC mark.
- **Company Name:** `UWC International (Demo)`.
- gear → **Personalisation** → **Theme**: pick the "Classic" theme, then customise:
  - Primary colour → `#003087` (UWC navy)
  - Accent colour → `#C8102E` (UWC red — used for danger states)

### 0.4 Disable noisy sidebar modules (declutter)
gear → **Modules and Fields** → for each of `Vendors · Sales Inbox · Services · Projects · Questions (custom)`: click the kebab menu → "Disable Module".
Leave only: Home · Leads · Contacts · Applications · Programmes · Campaigns · Tasks · Meetings · Calls + the new custom modules built below.

### 0.5 Create the 4 Permission Profiles
gear → **Users and Control** → **Profiles** → **+ New Profile**.

| Profile name | Clone from | Modules visible | Notes |
|---|---|---|---|
| `IO Super Admin` | Administrator | All | Used by Akanksha. |
| `NC Admin` | Standard | Apps, Contacts, NCs, Schools, Programmes, NC Volunteers, MoU Obligations, Mailing Lists, Tasks, Meetings | Save without setting FLS yet — we'll layer it in §2.4. |
| `Reviewer` | Standard | Apps (custom view "My Review Queue"), Contacts (own NC), Review Scores subform read‑only on peer rows | FLS in §2.4. |
| `Data Protection Lead` | Standard | Contacts, Consent Records, Communication Logs, Safeguarding Cases, Audit Logs | Mask DOB/Address in Contacts (FLS in §6.4). |

(We **don't create users** for these profiles — Akanksha demos by switching profiles. One optional exception in §5.6 for the blind‑review proof.)

### 0.6 Create 3 Roles (for data scope)
gear → **Users and Control** → **Roles**.

```
International Office  (top)
├── NC Admin
│   ├── NC Reviewer
│   └── NC Volunteer
└── School Admissions Director
```

uwc_admin gets `International Office` role + `IO Super Admin` profile.

---

## 1 — Build the custom modules (CSVs paste‑ready in `zoho-build/csv/`)

For every module: gear → **Modules and Fields** → **+ Create New Module**. After creation, **immediately go to Layouts → Standard Layout → Edit** and set sections in the order shown.

### 1.1 National Committees `National_Committees` (M‑1)
**Layout sections:** Identity · Leadership · Stats · Compliance · System.

| Section | Label | API name | Type | Mandatory | Default | Notes |
|---|---|---|---|---|---|---|
| Identity | NC Name | `NC_Name` | Single‑line text (60) | ✓ | — | — |
| Identity | NC Code | `NC_Code` | Single‑line text (2) | ✓ | — | `BR · DE · KE · IN · UK`. Used in nomination refs. |
| Identity | Country | `Country` | Picklist (ISO) | ✓ | — | Sagar imports ISO list once and reuses. |
| Identity | Status | `NC_Status` | Picklist | ✓ | `Active` | `Active · Suspended · Observer · Inactive` |
| Identity | Established Year | `Established_Year` | Integer | — | — | — |
| Leadership | NC Chair | `NC_Chair_Lookup` | Lookup → NC Volunteers | — | — | Populated AFTER NC Volunteers exist. |
| Leadership | Governance Body | `Governance_Body_Lookup` | Lookup → Governance Bodies | — | — | — |
| Stats | Members Count | `Member_Count` | Integer | — | 0 | Roll‑up handled by `recompute_mou_health` peer function (writes both). |
| Stats | Active Volunteers | `Active_Volunteer_Count` | Integer | — | 0 | Same. |
| Compliance | MoU Health | `MoU_Health` | Single‑line text (16) | — | `Good` | Written by `recompute_mou_health`. Values: `Good · Attention · Critical`. |
| Compliance | Overdue MoUs | `Overdue_MoU_Count` | Integer | — | 0 | Same writer. |
| Compliance | Country Flag URL | `Country_Flag_URL` | URL | — | — | Set in CSV from raw GitHub URLs of `wireframes/_shared/assets/uwc-brand/flags/<cc>.svg`. |
| System | Created By, Modified By, etc. | (standard) | — | — | — | — |

**List View** "All NCs" — show columns: NC Name · Country · Status · MoU Health · Overdue MoUs · Members Count.
**Conditional formatting on the list view** (Setup → Customization → List Views → Conditional Formatting):
- `MoU_Health = Critical` → background `#FEE2E2` (red‑50)
- `MoU_Health = Attention` → background `#FEF3C7` (amber‑50)
- `MoU_Health = Good` → background `#D1FAE5` (green‑50)

### 1.2 Schools `Schools` (M‑2)
**Layout sections:** Identity · Capacity · Contacts · System.

| Section | Label | API name | Type | Notes |
|---|---|---|---|---|
| Identity | School Name | `School_Name` | Text (60) ✓ | — |
| Identity | School Code | `School_Code` | Text (4) ✓ | e.g. `ATLN · NORD · MAHI`. |
| Identity | Country | `Country` | Picklist (ISO) | — |
| Identity | Active | `Is_Active` | Checkbox | Default `true`. |
| Capacity | Total Places | `Total_Places` | Integer | — |
| Capacity | Programme Type | `Programme_Type` | Picklist | `IB Diploma · Foundation · Short Course`. |
| Contacts | Admissions Director | `Admissions_Director` | Lookup → Contacts | — |
| Contacts | Admissions Email | `Admissions_Email` | Email | Mirror of Director's email for workflow merge. |
| System | (standard) | | | |

### 1.3 Programmes (rename of Products) — already exists as `Products`, empty
gear → **Modules and Fields** → **Products** → "Rename Module" → display name `Programmes`. API name stays `Products`.

Add custom fields to Products:

| Label | API name | Type | Notes |
|---|---|---|---|
| Programme Year | `Programme_Year` | Integer | — |
| National Committee | `National_Committee` | Lookup → National Committees | — |
| Open Date | `Open_Date` | Date | — |
| Deadline | `Deadline` | Date | — |
| Total Places | `Total_Places` | Integer | — |
| Programme Status | `Programme_Status` | Picklist | `Draft · Open · Closed · Archived`. |

### 1.4 Applications module (extends `Deals`) — full field list
The Blueprint itself is in `BLUEPRINT_AND_WORKFLOW_SPEC.md §2`. Here we add the fields that the Blueprint + Scenarios C/D need (some already specified in §1.2 of that doc; reproduced here for completeness in one place).

gear → **Modules and Fields** → **Applications** → Layouts → "Standard layout" → Edit.

**Section order:** Identity · Stage & Lifecycle · Eligibility · Form Responses · Consent · Reviewers · Safeguarding · Nomination · Audit · System.

| Section | Label | API name | Type | Default | Notes |
|---|---|---|---|---|---|
| Identity | Application Name | `Deal_Name` (rename label) | Auto‑number | — | Format `APP-{YYYY}-{00001}`. |
| Identity | Applicant Name | `Contact_Name` (rename label) | Lookup → Contacts | — | — |
| Identity | National Committee | `National_Committee` | Lookup → National Committees | — | — |
| Identity | Programme | `Programme` | Lookup → Products | — | — |
| Identity | Application Language | `Application_Language` | Picklist | `English` | `English · Português · Español · Français · العربية` |
| Stage & Lifecycle | Stage | `Stage` (relabel "Application Stage") | Picklist | `Registered` | 10 values per BLUEPRINT_AND_WORKFLOW_SPEC §2.1 |
| Stage & Lifecycle | Submitted Date | `Submitted_Date` | DateTime | — | Auto via Blueprint T2 after action. |
| Stage & Lifecycle | Application Deadline | `Closing_Date` (rename) | Date | — | Auto from `Programme.Deadline`. |
| Eligibility | Eligibility Status | `Eligibility_Status` | Picklist | `Pending Check` | `Pending Check · Passed · Failed` |
| Eligibility | Eligibility Failed Reason | `Eligibility_Failed_Reason` | Text (255) | — | Layout Rule: show only when `Failed`. |
| Eligibility | Country of Residence | `Country_of_Residence` | Picklist (ISO) | — | — |
| Eligibility | Citizenship | `Citizenship` | Multi‑select picklist (ISO) | — | — |
| Form Responses | Personal Statement | `Personal_Statement` | Multi‑line (5000) | — | — |
| Form Responses | Education Background | `Education_Background` | Multi‑line (3000) | — | — |
| Form Responses | Extracurricular | `Extracurricular_Activities` | Multi‑line (3000) | — | — |
| Form Responses | Leadership Statement | `Leadership_Statement` | Multi‑line (3000) | — | — |
| Form Responses | NC Local Question Answer | `NC_Local_Question_Answer` | Multi‑line (3000) | — | — |
| Form Responses | Form Completion % | `Form_Completion_Pct` | Formula (Integer) | — | Formula in BLUEPRINT_AND_WORKFLOW_SPEC §4.1 |
| Consent | Parental Consent Status | `Parental_Consent_Status` | Picklist | `Pending` | `Pending · Received · Waived` |
| Consent | Parental Consent Date | `Parental_Consent_Date` | DateTime | — | Auto on flip to Received. |
| Consent | Guardian Contact | `Guardian_Contact` | Lookup → Contacts | — | — |
| Reviewers | Assigned Reviewers | `Assigned_Reviewers` | Multi‑user lookup | — | Set during Blueprint T3 transition. |
| Reviewers | Review Count | `Review_Count` | Integer | `0` | Auto‑incremented. |
| Reviewers | All Reviews Complete | `All_Reviews_Complete` | Checkbox | `false` | Auto‑flipped. |
| Reviewers | Average Score | `Average_Score` | Formula (Decimal) | — | `(Sum subform 4 scores) / (Review_Count * 4)`. |
| Safeguarding | Safeguarding Flag Status | `Safeguarding_Flag_Status` | Picklist | `None` | `None · Under Review · Escalated · Resolved · Closed` |
| Safeguarding | Safeguarding Raised By | `Safeguarding_Flag_Raised_By` | Lookup → Users | — | Auto on flag. |
| Safeguarding | Safeguarding Raised Date | `Safeguarding_Flag_Raised_Date` | DateTime | — | Auto. |
| Nomination | School Nominated | `School_Nominated` | Lookup → Schools | — | — |
| Nomination | BC Invoice ID | `BC_Invoice_ID` | Text (32) | — | Set by `send_to_business_central` stub. |
| Audit | Unlock Reason | `Unlock_Reason` | Text (255) | — | Required for T10 (Submitted → In Progress) Blueprint transition. |

**Review Scores subform** — gear → Modules and Fields → Applications → **+ Subform**:

| Subform field | API name | Type | Notes |
|---|---|---|---|
| Reviewer | `Reviewer_Lookup` | Lookup → Users | — |
| Academic Potential | `Score_Academic` | Integer (1–10) | — |
| Community Engagement | `Score_Community` | Integer (1–10) | — |
| Communication Skills | `Score_Communication` | Integer (1–10) | — |
| UWC Values Commitment | `Score_Values` | Integer (1–10) | — |
| Overall Recommendation | `Overall_Recommendation` | Picklist | `Yes · Conditional · No` |
| Reviewer Comments | `Reviewer_Comments` | Multi‑line (2000) | — |
| Submitted At | `Submitted_At` | DateTime | Auto via WR. |
| Visible to NC Admin | `Visible_to_NC_Admin` | Checkbox | Default `false`. |

### 1.5 Safeguarding Cases `Safeguarding_Cases` (M‑6)
| Section | Label | API name | Type | Notes |
|---|---|---|---|---|
| Identity | Case ID | `Case_Id` | Auto‑number | Format `SGC-{YYYY}-{00001}`. |
| Identity | Reporter | `Reporter_Lookup` | Lookup → Users | Auto by `create_safeguarding_case`. |
| Identity | Date Raised | `Date_Raised` | DateTime · Auto | — |
| Triage | Severity | `Severity` | Picklist ✓ | `Low · Medium · High` |
| Triage | Status | `SG_Status` | Picklist | `Under Review · Escalated · Resolved · Closed`. Default `Under Review`. |
| Triage | Triage Notes | `Triage_Notes` | Multi‑line (5000) | Visible to IO Super Admin + DPL only (FLS). |
| Resolution | Resolution Steps | `Resolution_Steps` | Multi‑line (5000) | — |
| Resolution | Resolution Date | `Resolution_Date` | DateTime | Auto on transition to `Resolved`. |
| Linked | Linked Application | `Application_Lookup` | Lookup → Applications ✓ | — |
| Linked | Linked Contact | `Contact_Lookup` | Lookup → Contacts | Auto via Deluge. |

**Blueprint on Safeguarding_Cases.SG_Status:** `Under Review → Escalated → Resolved → Closed`. Gate: cannot leave `Under Review` unless `Triage_Notes` non‑empty.

### 1.6 School Place Allocations `School_Place_Allocations` (M‑7)
| Section | Label | API name | Type | Notes |
|---|---|---|---|---|
| Identity | Allocation ID | `Allocation_Id` | Auto‑number | `SPA-{YYYY}-{0001}`. |
| Identity | School | `School_Lookup` | Lookup → Schools ✓ | — |
| Identity | NC | `NC_Lookup` | Lookup → National Committees ✓ | — |
| Identity | Cycle | `Cycle` | Picklist | `2026 · 2027 · 2028` |
| Capacity | Places Allocated | `Places_Allocated` | Integer ✓ | — |
| Capacity | Places Used | `Places_Used` | Integer | Default `0`. |
| Capacity | Places Remaining | `Places_Remaining` | Formula (Integer) | `Places_Allocated - Places_Used`. |

**Custom button** "Allocate Places" on the **list view** (visible to IO Super Admin only): runs a popup that updates `Places_Allocated`.

### 1.7 Nomination Packs `Nomination_Packs` (M‑8)
| Section | Label | API name | Type | Notes |
|---|---|---|---|---|
| Identity | Pack ID | `Pack_Id` | Auto‑number | `NP-{YYYY}-{00001}`. |
| Identity | Application | `Application_Lookup` | Lookup → Applications ✓ | — |
| Identity | Target School | `Target_School_Lookup` | Lookup → Schools ✓ | — |
| Status | Pack Status | `Pack_Status` | Picklist | `Draft · Generated · Sent · Acknowledged · Accepted · Declined` |
| Status | Generated At | `Generated_At` | DateTime · Auto | Set by `generate_nomination_pack`. |
| Status | NC Reference | `NC_Reference` | Text (24) | Auto. e.g. `BR-2026-041`. |
| Status | BC Invoice ID | `BC_Invoice_ID` | Text (32) | Mirror of Application field. |
| Attachments | Pack PDF | (file attachment field) | File Upload | Attached by Deluge. |

**Custom button** "Accept Nomination" on the Pack detail page: visible when `Pack_Status = Sent`, sets `Pack_Status = Accepted`.

### 1.8 Governance Bodies `Governance_Bodies` (M‑9)
| Section | Label | API name | Type | Notes |
|---|---|---|---|---|
| Identity | Body Name | `Body_Name` | Text (60) ✓ | — |
| Identity | Type | `Body_Type` | Picklist ✓ | `Board · Committee · Advisory` |
| Identity | Status | `Body_Status` | Picklist | `Active · Dormant · Dissolved`. Default `Active`. |
| Hierarchy | Parent Body | `Parent_Body` | Lookup → Governance Bodies | Self‑ref. |
| Identity | Purpose | `Body_Purpose` | Multi‑line (3000) | — |
| Stats | Member Count | `Member_Count` | Integer | Roll‑up via `recompute_membership_counts`. |
| Stats | Expired Member Count | `Expired_Member_Count` | Integer | Same. |

### 1.9 Governance Memberships `Governance_Memberships` (M‑10)
| Section | Label | API name | Type | Notes |
|---|---|---|---|---|
| Identity | Member | `Member_Contact` | Lookup → Contacts ✓ | — |
| Identity | Body | `Governance_Body` | Lookup → Governance Bodies ✓ | — |
| Identity | Role | `Member_Role` | Picklist ✓ | `Chair · Vice‑Chair · Trustee · Secretary · Treasurer · Advisor` |
| Term | Appointed Date | `Appointed_Date` | Date ✓ | — |
| Term | Term Length (years) | `Term_Length` | Integer | Default `3`. |
| Term | Term Expires | `Term_Expires` | Formula (Date) | `Appointed_Date + (Term_Length × 365)`. |
| Status | Status | `Membership_Status` | Picklist | `Active · Lapsed · Resigned · Concluded`. Default `Active`. |
| Competencies | Competencies Held | `Competencies_Held` | Multi‑lookup → Competencies | Drives matrix. |

### 1.10 Competencies `Competencies` (M‑11)
| Label | API name | Type | Notes |
|---|---|---|---|
| Competency Name | `Competency_Name` | Text ✓ | e.g. "Marketing & Comms". |
| Category | `Competency_Category` | Picklist | `Governance · Finance · Legal · Technical · Regional · Sector` |
| Required for Board | `Required_Board` | Checkbox | Default `true`. |
| Total Holders | `Total_Holders` | Integer | Auto via `recompute_competency_gaps`. |
| Gap Count | `Gap_Count` | Integer | Auto via same. |

### 1.11 NC Volunteers `NC_Volunteers` (M‑12)
| Section | Label | API name | Type | Notes |
|---|---|---|---|---|
| Identity | Full Name | `Full_Name` | Formula (Text) | `First_Name + " " + Last_Name`. |
| Identity | Contact | `Contact_Lookup` | Lookup → Contacts ✓ | — |
| Identity | NC | `NC_Lookup` | Lookup → National Committees ✓ | — |
| Role | Role | `Volunteer_Role` | Picklist ✓ | `Chair · Admin · Selection Coordinator · Reviewer · Observer` |
| Role | Member Since | `Member_Since` | Date | — |
| Access | Portal Role | `Portal_Role` | Picklist | `Chair · Member · None` |
| Training | Training Status | `Training_Status` | Text (16) | Auto via `recompute_volunteer_training_status`. Values: `CURRENT · EXPIRING SOON · EXPIRED · MISSING`. |

### 1.12 Training Records `Training_Records` (M‑13)
| Label | API name | Type | Notes |
|---|---|---|---|
| Volunteer | `Volunteer_Lookup` | Lookup → NC Volunteers ✓ | — |
| Training Type | `Training_Type` | Picklist ✓ | `Safeguarding · Code of Conduct · Selection Process · GDPR` |
| Completed | `Completed_Date` | Date ✓ | — |
| Expires | `Expiry_Date` | Formula (Date) | See expiry function below. |
| Certificate | `Certificate_Attachment` | File Upload | Optional. |
| Status | `Training_Status` | Formula (Text) | `CURRENT` (Expiry > today + 90) · `EXPIRING SOON` (within 90) · `EXPIRED` (past). |

Expiry formula:
```
if (${Training_Type} == "Safeguarding") return addDays(${Completed_Date}, 730);
if (${Training_Type} == "Code of Conduct") return addDays(${Completed_Date}, 1095);
if (${Training_Type} == "Selection Process") return addDays(${Completed_Date}, 365);
if (${Training_Type} == "GDPR") return addDays(${Completed_Date}, 730);
return ${Completed_Date};
```

### 1.13 MoU Obligations `MoU_Obligations` (M‑14)
| Label | API name | Type | Notes |
|---|---|---|---|
| Obligation Name | `Obligation_Name` | Text ✓ | — |
| NC | `NC_Lookup` | Lookup → National Committees ✓ | — |
| Due Date | `Due_Date` | Date ✓ | — |
| Status | `Obligation_Status` | Picklist | `Pending · Submitted · Overdue · Waived`. Default `Pending`. |
| Submitted On | `Submitted_On` | DateTime | Auto when status → Submitted. |
| Overdue Days | `Overdue_Days` | Formula (Integer) | `if (Status = Overdue) → daysBetween(Due_Date, TODAY) else 0`. |
| Linked Document | `Linked_Document` | URL | Optional WorkDrive link. |

### 1.14 Mailing Lists `Mailing_Lists` (M‑15)
| Label | API name | Type | Notes |
|---|---|---|---|
| List Name | `List_Name` | Text ✓ | — |
| Segment Criteria | `Segment_Criteria_JSON` | Multi‑line (10000) | JSON — see `build_mailing_list.deluge`. |
| Member Count | `Member_Count` | Integer | Auto. |
| Exclusion Count | `Exclusion_Count` | Integer | Auto. |
| Built At | `Built_At` | DateTime | Auto. |
| Status | `List_Status` | Picklist | `Draft · Built · Sent · Archived`. Default `Draft`. |
| Linked Campaign | `Campaign_Lookup` | Lookup → Campaigns | Set on Push. |

Custom buttons on detail: **Build & Preview** (calls `build_mailing_list`), **Push to Mailchimp** (calls `log_campaign_sends`).

### 1.15 Communication Logs `Communication_Logs` (M‑16)
| Label | API name | Type | Notes |
|---|---|---|---|
| Contact | `Contact_Lookup` | Lookup → Contacts ✓ | — |
| Campaign | `Campaign_Lookup` | Lookup → Campaigns | — |
| Direction | `Direction` | Picklist | `Outbound · Inbound`. Default `Outbound`. |
| Channel | `Channel` | Picklist | `Email · SMS · Letter · Call`. |
| Sent At | `Sent_At` | DateTime · Auto | — |
| Open Status | `Open_Status` | Picklist | `Not opened · Opened · Clicked · Bounced · Unsubscribed · BLOCKED (opted out)` |
| Suppression Reason | `Suppression_Reason` | Text (255) | Populated when `BLOCKED`. |

### 1.16 Consent Records `Consent_Records` (M‑17)
| Label | API name | Type | Notes |
|---|---|---|---|
| Contact | `Contact_Lookup` | Lookup → Contacts ✓ | — |
| Change Type | `Consent_Change` | Picklist ✓ | `Opted In · Opted Out · Withdrawn · Re-confirmed` |
| Source | `Consent_Source` | Picklist | `Web form · Email link · Portal preferences · Manual · Onboarding` |
| Lawful Basis | `Lawful_Basis` | Picklist | `Consent · Legitimate interest · Contract · Legal obligation` |
| Channel | `Consent_Channel` | Picklist | `Email · SMS · Postal · Phone`. Default `Email`. |
| IP / Reference | `IP_Or_Reference` | Text (60) | Masked after 90 days (nightly job — out of demo scope). |
| Recorded At | `Recorded_At` | DateTime · Auto | — |
| Notes | `Notes` | Multi‑line (500) | Optional. |

**Validation Rule (immutability):** Setup → Modules and Fields → Consent Records → **Validation Rules** → + Rule:
```
Apply on: Update
Criteria: Always
Message: "Consent Records are immutable for GDPR audit. Create a new record to reflect a consent change."
Action: Block save.
```

### 1.17 Contacts module — derived field for fast consent filtering
Add to Contacts:

| Label | API name | Type | Notes |
|---|---|---|---|
| Consent Email Status | `Consent_Email_Status` | Text (16) | Written by `mirror_consent_to_contact`. `Opted In · Opted Out · Withdrawn · None`. Default `None`. |
| Consent SMS Status | `Consent_SMS_Status` | Text (16) | Same. |

---

## 2 — Workflow rules, Layout rules, Field‑level security

### 2.1 Workflow Rules — Applications module
Setup → Automation → **Workflow Rules** → + Create Rule. Module = Applications.

**WR‑C‑1 — Auto‑task on Under Review**
- Trigger: Edit, field‑update: `Stage` changes to `Under Review`.
- Criteria: Always.
- Action: Create Task → Subject `Assign reviewers — {{Contact_Name.Last_Name}}, {{Contact_Name.First_Name}}`, Due `+3 working days`, Owner = `Application Owner`.

**WR‑C‑3 — Increment Review_Count + stamp Submitted_At**
- Trigger: Edit, on Subform change: when a row is added with `Submitted_At` empty.
- Action 1: Function → `increment_review_count` with input `applicationId = ${Deals.id}`.
- Action 2: Field Update on subform row → `Submitted_At = NOW()`.

**WR‑C‑4 — Unlock all scores when both reviewers in**
- Trigger: Edit, field‑update: `Review_Count` changes.
- Criteria: `Review_Count >= 2`.
- Action 1: Field Update → `All_Reviews_Complete = true`.
- Action 2: Function → `unlock_all_review_scores`.
- Action 3: Email Alert → template `reviews_complete_for_nc_admin` to `Application Owner`.

**WR‑C‑5 — Safeguarding flag → lock + create case**
- Trigger: Edit, field‑update: `Safeguarding_Flag_Status` changes.
- Criteria: `Safeguarding_Flag_Status NOT EQUAL None`.
- Action 1: Function → `create_safeguarding_case` with `applicationId = ${Deals.id}` and `raisedByUserId = ${Users.current}`.
- Action 2: Field Update → `Safeguarding_Flag_Raised_By = ${Users.current}`, `Safeguarding_Flag_Raised_Date = NOW()`.
- Action 3: Email Alert → template `safeguarding_flag_raised` to IO Super Admin + Data Protection Lead group.

**WR‑C‑6 — Shortlisted → applicant email**
- Trigger: Edit, field‑update: `Stage` changes to `Shortlisted`.
- Action: Email Alert → template `shortlist_congratulations` to `Contact_Name.Email`.

**WR‑D‑1 — Nominated → decrement quota + notify school**
- Trigger: field‑update: `Stage` changes to `Nominated`.
- Action 1: Function → `decrement_school_quota(schoolId = School_Nominated.id, ncId = National_Committee.id)`.
- Action 2: Email Alert → template `nomination_to_school` to `School_Nominated.Admissions_Email`.
- Action 3: Update related Nomination Pack → `Pack_Status = Sent` (via Deluge sub‑call).

**WR‑D‑2 — Placed → BC sync + emails + lock**
- Trigger: field‑update: `Stage` changes to `Placed`.
- Action 1: Function → `send_to_business_central(applicationId = ${Deals.id})`.
- Action 2..4: Email Alerts (`place_confirmed`, `place_confirmed_nc`, `place_confirmed_io`).

### 2.2 Workflow Rules — other modules

**WR‑D‑Pack — School accepts → Application Placed**
- Module: Nomination Packs.
- Trigger: field‑update: `Pack_Status` changes to `Accepted`.
- Action: Field Update on `Application_Lookup` → `Stage = Placed`.

**WR‑E‑1 — Renewal alert (60 days before expiry)**
- Module: Governance Memberships.
- Trigger: Scheduled (Daily @ 02:00 UTC).
- Function: `email_renewal_due` (queries `Term_Expires = today + 60`).

**WR‑E‑2 — Auto‑lapse on expiry**
- Module: Governance Memberships.
- Trigger: Scheduled (Daily @ 02:15 UTC).
- Function: `lapse_expired_memberships`.

**WR‑F‑1 — Auto‑mark MoU Overdue**
- Module: MoU Obligations.
- Trigger: Scheduled Daily @ 02:30.
- Function: `mark_mou_overdue` (query Status = Pending AND Due_Date < TODAY → set Overdue).

**WR‑F‑2 — Training expiry warning**
- Module: Training Records.
- Trigger: Scheduled Daily @ 03:00.
- Function: `notify_training_expiring`.

**WR‑F‑Health — Recompute NC Health nightly**
- Module: National Committees.
- Trigger: Scheduled Daily @ 03:15.
- Function: `recompute_mou_health`.

**WR‑F‑VolStat — Recompute Volunteer Training Status nightly**
- Module: NC Volunteers.
- Trigger: Scheduled Daily @ 03:30.
- Function: `recompute_volunteer_training_status`.

**WR‑G‑1 — Opt‑out write‑back**
- Module: Consent Records.
- Trigger: Create.
- Function: `mirror_consent_to_contact`.

**WR‑G‑Reset — Daily competency recompute**
- Module: Competencies.
- Trigger: Scheduled Daily @ 02:45.
- Function: `recompute_competency_gaps`.

### 2.3 Layout Rules (Setup → Modules and Fields → Applications → Layout Rules)

**LR‑Eligibility‑Reason:** When `Eligibility_Status = Failed` → SHOW `Eligibility_Failed_Reason`.
**LR‑Locked‑Safeguard:** When `Safeguarding_Flag_Status NOT EQUAL None` → ALL fields READ ONLY. Show red banner.
**LR‑Locked‑Placed:** When `Stage = Placed` → ALL fields READ ONLY.
**LR‑Show‑Decline‑Reason:** When `Stage = Declined` → SHOW + REQUIRE `Decline_Reason`.
**LR‑Show‑Withdrawal‑Reason:** When `Stage = Withdrawn` → SHOW + REQUIRE `Withdrawal_Reason`.

### 2.4 Field‑level security (blind‑review enforcement)

Setup → Modules and Fields → Applications → **Field Permissions** → Subform "Review Scores":

| Field | IO Super Admin | NC Admin | Reviewer | DPL |
|---|---|---|---|---|
| `Score_Academic` | Read+Write | Read | Read on **own row** only · Write on **own row** only | None |
| `Score_Community` | Read+Write | Read | Same | None |
| `Score_Communication` | Read+Write | Read | Same | None |
| `Score_Values` | Read+Write | Read | Same | None |
| `Overall_Recommendation` | Read+Write | Read | Same | None |
| `Reviewer_Comments` | Read+Write | Read | Same | None |

> **Caveat.** Zoho FLS doesn't natively scope by row‑value. The "own row only" behaviour is achieved by a **Client Script** on the Application detail page that wipes peer cells unless `All_Reviews_Complete = true`. Client Script lives in `zoho-build/client-scripts/blind_review.js` (see Priyanka's slot).

Field permissions for **Consent Records**:
- `Consent_Records` module: NC Admin → Read only · Reviewer → None · DPL → Read+Write.

Field permissions for **Safeguarding Cases**:
- `Triage_Notes`: NC Admin → None · DPL → Read+Write.
- `Resolution_Steps`: IO Super Admin + DPL only.

DOB masking for DPL:
- Contacts → Field Permissions → `Date_of_Birth` for DPL → "View masked" (Zoho's built‑in mask option).

### 2.5 Custom Buttons

Setup → Customisation → Buttons & Links → Buttons → + Create Button.

| Button | Module | Where | Visible When | Action |
|---|---|---|---|---|
| **Raise Safeguarding Flag** | Applications | Detail page | `Safeguarding_Flag_Status = None AND Stage IN (Under Review, Shortlisted)` | Open popup → pick `Severity` → on confirm, set `Safeguarding_Flag_Status = Under Review` (fires WR‑C‑5). |
| **Generate Nomination Pack** | Applications | Detail page | `Stage = Shortlisted AND School_Nominated NOT EMPTY` | Function `generate_nomination_pack(applicationId)`. |
| **Nominate to School** | Applications | Detail page | `Stage = Shortlisted AND exists(Nomination_Pack WHERE Status = Generated)` | Confirm modal → on yes, `Stage = Nominated`. |
| **Accept Nomination** | Nomination Packs | Detail page | `Pack_Status = Sent` | Field Update `Pack_Status = Accepted` (fires WR‑D‑Pack). |
| **Decline Nomination** | Nomination Packs | Detail page | `Pack_Status = Sent` | Field Update `Pack_Status = Declined`. |
| **Build & Preview** | Mailing Lists | Detail page | `List_Status IN (Draft, Built)` | Function `build_mailing_list(listId)`. |
| **Push to Mailchimp** | Mailing Lists | Detail page | `List_Status = Built` | Function `log_campaign_sends(listId)`. |
| **Allocate Places** | School Place Allocations | List view | Always (IO Super Admin profile only) | Popup → adjust `Places_Allocated`. |
| **Generate Consent Audit Trail** | Contacts | Detail page | Always (DPL profile only) | Function `generate_consent_audit_trail(contactId)` → CSV attached. |

---

## 3 — Sample data — bulk import via CSVs

For every CSV in `zoho-build/csv/`:

1. Open the module.
2. Click **gear in the module → Import → Import [Module Name]**.
3. Choose `... → From File`.
4. Upload the CSV.
5. **Critical:** map lookup columns by EXACT display name (NC Code → NC_Code field; School Name → School_Name lookup).
6. If Zoho complains about picklist values, click **Add to picklist** for any missing values (e.g. `Selection Coordinator` may not exist yet).
7. After import, run the verification SQL via Deluge:

```deluge
// Quick sanity check — paste into Functions and click "Save and Execute"
ncs = zoho.crm.getRecords("National_Committees");
info "Imported NCs: " + ncs.size();
contacts = zoho.crm.getRecords("Contacts");
info "Imported Contacts: " + contacts.size();
apps = zoho.crm.getRecords("Deals");
info "Imported Applications: " + apps.size();
```

Expect: NCs=5, Schools=3, Programmes=5, Contacts≈22, Applications=6, NC Volunteers=7, Training=5, MoU=8, Governance Bodies=5, Memberships=5, Competencies=11, Place Allocations=15, Consent Records=8.

---

## 4 — Email templates

In `zoho-build/email-templates/` — paste into Setup → Customisation → Templates → **Email Templates** → + New.

| Template | Subject | Recipients |
|---|---|---|
| `applicant_submission_to_nc` | `New application from {{Contact_Name.First_Name}} {{Contact_Name.Last_Name}}` | NC Admin |
| `reviews_complete_for_nc_admin` | `All reviews submitted — {{Deal_Name}}` | NC Admin |
| `safeguarding_flag_raised` | `⚠ SAFEGUARDING — flag raised on {{Contact_Name.Last_Name}}` | IO Super Admin + DPL |
| `shortlist_congratulations` | `Congratulations — UWC {{National_Committee.Country}} has shortlisted your application` | Applicant |
| `nomination_to_school` | `Nomination received — {{Contact_Name.Last_Name}} for {{Programme.Name}}` | School Admissions |
| `place_confirmed` | `Your place is confirmed — {{School_Nominated.School_Name}}` | Applicant |
| `place_confirmed_nc` | `Place confirmed — {{Contact_Name.Last_Name}} at {{School_Nominated.School_Name}}` | NC Admin |
| `place_confirmed_io` | `IO notification — {{Contact_Name.Last_Name}} placed at {{School_Nominated.School_Name}}` | IO Admissions |
| `membership_renewal_due` | `Governance term ending in 60 days — {{Member_Contact.Last_Name}}` | IO Super Admin + Body Chair |

All templates use UWC navy `#003087` header bar with the SVG logo from `wireframes/_shared/assets/uwc-brand/uwc-logo.svg`.

---

## 5 — Demo reset procedure

Before every dry‑run and 30 min before live demo:

1. Open Setup → Customisation → Functions → `demo_reset` → click **Save and Execute**.
2. Wait for "demo_reset complete: 14 modules reset" info log.
3. Open Akanksha's demo tab group:
   - Tab 1: Home / UWC Dashboard
   - Tab 2: Applications list filtered "My Review Queue"
   - Tab 3: Sofia Almeida — Application detail
   - Tab 4: Safeguarding Cases list
   - Tab 5: National Committees list
   - Tab 6: UWC Kenya record
   - Tab 7: Governance Bodies list
   - Tab 8: Competency Matrix dashboard
   - Tab 9: Mailing Lists list
   - Tab 10: Consent Records list

Use Chrome → bookmark folder "UWC Demo" → "Open all bookmarks".

---

## 6 — QA checklist (Fri 29 EOD + Sat AM + Sun AM)

Run on Fri evening, Sat morning, Sun morning, and Mon at 14:30.

### Scenario C
- [ ] Open Sofia as **Reviewer (Clara profile)** — see her own row, scores visible
- [ ] Submit Clara's row → `Submitted_At` populated, `Review_Count = 1`
- [ ] Switch profile to **Reviewer (Paulo)** — Clara's score cells blank (Client Script wipes them)
- [ ] Submit Paulo's row → `Review_Count = 2` → both rows fully visible to all roles
- [ ] Email Alert log shows `reviews_complete_for_nc_admin` sent
- [ ] Click **Raise Safeguarding Flag** on Miguel as **NC Admin** → severity High → confirm
- [ ] Banner appears red, all fields read‑only
- [ ] Safeguarding Cases module shows `SGC-2026-00001` with reporter = Ana
- [ ] Switch to **IO Super Admin** → open the case → fill Triage Notes → transition to Resolved
- [ ] On Sofia, change Stage to `Shortlisted` → email sent to `sofia.almeida@example.com`

### Scenario D
- [ ] Place Allocations list view shows pivot Schools × NCs
- [ ] Click "Allocate Places" → bump Atlantic ↔ Brazil to 5 → save
- [ ] On Sofia (Stage = Shortlisted) click "Generate Nomination Pack" → toast confirms
- [ ] Nomination Pack record created with `NC_Reference = BR-2026-00041`
- [ ] HTML/PDF file attached (open and verify UWC banner)
- [ ] Click "Nominate to School" → Stage → Nominated → quota decrements
- [ ] As Helen (profile switch or 2nd user) → see nomination pack in Sent
- [ ] Click "Accept Nomination" → Pack_Status = Accepted → Application Stage = Placed
- [ ] BC_Invoice_ID populated (`INV-2026-{number}`)

### Scenario E
- [ ] Governance Bodies list shows 5 bodies
- [ ] International Board detail: 5 memberships, 2 marked red EXPIRED (Dr Ravi Menon + Thomas Berger)
- [ ] Add new advisor via popup → saves
- [ ] Historical Memberships saved view shows the 2 lapsed
- [ ] Competency Matrix dashboard widget renders ≥ 4 red cells
- [ ] Network summary report loads

### Scenario F
- [ ] NCs list view shows colour banding (Kenya red, India amber, others green)
- [ ] UWC Kenya detail: 3 volunteers, MoU panel shows 4 items
- [ ] Daniel Kimani Training Record shows EXPIRED red
- [ ] As Grace (option B = profile switch): only Kenya data visible
- [ ] MoU panel: Annual Report Q2 2026 OVERDUE 58 days
- [ ] IO NC Health Dashboard renders network KPIs

### Scenario G
- [ ] Mailing List "Impact Report Q2 2026" → click Build & Preview → Member_Count = 4, Exclusion_Count = 1
- [ ] Click Push to Mailchimp → Campaign + Comm Log rows created
- [ ] Marcus Weber detail page: red OPTED OUT banner
- [ ] Consent Records: trying to edit triggers validation error
- [ ] DSAR custom button: CSV downloads attached to Contact

---

## 7 — Rollback plan

If a workflow loops or a custom button breaks production:

| Symptom | Rollback |
|---|---|
| Endless workflow loop | Setup → Workflow Rules → toggle "Active" off on the offending rule |
| Bad Deluge function | Setup → Functions → revert to previous version (Zoho keeps last 5) |
| CSV import dropped wrong rows | Module → Recent Items → Recycle Bin → Restore |
| Field deleted by mistake | Setup → Modules and Fields → Deleted Fields (kept 30 days) → Restore |
| Profile change locked someone out | Switch to `uwc_admin` (Administrator) → fix |

Full org rollback (nuclear): Setup → Data Administration → Backup → Restore from snapshot taken before build started. **Take a snapshot now, before §1.**

---

## 8 — Open items for Pranesh

(Mirror of `SCENARIOS_C_TO_G_ZOHO_CRM_PLAN.md §11`.) Replies needed by Thu 28 May 22:00:

1. Setup access — confirmed?
2. Approve 1–2 secondary users (Clara, Grace) for cleaner blind‑review + NC Chair demo?
3. Mailchimp — install real extension OR stub OK?
4. Demo email mailbox catch‑all — confirm `sam.prabhu+uwc-demo@a2zcloud.eu.com`?
5. Wireframes A + B stay as‑is — confirmed?
6. Business Central — stub fine?
7. Tab pre‑load — Akanksha comfortable with the bookmark folder approach?

---

*End of build handbook.*
