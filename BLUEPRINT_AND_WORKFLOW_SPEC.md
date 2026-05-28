# UWC Application Module — Blueprint + Workflow Implementation Spec

**For:** Pranesh / Sagar / Priyanka to implement in `crm.zoho.eu` org `20114943111`
**Module:** Applications (currently Potentials, renamed)
**Author:** Sam Prabhu
**Date:** 27 May 2026
**Deadline for live demo readiness:** Fri 29 May EOD (before internal review)

This is a self-contained implementation spec. Sagar/Priyanka should be able to build directly from this without referring back to the proposal. Every section is one Zoho Setup task.

---

## 0. Pre-flight before you start

1. **Login** as `uwc_admin@a2zcloud.eu.com` (or any Super Administrator profile).
2. **Setup path** for everything below: top-right **gear icon** → opens Setup Home.
3. **Module under change throughout** = `Applications` (display name) / `Potentials` (API name) / `Deals` (underlying).
4. **DC** = EU (`crm.zoho.eu`).
5. **Don't change** the field API names that ship with Potentials (Stage, Probability, Amount, Closing_Date, Account_Name, Contact_Name) — just relabel/repurpose. The wireframes use display labels; API calls (if any) use the standard names.

---

## 1. Field changes on the Applications module

Setup → Customization → Modules and Fields → **Applications** → Layouts → **Standard layout** → Edit.

### 1.1 Rename / repurpose existing Potentials fields

| Existing field (label) | Rename to | Field type | Notes |
|---|---|---|---|
| Deal Name | **Application Name** | Auto-number | Format: `APP-{YEAR}-{00001}`. Set starting at 1, auto-increment. Display in lists. |
| Amount | **Scholarship Amount (£)** | Currency | Optional per application. Keep as GBP £. Hide on layouts where scholarship isn't relevant. |
| Stage | **Application Stage** | Picklist | Used by Blueprint — full picklist in §2.1. |
| Probability (%) | **Auto-set by stage** | Decimal | System-managed by Stage picklist; do NOT show in form. |
| Closing Date | **Application Deadline** | Date | Set automatically from linked Programme.Deadline. |
| Account Name | **National Committee** | Lookup → Accounts | Each NC = an Account with `Account Type = National Committee`. See §6 if you go separate-module instead. |
| Contact Name | **Applicant Name** | Lookup → Contacts | Already in place per Contact detail audit. |
| Lead Source | **Campaign Source** | Picklist | Values: Social · NC Website · Partner School · Direct Search · Referral · Other. |
| Description | (keep) | Multi-line | — |

### 1.2 New fields to add

Setup → Modules and Fields → Applications → **+ New Field** for each:

**Identity + eligibility section**
| Label | API name | Type | Constraints |
|---|---|---|---|
| Applicant Number | Applicant_Number | Auto-number | Format `APL-{00001}`. Distinct from Application Name. |
| Application Language | Application_Language | Picklist | English · Português · Español · Français · العربية. Default = English. |
| Country of Residence | Country_of_Residence | Picklist | ISO country list. |
| Citizenship | Citizenship | Multi-select picklist | ISO country list. |
| Eligibility Status | Eligibility_Status | Picklist | Pending Check · Passed · Failed. Default = Pending Check. |
| Eligibility Failed Reason | Eligibility_Failed_Reason | Text (255) | Only shown when Eligibility_Status = Failed. |

**Lifecycle section**
| Label | API name | Type | Notes |
|---|---|---|---|
| Form Completion % | Form_Completion_Pct | Formula (integer) | See §4.1 formula |
| Submitted Date | Submitted_Date | DateTime | Auto-set by Blueprint transition (see §3.4) |
| Review Count | Review_Count | Integer | Default 0. Auto-incremented by Workflow (see §4.2) |
| All Reviews Complete | All_Reviews_Complete | Checkbox | Default false. Auto-flipped by Workflow when Review_Count = 2 |
| Panel Decision | Panel_Decision | Picklist | Shortlisted · Not Progressed. Default = blank. |
| Panel Decision Date | Panel_Decision_Date | Date | Auto-set when Panel_Decision changes from blank |
| Decline Reason | Decline_Reason | Picklist | Required gate for transitions to Declined |
| Withdrawal Reason | Withdrawal_Reason | Picklist | Required gate for transitions to Withdrawn |

