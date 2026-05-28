# Zoho UI Fidelity Rebuild — Plan (NO EXECUTION YET)

**Trigger:** Pranesh's review of Scenario A — "the UI is not at all matching the exact CRM UI in wireframe. I need to give exact user feel of using Zoho CRM inside wireframe."
**Date:** 28 May 2026
**Author:** Sam Prabhu
**Status:** Plan mode — awaiting your approval before any code change

---

## 1. The diagnosis — why the current build feels generic

I went back to the 8 reference screenshots I captured during the live Zoho audit and compared them to what was actually built. The fidelity gap is structural, not cosmetic. Three root causes:

### Root cause #1 — Every scenario uses UWC chrome as the OUTER frame

In `01_scenario_A.html` the top-level structure is:

```
<div class="shell">                          ← UWC-branded shell
  <header class="topbar">                    ← UWC navy topbar with "UWC International · DEMO"
  <aside class="sidebar">                    ← UWC numbered step nav (not Zoho's module list)
  <main class="main">
    <section class="screen">                 ← inside this, we drop a small .zoho-mode panel
      ...some inner Zoho-styled card...
```

Each Zoho-mode screen is a small inner element inside a UWC-branded shell. The panel sees:

- UWC navy header bar across the top (not Zoho's white bar)
- UWC numbered step nav on the left (not Zoho's module nav: Home / Leads / Contacts / Applications)
- UWC "Step 4 of 9" counter (not Zoho's search bar + icon cluster + A2Z org badge)

So even though the inner content has Zoho-style cards, **the chrome is screaming "this is a wireframe pretending to be a CRM"** rather than "this is Zoho CRM."

### Root cause #2 — My `zoho-tokens.css` got the topbar colour WRONG

I wrote `--zoho-topbar-bg: #1c1f25` (dark charcoal) in the design tokens. But looking at the actual Zoho EU screenshots:

| What I assumed | What Zoho actually is |
|---|---|
| Dark `#1c1f25` topbar with white text | **WHITE topbar** with grey text and the colorful gradient logo top-left |
| Heavy chrome | Very minimal, almost flat |
| Single "Zoho CRM" wordmark | Module name shown LARGE in topbar — currently active module ("Contacts", "Applications") |

I conflated Zoho's older dark-themed UI with the current Vertical UI. The live screenshots show the modern white UI.

### Root cause #3 — The sonnet sub-agents didn't have a strong enough visual anchor

When I dispatched the scenarios to sub-agents, I pointed them at the screenshots but didn't enforce pixel-matching. They had latitude to "build a Zoho-style screen" — which they did, but in their own interpretation of what that means. Result: generic CRM patterns, not unmistakable Zoho.

---

## 2. What real Zoho CRM looks like (from the live screenshots)

Documenting precisely what we need to replicate. References: `wireframes/_shared/assets/zoho-reference/01-contacts-list.png`, `03-applications-kanban.png`, `06-setup-modules.png`, `07-home-dashboard.png`, `08-contact-detail.png`.

### 2.1 The topbar (52–56px, WHITE)

Left → right:
1. **Zoho CRM logo + name**: small circular gradient mark (pink → purple → blue), then text "Zoho CRM". To the right of that, a panel toggle icon `▢`
2. **Module name LARGE in the middle-left** of the topbar (e.g. "Contacts", "Applications", "Setup Home" — depending on current module). Font size ~17px, dark grey.
3. **Sub-tabs strip** below the module name: "All Contacts ⌄", "..." menu (custom views + folders).
4. **Centre-right search bar**: rounded, light-grey `#f3f5fa` fill, "Search records" placeholder with magnifier icon. ~320px wide.
5. **Right icon cluster** (8 icons in this order):
   1. Quick-add `+` (violet outlined, prominent)
   2. Zia AI (multi-color icon — like a stylized "ZA")
   3. Bell (notifications, with red dot if any)
   4. Calendar
   5. Person (recent users? account)
   6. Settings gear
   7. **A2Z org badge** — yellow circle with "A2Z" text + small "1" red notification badge
   8. Waffle `⋮⋮⋮` 9-dot apps menu
6. Topbar has a subtle 1px bottom border, no shadow.

### 2.2 The left sidebar (225px, light grey `#f7f8fa`)

Top section (always visible):
- **Home** (with house icon) — pink/red icon (e.g. `#e91e63`)
- **Reports** — pink/red bar-chart icon
- **Analytics** — purple chart icon
- **My Requests** — green clipboard icon
Active item: blue text on light-blue pill (`#e6efff` bg, `#2563eb` text).

**Teamspace card** (white tile, separated):
- Small red square icon with "CT" white text
- "CRM Teamspace" name + chevron-down dropdown
- "..." menu top-right of card

Search box below: "Search" placeholder.

**Workqueue ✨** (standalone item with sparkles emoji).

**Sales** collapsible group (folder icon + chevron):
- Leads · Contacts · Accounts · Applications · Campaigns (each with small icon)

**Activities** group: Tasks · Meetings · Calls.

**Integrations** group (collapsed by default).

Standalone after groups:
- Programmes (icon)
- Vendors (icon)
- SalesInbox (icon)

**Add On Module** collapsible group:
- Local Questions · Academic Details · Documents Details · Questions (each with diamond-shape icon `◆`)

Footer (bottom of sidebar): three tabs — **Chats · Channels · Contacts** (extension shortcuts).

### 2.3 Main content patterns

**List view** (Contacts/Leads/Applications):
- Section header strip: tab name "All Contacts ⌄" left, "..." right
- Toolbar: Filter | Sort | view-mode icons (list, kanban, calendar, chart, time, etc. — 6+ icons) | Create Contact (blue button right) | "..." menu
- Filter Contacts by side panel: header, search box, "System Defined Filters" collapsible (Activities, Campaigns, Latest Email Status, Locked, Record Action, Related Records Action, Touched Records, Untouched Records, Cadences), "Filter By Fields" collapsible with checkboxes
- Data table: checkbox column, message-icon column, **date pill column** (orange "Today" ribbon, green date pills), name | email | phone | owner
- Status bar bottom: "Total Records 10" + pagination "1 to 10 ◂ ▸"

**Kanban view** (Applications):
- "STAGEVIEW ⌄" picker top + pencil edit icon
- Column headers: light tinted background (each stage has its own pastel color), title + count badge + percentage `· 10%` + amount `£250,000.00`
- Cards: white with subtle border, **name top** (e.g. "Benton"), **stage chip** (coloured pill), then Owner / Contact / Amount / Date stacked

**Detail view** (Contact like Kris Marrier):
- Back arrow + avatar gradient circle + name large
- "Add Tags" link
- Right side: Send Mail (blue solid) + Edit (grey outline) + ⋯ menu + Last Update timestamp
- Two-tab toggle: Overview | Timeline (segmented pill control)
- Left rail: "Related List" header, items: Notes · Attachments · Emails · Open Activities 2 · Closed Activities · Invited Meetings · Programmes · Applications 1 · Social · Parent Name · Applicant Names · Add Related List. "Links" section: Add Link.
- Main: condensed key info card (Type | Email | Phone | Mobile with green phone icon)
- "Next Action" card with date ribbons (red MAY 27, orange TODAY)
- "Hide Details" toggle
- "Student Information" section with 2-column field grid (right-aligned labels, left-aligned values)

**Setup pages**:
- Sidebar replaced with Setup nav: "Setup Home" with back arrow + filter icon
- Hierarchical setup nav: Set up your CRM (orange arrow) · Login History · Audit Log · Channels (Email, Telephony, Business Messaging, Notification SMS, Webforms, Chat, Portals) · Customization (**Modules and Fields** active highlighted blue, Pipelines, Wizards, Kiosk Studio, Canvas ✨, Customize Home page, Translations, Templates, Teamspace ✨) · Automation (Workflow Rules, Actions)
- Main tabs: Modules | Web Tabs | Global Sets | Application Management
- Toolbar: Search + Custom Module / Team Module filter chips + "Create Module Using Zia" link + "Create New Module" blue button
- Table: Displayed In Tabs As | Module Name | Teamspace | Last Modified | Status — each row has icon + name + "1 Teamspaces" blue link + A2Z badge with timestamp + toggle switch (green for enabled custom modules)

### 2.4 The role-switcher problem

Right now my role-switcher lives in the UWC topbar (which won't exist in the rebuilt Zoho-mode screens). I need to relocate it.

Three options:
- **A. Floating control** top-right: a small "View as: [Marcus ▾]" pill that sits above the Zoho topbar in its own demo overlay strip.
- **B. Inside the A2Z org badge**: replace the A2Z badge's tooltip with the role-switcher (mildly clever, but harder to discover).
- **C. Demo bar above Zoho topbar**: a thin red horizontal strip "DEMO MODE · Scenario A · View as: [Marcus ▾] · Step 4 of 9" — visually clearly separate from Zoho's own chrome.

My recommendation: **C** — a thin demo-mode strip above the Zoho topbar. Makes it obvious that this is the demo controls and Zoho is what we're navigating. Easy for Akanksha to find. Doesn't pollute the Zoho UI itself.

---

## 3. Proposed rebuild — the plan

### 3.1 Architectural change

```
BEFORE (current):
┌─────────────────────────────────────────┐
│  UWC navy topbar [DEMO badge ...]       │ ← UWC chrome wrapping everything
├──────────┬──────────────────────────────┤
│ UWC step │  Step content (some Zoho     │
│  nav     │  styled cards)               │
└──────────┴──────────────────────────────┘

AFTER (target):
┌─────────────────────────────────────────┐
│ ▸ DEMO MODE · Scenario A · View as: [Marcus▾] · Step 4/9 [◂] [▸] │ ← thin red strip
├─────────────────────────────────────────┤
│  [Zoho logo] [Module: Contacts]  [search]  [+][Zia][🔔][📅]...  │ ← Zoho topbar (WHITE)
├────────┬────────────────────────────────┤
│ Home   │  All Contacts ⌄                │
│ Reports│  [Filter][Sort][▦][📅]... [Create Contact] │
│ ...    │  ┌────────────────────────────┐│
│ Sales  │  │ Filter   │ table           ││ ← Zoho left sidebar + main
│  Leads │  │ sidebar  │                 ││
│  Contacts (active)                     ││
│  ...   │  └────────────────────────────┘│
└────────┴────────────────────────────────┘

For UWC portal-mode screens (Sofia signup, school portal):
┌─────────────────────────────────────────┐
│ ▸ DEMO MODE · Scenario B · View as: [Sofia▾] · Step 3/10 [◂] [▸] │
├─────────────────────────────────────────┤
│  [UWC logo] Apply to UWC International — 2026 Cycle [EN][PT][ES] │ ← UWC portal topbar
├─────────────────────────────────────────┤
│  ...UWC-branded portal content...                                │
└─────────────────────────────────────────┘
```

The key insight: the **chrome must MATCH the system being demoed**. If we're inside Zoho CRM, the chrome IS Zoho. If we're inside the UWC portal, the chrome IS UWC. The demo controls live in a thin overlay strip above either.

### 3.2 What changes in each file

| File | Change scope |
|---|---|
| `_shared/zoho-tokens.css` | **Complete rewrite.** Replace dark topbar with white. Add the colorful gradient logo SVG. Add A2Z org badge. Add 8-icon cluster. Rewrite sidebar with CRM Teamspace card, Sales/Activities/Add-On groups with real module list. Rewrite list view, kanban, detail view, setup pages to match the screenshots pixel-for-pixel. |
| `_shared/components.css` | **Reduced scope.** Keep UWC tokens for the UWC portal screens (Sofia signup, school portal, marketing dashboard). Remove the dual-chrome sidebar/topbar pattern; it'll be replaced by the dedicated Zoho-shell or UWC-portal-shell macros. |
| `_shared/role-switcher.js` | **Restructure.** Mount the role-switcher into the new `#demo-mode-bar` strip instead of the topbar. Same engine, different mount point. |
| `_shared/sample-data.js` | **No change.** Sample data is fine. |
| Every scenario HTML file | **Rebuilt.** Each step uses either the **Zoho-shell macro** OR the **UWC-portal-shell macro** depending on what surface that step is showing. The demo-mode strip + role switcher + step counter sits above everything. |

### 3.3 Files we already have that DON'T need rebuilding

| File | Why it's fine |
|---|---|
| `00_index.html` | UWC-branded picker — that's exactly what it should be. Keep. |
| `99_data_model.html` | Architecture diagrams — fine as UWC-branded. Keep. |
| `PRESENTER_CHEAT_SHEET.html` | A2Z presenter reference doc, not a demo screen. Keep. |
| `_shared/sample-data.js` | Data is sound. Keep. |
| `_shared/assets/*` | UWC + Zoho screenshots. Keep. |

### 3.4 What the new Zoho-shell macro looks like (component sketch)

I'll write a single reusable HTML pattern in components.css that any scenario can drop into a step:

```html
<div class="zoho-shell">
  <header class="zoho-topbar">
    <div class="zoho-topbar__brand">
      <div class="zoho-topbar__logo"></div>  <!-- colorful gradient circle -->
      <span class="zoho-topbar__name">Zoho CRM</span>
      <button class="zoho-topbar__panel-toggle">▢</button>
    </div>
    <h1 class="zoho-topbar__module">Contacts</h1>
    <div class="zoho-topbar__search">
      <span class="zoho-topbar__search-icon">🔍</span>
      <input placeholder="Search records">
    </div>
    <div class="zoho-topbar__icons">
      <button>+</button> <button>Zia</button> <button>🔔</button>
      <button>📅</button> <button>👤</button> <button>⚙</button>
      <span class="zoho-topbar__org">A2Z</span>
      <button>⋮⋮⋮</button>
    </div>
  </header>
  <div class="zoho-body">
    <aside class="zoho-sidebar">
      <!-- Real Zoho sidebar with Home/Reports/Analytics + Teamspace card + Sales group + ... -->
    </aside>
    <main class="zoho-content">
      <!-- step-specific content: list view OR kanban OR detail OR setup -->
    </main>
  </div>
</div>
```

For UWC portal-mode steps (Sofia signup, parent consent, school portal):

```html
<div class="uwc-portal-shell">
  <header class="uwc-portal-topbar">
    <div class="uwc-portal-brand">
      <img src="_shared/assets/uwc-brand/uwc-logo.svg" alt="UWC">
      <span>Apply to UWC International — 2026 Application Cycle</span>
    </div>
    <div class="uwc-portal-lang">
      <button>EN</button> <button class="active">PT</button> <button>ES</button>
    </div>
  </header>
  <main class="uwc-portal-body">
    <!-- portal content -->
  </main>
</div>
```

Then a thin demo-mode strip wraps everything:

```html
<div class="demo-mode-bar">
  <span class="demo-mode-bar__brand">▸ DEMO MODE</span>
  <span class="demo-mode-bar__scenario">Scenario A · NC Administration</span>
  <div id="role-switcher"></div>
  <span class="demo-mode-bar__step">Step 4 of 9</span>
  <button class="demo-mode-bar__prev">◂</button>
  <button class="demo-mode-bar__next">▸</button>
</div>
```

### 3.5 Per-step content authoring

For each step in each scenario, I need to write the ACTUAL Zoho-replica markup for that surface. Examples for Scenario A:

- **Step 1 (Marcus's home)** — Replicate the Home dashboard screenshot exactly. KPI cards (My Open Applications: 14, My Untouched: 3, My Calls Today, My Leads), My Open Tasks table, My Meetings table, Today's Leads table, My Applications Closing This Month table. Welcome banner top. UWC banner image.
- **Step 2 (Programme record)** — Replicate the Contact detail screenshot pattern but for the Programme module. Left rail with related lists. Main with field sections. Edit inline pattern.
- **Step 3 (NC dashboard / Kanban)** — Replicate the Applications Kanban screenshot exactly. STAGEVIEW picker, 10 columns one per Blueprint stage, cards with name + stage chip + owner + applicant + amount + date.
- **Step 4 (User & role management)** — Replicate the Setup page screenshot. Setup sidebar with Users & Control highlighted, main table with users.
- **Step 5 (Permission matrix)** — Setup → Customization → Profile / Modules and Fields style. Field-level toggles.
- **Step 6 (Edit applicant on behalf)** — Contact detail with override panel.
- **Step 7 (Unlock submitted)** — Modal overlay with form.
- **Step 8 (Role comparison)** — Two Zoho-shell snapshots side by side (split-screen) for the field-mask demo.
- **Step 9 (Field reference appendix)** — Can stay as a UWC-branded table — it's documentation, not a Zoho replica.

### 3.6 Effort estimate (honest)

This is a real rebuild, not a touchup.

| Item | Effort |
|---|---|
| Rewrite `_shared/zoho-tokens.css` to pixel-match (topbar + sidebar + list + kanban + detail + setup patterns) | **3h** by opus |
| Rewrite `_shared/components.css` to add UWC-portal-shell macro | **1h** by opus |
| Rewrite `_shared/role-switcher.js` mount point | **30min** by opus |
| Rebuild `01_scenario_A.html` (most complex — covers 4 different Zoho surfaces) | **2h** by opus |
| Rebuild scenarios B, C, D, E, F, G — parallel sonnet agents with much tighter visual spec referencing the actual screenshots | **3h** wall-clock (6 agents in 2 parallel waves) |
| Opus QA pass — compare each scenario to the screenshots | **1h** |
| Push to GitHub | **5min** |
| **Total** | **~10 hours wall-clock** |

That puts completion at **late Thu 28 or early Fri 29** — still in time for the Fri internal review.

### 3.7 The risks I want you to know

1. **Pixel-faithful Zoho replication takes time.** I will not get every icon exactly right (Zia's logo, for example, is a custom Zoho thing I can only approximate). Akanksha should be ready to say "this is a wireframe approximation" if anyone fixates on a specific icon.
2. **The role-switcher in a demo strip is visually less elegant than putting it in a topbar.** I think it's the right call (clear separation between demo controls and Zoho UI), but tell me if you'd prefer one of the other options.
3. **More agents hitting the 32K output token limit.** The Zoho-replica files will be heavier than the current generic ones. I'll spec tighter per-step content and use Edit operations rather than single Write to avoid the cap.
4. **The git history will get messy** — there'll be one big "rebuild for Zoho fidelity" commit replacing 7 of the 9 files. I'll write a clear commit message.

### 3.8 What I am NOT changing

- The CRM architecture documents (BLUEPRINT, DELTA, BUILD_DECISIONS) — those stand.
- The data model file (99_data_model.html) — already UWC-branded, that's correct.
- The landing page (00_index.html) — already UWC-branded, correct.
- The presenter cheat-sheet — A2Z's reference doc, A2Z-branded, correct.
- The sample data — Sofia / Marcus / Ana / etc. all stay.
- The scenario step plans — content per step is unchanged, just visual fidelity changes.
- The role-switcher logic — same engine, different mount point.

---

## 4. Three questions for you before I execute

| # | Question | My recommendation |
|---|---|---|
| Q1 | Confirm the architectural change: Zoho-mode steps get full Zoho-replica chrome (white topbar, real sidebar, etc) — UWC chrome reserved for actual UWC portal screens. Demo controls move to a thin overlay strip above. | Yes — this is the only way to give "the exact user feel of using Zoho CRM" |
| Q2 | Role-switcher placement: thin red demo strip above Zoho topbar (option C from §2.4)? Or one of the other two options? | C — clearest separation of demo controls vs system being demoed |
| Q3 | Time budget: I estimate ~10h wall-clock, completing late Thu 28 or early Fri 29. Is that acceptable given Fri 29 internal review with Paul + Dash? | Yes — but if you'd rather have a faster, less perfect first pass to review tomorrow, I can do ~5h of "Scenario A only, perfect" and we use it as the pattern for the rest. |

---

## 5. What I need from you

Reply with one of:

- **`GO`** → I rebuild on the spec above. ~10h wall-clock, all 7 scenarios.
- **`GO scenario A first`** → I rebuild only Scenario A to perfection (~5h), you review it Thu morning, then I do the rest in the same pattern.
- **`WAIT: <changes>`** → redline the plan and I'll re-issue.
- **`Different approach`** → tell me what you'd rather see.

I will not touch any file until I have your reply.