**Consent + safeguarding section**
| Label | API name | Type | Notes |
|---|---|---|---|
| Parental Consent Status | Parental_Consent_Status | Picklist | Pending · Received · Waived. Default = Pending. |
| Parental Consent Date | Parental_Consent_Date | DateTime | Auto-set when Parental_Consent_Status changes to Received |
| Guardian Contact | Guardian_Contact | Lookup → Contacts | The parent/guardian person |
| Safeguarding Flag Status | Safeguarding_Flag_Status | Picklist | None · Under Review · Resolved. Default = None. |
| Safeguarding Flag Raised By | Safeguarding_Flag_Raised_By | Lookup → Users | Auto-set on flag |
| Safeguarding Flag Raised Date | Safeguarding_Flag_Raised_Date | DateTime | Auto-set on flag |

**Relationships section**
| Label | API name | Type | Notes |
|---|---|---|---|
| Programme | Programme | Lookup → Products (display name "Programmes") | The selection cycle this application is for |
| School Nominated | School_Nominated | Lookup → Accounts (record type School) OR a custom Schools module | Set when nominated |
| Preferred School | Preferred_School | Lookup → School records | Set by applicant, advisory only |
| Unlock Reason | Unlock_Reason | Text (255) | Required when NC Admin uses "Unlock Application" custom button |

**Form responses section (these would be populated by the portal via API in real life — for demo, leave blank and fill in sample data manually)**
| Label | API name | Type |
|---|---|---|
| Personal Statement | Personal_Statement | Multi-line (5000 chars) |
| Education Background | Education_Background | Multi-line (3000) |
| Extracurricular Activities | Extracurricular_Activities | Multi-line (3000) |
| Leadership Statement | Leadership_Statement | Multi-line (3000) |
| NC Local Question Answer | NC_Local_Question_Answer | Multi-line (3000) |

### 1.3 Review Scores subform (multi-line item for blind review)

Setup → Modules and Fields → Applications → **+ Subform** → name "Review Scores".

| Subform column | Type | Notes |
|---|---|---|
| Reviewer | Lookup → Users | The CRM user who scored |
| Academic Potential | Integer (1–10) | |
| Community Engagement | Integer (1–10) | |
| Communication Skills | Integer (1–10) | |
| UWC Values Commitment | Integer (1–10) | |
| Overall Recommendation | Picklist: Yes · Conditional · No | |
| Reviewer Comments | Multi-line (2000) | |
| Submitted At | DateTime | Auto-set on subform row save |
| Visible To NC Admin | Checkbox | Default false; flipped true by Workflow when All_Reviews_Complete = true |

---

## 2. Application Blueprint — full definition

Setup → Customization → Blueprints → **+ Create Blueprint**.

- **Module:** Applications
- **Layout:** Standard
- **Field:** Application Stage
- **Name:** UWC Application Lifecycle

### 2.1 Stages (10 total) with UWC colours

Configure the Application Stage picklist FIRST in Setup → Modules and Fields → Application Stage. Use these exact values + colours (Blueprint inherits colours from the picklist).

| Order | Stage value | Hex colour | Type | Probability % |
|---|---|---|---|---|
| 1 | Registered | `#9ca3af` (grey) | Open | 5 |
| 2 | In Progress | `#3b82f6` (blue) | Open | 15 |
| 3 | Submitted | `#003087` (UWC navy) | Open | 30 |
| 4 | Under Review | `#7c3aed` (purple) | Open | 45 |
| 5 | Shortlisted | `#C8AB00` (UWC gold) | Open | 60 |
| 6 | Nominated | `#10b981` (green) | Open | 80 |
| 7 | Placed | `#059669` (dark green) | Won | 100 |
| 8 | Declined | `#C8102E` (UWC red) | Lost | 0 |
| 9 | Withdrawn | `#6b7280` (mid grey) | Lost | 0 |
| 10 | Waitlisted | `#f59e0b` (amber) | Open | 25 |

### 2.2 Transitions (who can move what to what, and the gate checks)

Add each as a Blueprint Transition. Format: **From → To** · `Allowed roles` · `Before-transition conditions (mandatory)` · `During-transition fields (must enter)` · `After-transition actions`.

#### T1 — Registered → In Progress
- **Allowed roles:** Applicant (Portal user) + IO Super Admin
- **Before condition:** `Eligibility_Status = Passed`
- **During:** none
- **After:** none

#### T2 — In Progress → Submitted
- **Allowed roles:** Applicant (Portal user)
- **Before condition (all required):**
  - `Form_Completion_Pct >= 100`
  - `Parental_Consent_Status = Received` (if applicant DOB makes them under 18 — see §4.5 formula)
  - At least one Documents Details record linked
- **During (mandatory fields to confirm):** Applicant ticks "I confirm the information is accurate" checkbox
- **After:** Set `Submitted_Date = NOW()` (workflow rule, see §3.4)

#### T3 — Submitted → Under Review
- **Allowed roles:** NC Admin
- **Before condition:**
  - `Submitted_Date is within Programme.Open_Date and Programme.Deadline`
  - No open validation errors
- **During:** Choose 2 reviewers from a popup (writes to a custom field `Assigned_Reviewers` multi-user lookup)
- **After:** 8 actions — see §3.2

#### T4 — Under Review → Shortlisted
- **Allowed roles:** NC Admin
- **Before condition (all required):**
  - `All_Reviews_Complete = true`
  - `Safeguarding_Flag_Status = None OR Resolved`
  - `Panel_Decision = Shortlisted`
- **During:** Confirm panel decision rationale (textarea)
- **After:** Send "Congratulations — shortlisted" email to Applicant (see §3.5)

#### T5 — Shortlisted → Nominated
- **Allowed roles:** NC Admin
- **Before condition (all required):**
  - A Nomination Pack record exists for this Application (custom module — see §6)
  - The selected School has remaining quota for this NC (see §4.6 validation)
  - `School_Nominated` field is populated
- **During:** Confirm school + place number
- **After:** Decrement school quota by 1 (workflow); email School Admissions Director

#### T6 — Nominated → Placed
- **Allowed roles:** School Admissions Director
- **Before condition:** None (just acceptance)
- **During:** "I accept this nomination" confirmation
- **After:** Lock the Application from edits; send "Place confirmed" emails to Applicant + NC Admin + IO

#### T7 — Any open stage → Declined
- **Allowed roles:** NC Admin (their NC only) · IO Admissions (any NC)
- **Before condition:** None
- **During:** Pick `Decline_Reason` (mandatory)
- **After:** Send "Application not progressed" email (template-free, generic)

#### T8 — Any open stage → Withdrawn
- **Allowed roles:** Applicant (Portal user) · NC Admin · IO Admissions
- **Before condition:** None
- **During:** Pick `Withdrawal_Reason` (mandatory)
- **After:** Lock the record; no email if withdrawn by applicant themselves

#### T9 — Any open stage → Waitlisted
- **Allowed roles:** NC Admin · IO Admissions
- **Before condition:** None
- **During:** Optional reason field
- **After:** Notification to Applicant

#### T10 — Submitted → In Progress (Unlock for amendment)
- **Allowed roles:** NC Admin
- **Before condition:** None
- **During:** `Unlock_Reason` (mandatory text)
- **After:** Audit log entry; email to Applicant: "Your application has been reopened — please resubmit by [original deadline]"

### 2.3 Common transition settings

- **Notify on transition:** ON for all transitions involving Applicant (T1, T2, T4, T6, T8 if non-applicant)
- **Allow Edit during transition:** OFF (Blueprint controls field changes)
- **Mandatory transition order:** keep ON (prevents skipping stages)

---

## 3. Workflow Rules (8 must-have)

Setup → Automation → Workflow Rules → **+ Create Rule**.

### WR-1 — Applicant submission email to NC Admin
- **Module:** Applications
- **Trigger:** Field update — `Application Stage` changes to `Submitted`
- **Condition:** none
- **Actions:**
  1. **Email Alert:** to `National_Committee.NC_Admin_Email` — template "ApplicantSubmissionToNC" (§5.1)
  2. **Field Update:** `Submitted_Date = NOW()`

### WR-2 — Auto-task on Under Review
- **Trigger:** Field update — `Application Stage` changes to `Under Review`
- **Actions:** Create Task → `Subject: "Assign reviewers — {{Applicant_Name}}"`, due in 3 working days, assigned to NC Admin

### WR-3 — Increment Review Count on subform save
- **Trigger:** Record save where `Review Scores` subform has a new row with `Submitted_At` not null
- **Action (Function):** Custom Deluge function `incrementReviewCount(applicationId)` — see §4.2

### WR-4 — Unlock scores when all reviews in
- **Trigger:** Field update — `Review_Count` changes
- **Condition:** `Review_Count >= 2`
- **Actions:**
  1. **Field Update:** `All_Reviews_Complete = true`
  2. **Function:** `unlockAllReviewScores(applicationId)` — sets `Visible_to_NC_Admin = true` on all subform rows
  3. **Email Alert:** to NC Admin — template "ReviewsCompleteForNCAdmin"

### WR-5 — Safeguarding flag — lock + alert
- **Trigger:** Field update — `Safeguarding_Flag_Status` changes from `None` to `Under Review`
- **Actions:**
  1. **Email Alert:** to NC Admin + IO Super Admin — template "SafeguardingFlagRaised"
  2. **Field Update:** Lock all non-safeguarding fields (achieve via Layout Rules)
  3. **Function:** Log entry in custom Audit Log module

### WR-6 — Nominated → school notification
- **Trigger:** Field update — `Application Stage` changes to `Nominated`
- **Actions:**
  1. **Email Alert:** to `School_Nominated.Admissions_Director_Email` — template "NominationToSchool"
  2. **Task:** Subject "Review nomination — {{Applicant_Name}}", due 5 days, assigned to Admissions Director
  3. **Function:** `decrementSchoolQuota(schoolId, ncId)`

### WR-7 — Shortlisted → applicant email
- **Trigger:** Field update — `Application Stage` changes to `Shortlisted`
- **Actions:** Email Alert to `Applicant_Name.Email` — template "ShortlistCongratulations"

### WR-8 — Placed → multi-party confirmation
- **Trigger:** Field update — `Application Stage` changes to `Placed`
- **Actions:**
  1. Email Applicant — template "PlaceConfirmed"
  2. Email NC Admin — template "PlaceConfirmedNC"
  3. Email IO Admissions — template "PlaceConfirmedIO"
  4. **Function:** `sendToBusinessCentral(applicationId)` — for the demo this can be a stub that just logs "Sent to BC #INV-…"

---

## 4. Custom Functions (Deluge) — code Sagar/Priyanka can paste

Setup → Customization → **Functions** → + Create Function. Category = Workflow.

### 4.1 Form_Completion_Pct formula field

Setup → Modules and Fields → Applications → Form_Completion_Pct field → Formula.

```deluge
// Count required fields, count filled-in ones, return percentage
totalRequired = 12;
filled = 0;
if (!isnull(${Applications.Personal_Statement}) && len(${Applications.Personal_Statement}) > 50) filled = filled + 1;
if (!isnull(${Applications.Education_Background})) filled = filled + 1;
if (!isnull(${Applications.Extracurricular_Activities})) filled = filled + 1;
if (!isnull(${Applications.Leadership_Statement})) filled = filled + 1;
if (!isnull(${Applications.NC_Local_Question_Answer})) filled = filled + 1;
if (!isnull(${Applications.Application_Language})) filled = filled + 1;
if (!isnull(${Applications.Country_of_Residence})) filled = filled + 1;
if (!isnull(${Applications.Citizenship})) filled = filled + 1;
if (!isnull(${Applications.Applicant_Name})) filled = filled + 1;
if (!isnull(${Applications.Programme})) filled = filled + 1;
if (!isnull(${Applications.Guardian_Contact})) filled = filled + 1;
if (${Applications.Parental_Consent_Status} == "Received") filled = filled + 1;
return (filled * 100) / totalRequired;
```

### 4.2 `incrementReviewCount(applicationId)`
```deluge
appId = applicationId.toLong();
app = zoho.crm.getRecordById("Deals", appId);  // Potentials API name
currentCount = ifnull(app.get("Review_Count"), 0).toLong();
update = Map();
update.put("Review_Count", currentCount + 1);
zoho.crm.updateRecord("Deals", appId, update);
info "Review_Count incremented to " + (currentCount + 1) + " on application " + appId;
return "ok";
```

### 4.3 `unlockAllReviewScores(applicationId)`
```deluge
appId = applicationId.toLong();
// Fetch the application with related subform
app = zoho.crm.getRecordById("Deals", appId);
reviewScores = ifnull(app.get("Review_Scores"), List());
updatedRows = List();
for each row in reviewScores
{
  row.put("Visible_to_NC_Admin", true);
  updatedRows.add(row);
}
updateMap = Map();
updateMap.put("Review_Scores", updatedRows);
zoho.crm.updateRecord("Deals", appId, updateMap);
info "Unlocked " + updatedRows.size() + " review scores on application " + appId;
return "ok";
```

### 4.4 `decrementSchoolQuota(schoolId, ncId)`
```deluge
// Find the School Place Allocation record for this school + nc
allocations = zoho.crm.searchRecords("Custom_School_Place_Allocations",
  "(School_Account:equals:" + schoolId + ")and(NC_Account:equals:" + ncId + ")");
if (allocations.size() > 0)
{
  alloc = allocations.get(0);
  allocId = alloc.get("id").toLong();
  current = ifnull(alloc.get("Remaining"), 0).toLong();
  zoho.crm.updateRecord("Custom_School_Place_Allocations", allocId, {"Remaining": current - 1});
}
return "ok";
```

### 4.5 Is-minor helper (used in T2 gate check)

In the Blueprint T2 transition condition, use a Function condition:
```deluge
applicant = zoho.crm.getRecordById("Contacts", ${Applications.Applicant_Name});
dob = applicant.get("Date_of_Birth");
if (isnull(dob)) return false;  // can't determine, fail safe
age = daysBetween(dob, today) / 365;
if (age < 18) {
  // Must have parental consent
  return (${Applications.Parental_Consent_Status} == "Received");
}
return true;  // adult, no consent needed
```

### 4.6 School quota check (used in T5 gate)
```deluge
allocations = zoho.crm.searchRecords("Custom_School_Place_Allocations",
  "(School_Account:equals:" + ${Applications.School_Nominated} + ")and(NC_Account:equals:" + ${Applications.National_Committee} + ")");
if (allocations.size() == 0) return false;
remaining = ifnull(allocations.get(0).get("Remaining"), 0).toLong();
return remaining > 0;
```

---

## 5. Email templates

Setup → Customization → Templates → Email Templates → + New Template. Use UWC navy `#003087` header bar + Sofia-style copy.

### 5.1 ApplicantSubmissionToNC
- **Subject:** New application from {{Applicant_Name.First_Name}} {{Applicant_Name.Last_Name}}
- **Body:** "A new application has been submitted to {{National_Committee.Name}} on {{Submitted_Date}}. Please review and assign to your selection committee. View application: [link]"

### 5.2 ReviewsCompleteForNCAdmin
- **Subject:** All reviews submitted — {{Applicant_Name}}
- **Body:** "Both reviewers have submitted their scores for {{Applicant_Name}}. Scores are now visible for panel discussion. View: [link]"

### 5.3 SafeguardingFlagRaised
- **Subject:** ⚠ SAFEGUARDING — flag raised on {{Applicant_Name}}
- **Body:** "{{Safeguarding_Flag_Raised_By}} raised a safeguarding concern on {{Applicant_Name}}'s application at {{Safeguarding_Flag_Raised_Date}}. The application is now locked from further progression. Please contact the IO safeguarding team within 24 hours."

### 5.4 ShortlistCongratulations
- **Subject:** Congratulations — UWC {{National_Committee.Country}} has shortlisted your application
- **Body:** "Dear {{Applicant_Name.First_Name}}, we are delighted to inform you that you have been shortlisted by UWC {{National_Committee.Country}}. Further updates will follow regarding next steps. UWC International"

### 5.5 NominationToSchool
- **Subject:** Nomination received — {{Applicant_Name}} for {{Programme.Name}}
- **Body:** "A nomination has been received from {{National_Committee.Name}} for {{Applicant_Name}}. Please review the nomination pack and respond within 5 working days."

### 5.6 PlaceConfirmed (to applicant)
- **Subject:** Your place is confirmed — {{School_Nominated.Name}}
- **Body:** "Dear {{Applicant_Name.First_Name}}, your place at {{School_Nominated.Name}} has been confirmed. The school admissions team will be in touch shortly with joining instructions."

---

## 6. Module decisions still open

| Module | Current state | Recommended action |
|---|---|---|
| **National Committee** | Use Accounts (record type = NC), OR Programmes module, OR a separate custom module | **Recommendation: separate custom module "National Committees"** (cleanest semantically). Keeps Programmes as "selection cycles per NC per year" — proper 1:N relationship. Build 5 NC records per Build Plan §2.1. |
| **School** | Same options | **Recommendation: same as NC — separate custom module "Schools"**. Keep Accounts standard module for any future external orgs (donors, partners). |
| **Governance Body / Membership / Competency** | Not built | **Build as 3 custom modules** with junction (Membership joins Contact↔Body, with Role, Term Start, Term End, Status fields). |
| **NC Volunteer** | Not built | **Single custom module** joining Contact↔National Committee with Role, Tenure Start, Tenure End, Training Compliance. |
| **Training Record** | Not built | Custom module — per Contact, Training Type (picklist), Completed Date, Expiry Date (auto-calc completion + 2 years), Status (CURRENT/EXPIRING SOON/EXPIRED via daily workflow). |
| **MoU Obligation** | Not built | Custom module — per NC, Type, Due Date, Status, linked Document. |
| **School Place Allocation** | Not built | Custom module — per School per Programme, Quota, Remaining. Used by §4.4 + §4.6. |
| **Nomination Pack** | Not built | Custom module — per Application, generated PDF (use Zoho's Inventory Template or a Deluge function that builds an HTML→PDF), Status (Sent/Reviewed/Accepted/Declined). |
| **Communication Log** | Use standard Activities — Emails module | Already exists; just build a saved view for "Bulk Communications". |
| **Consent Record** | Not built | Custom module — per Contact, Channel (Email/SMS), Consent State, Lawful Basis, Timestamp, Source of Change. |

---

## 7. The minimum viable demo set (if time short)

If Sagar/Priyanka can't build everything by Fri 29 May, prioritise this minimum to make at least the live-CRM portion of the demo credible:

| Priority | Item | Effort |
|---|---|---|
| **MUST-1** | Application Blueprint with all 10 stages (no automations) | 2h |
| **MUST-2** | 6 sample Applicants as Contacts (Sofia, Amara, Lena, Kwame, Preethi, Miguel) | 30m |
| **MUST-3** | 5 NC records (whatever module choice) | 30m |
| **MUST-4** | 4–6 sample Application records linked to Applicants + NCs + Programmes, distributed across the Blueprint stages | 30m |
| **MUST-5** | At least WR-1 (submission email) + WR-4 (unlock scores) | 1h |
| **MUST-6** | Custom Home dashboard with UWC KPIs (My Open Applications by NC, by stage) | 1h |
| **Total minimum:** | | **~5.5h** |

Everything beyond MUST-1..6 lives in the wireframe.

---

## 8. After-build verification checklist (run before internal review Fri 29)

- [ ] Application Blueprint has all 10 stages with correct colours
- [ ] Creating an Application starts at "Registered" stage
- [ ] Moving stage triggers the right Workflow (test by changing manually)
- [ ] Form Completion % formula computes for at least one sample record
- [ ] Adding a Review Scores subform row increments Review_Count
- [ ] When Review_Count = 2, All_Reviews_Complete flips true and Visible_to_NC_Admin flips true on subform rows
- [ ] Safeguarding flag fires an email
- [ ] Email templates render with merge fields correctly
- [ ] Sample data uses real UWC names (Sofia, Ana, Marcus) — no Christopher Maclead / Carissa Kidman / Sage Wieser anywhere
- [ ] Home dashboard shows UWC-relevant KPIs, not the default Zoho ones

---

End of implementation spec.
