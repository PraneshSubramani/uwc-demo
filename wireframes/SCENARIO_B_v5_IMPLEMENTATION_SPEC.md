# Scenario B v5 — Implementation Spec

**Status**: Plan approved by Pranesh (2026-05-28). All three eligibility branches included. Single agent (opus) executes — no parallel sonnet sub-agents (per process rule `api_c40ae57c3b2bcd2c`).
**Target file**: `/Users/raviagentstudio/workspace/uwc-demo-project/uwc-demo/wireframes/02_scenario_B.html`
**Backup**: copy current to `02_scenario_B.html.bak` first.
**Pattern reference**: Scenario A v5.2 at commit `b3d0451`.

## Architecture: dual chrome, one role-switcher

```
<body data-current-role="visitor">
  <div class="demo-bar">[← All scenarios] [DEMO MODE] [Scenario B] [role-switcher] [Reset]</div>

  <!-- PORTAL WRAP — for visitor / sofia / maria -->
  <div class="uwc-portal-wrap" data-role-show="visitor,sofia,maria">
     <!-- UWC navy chrome, public-portal look -->
     <header class="portal-nav">…UWC logo + nav…</header>
     <main>
       <section data-view="portal-home"        class="view">…</section>
       <section data-view="eligibility-wizard" class="view" hidden>…</section>
       <section data-view="eligibility-pass"   class="view" hidden>…</section>
       <section data-view="eligibility-guardian-required" class="view" hidden>…</section>
       <section data-view="eligibility-ineligible" class="view" hidden>…</section>
       <section data-view="register"           class="view" hidden>…</section>
       <section data-view="sofia-dashboard"    class="view" hidden>…</section>
       <section data-view="application-form"   class="view" hidden>…</section>
       <section data-view="application-saved"  class="view" hidden>…</section>
       <section data-view="application-submitted" class="view" hidden>…</section>
       <section data-view="guardian-consent"   class="view" hidden>…</section>
     </main>
  </div>

  <!-- ZOHO CRM WRAP — for ana / io-mkt / akanksha -->
  <div class="zoho-wrap" data-role-show="ana,io-mkt,akanksha" hidden>
     <header class="zoho-tb">…Zoho topbar (lifted from A v5.2 lines ~830–870)…</header>
     <div class="zoho-layout">
       <aside class="zoho-sidebar">
         <ul class="zoho-nav">
           <li class="zoho-nav__item" onclick="showView('home')">Home</li>
           <li class="zoho-nav__item" onclick="showView('contacts-list')">Contacts</li>
           <li class="zoho-nav__item" onclick="showView('applications-list')">Applications</li>
           <li class="zoho-nav__item" onclick="showView('applications-kanban')">Pipeline</li>
           <li class="zoho-nav__item" data-role-show="io-mkt,akanksha" onclick="showView('analytics-source')">Analytics</li>
         </ul>
       </aside>
       <main class="zoho-content">
         <section data-view="home"               class="view">…KPIs role-filtered…</section>
         <section data-view="contacts-list"      class="view" hidden>…Sofia auto-linked…</section>
         <section data-view="contact-detail"     class="view" hidden>…Sofia card…</section>
         <section data-view="applications-list"  class="view" hidden>…role-filtered table…</section>
         <section data-view="applications-kanban" class="view" hidden>…10-stage pipeline, Sofia in Eligibility Review…</section>
         <section data-view="application-detail" class="view" hidden>…Overview / Timeline / Documents / Source attribution…</section>
         <section data-view="analytics-source"   class="view" hidden>…funnel chart, IO-Marketing default landing…</section>
       </main>
     </div>
  </div>
</body>
```

## showView() router — exact behaviour

```js
function showView(viewId) {
  // Find target view in whichever wrap is currently visible
  var visible = document.querySelectorAll('.uwc-portal-wrap:not([hidden]) .view, .zoho-wrap:not([hidden]) .view');
  var target = document.querySelector('[data-view="' + viewId + '"]');
  if (!target) { console.warn('view not found:', viewId); return; }
  // Hide all views in BOTH wraps (defensive)
  Array.prototype.forEach.call(document.querySelectorAll('.view'), function (v) { v.hidden = true; });
  target.hidden = false;
  // Update sidebar active class if in CRM wrap
  Array.prototype.forEach.call(document.querySelectorAll('.zoho-nav__item'), function (li) {
    var match = (li.getAttribute('onclick') || '').indexOf("'" + viewId + "'") > -1;
    li.classList.toggle('active', match);
  });
  // Persist last view per role (so role-switch returns to natural landing)
  document.body.dataset.lastView = viewId;
  window.scrollTo(0, 0);
}
```

## Role-switcher default-landing-per-role

When role changes, route to the natural landing view for that role:

```js
var ROLE_LANDING = {
  'visitor':  'portal-home',
  'sofia':    'sofia-dashboard',
  'maria':    'guardian-consent',
  'ana':      'applications-kanban',
  'io-mkt':   'analytics-source',
  'akanksha': 'home'
};
// Hook into RoleSwitcher.setRole AFTER its default work:
// (extend the existing setRole or add a post-hook)
window.addEventListener('roleChanged', function (e) {
  var role = e.detail.role;
  showView(ROLE_LANDING[role] || 'portal-home');
});
```

(Existing `setRole()` in `_shared/role-switcher.js` must be patched to `window.dispatchEvent(new CustomEvent('roleChanged', {detail:{role:id}}))` at end.)

## Role list (the 6 roles in B's switcher)

| id | name | initial | role label | scope |
|---|---|---|---|---|
| visitor | Public visitor | 👤 | Prospective applicant | Public portal pages only |
| sofia | Sofia Almeida | SA | Applicant (Portal) | Her own application only |
| maria | Maria Almeida | MA | Guardian / Parent | Sofia's consent form only |
| ana | Ana Carvalho | AC | NC Admin — Brazil | UWC Brazil NC only |
| io-mkt | IO Marketing Staff | IM | Marketing & Comms | Source attribution · global read |
| akanksha | Akanksha Anand | AA | IO Super Admin | Global · Full visibility |

(Already in `_shared/sample-data.js` lines 871–876 — no changes needed.)

## Eligibility wizard — 3 branches

Input form: `Year of birth` (number 1990–2015), `Nationality` (select 21 countries), `Country of residency` (same select).

Branch logic:
```js
function evaluateEligibility(yob, nationality, residency) {
  var age = 2026 - yob;  // application year is 2026/27 entry
  if (age < 14 || age > 19) return 'ineligible';
  if (age < 16)             return 'guardian-required';
  return 'pass';
}
```

Branch outcomes:
- **pass** → "Great news — you're eligible. Continue to register." → CTA → `register` view
- **guardian-required** → "You're under 16. A parent or guardian must complete part of the form with you." → CTA "Continue with guardian email" → `register` view (with guardian email field flagged)
- **ineligible** → "Thank you for your interest. UWC programmes accept applicants aged 14–19 at time of application. We hope you'll explore our [alumni programmes link]." → no CTA forward

Demo path: Sofia enters 2009/Brazil/Brazil → pass. Then re-run with 2011 → guardian-required. Re-run with 2002 → ineligible.

## Application form — 6 sections

Single page, expand/collapse sections (`<details>` or accordion):

1. **Personal**: Full name, preferred name, DOB, gender, nationality, passport, address.
2. **Academic**: Current school, year/grade, predicted/actual grades, language(s) of instruction.
3. **Documents** (upload stubs — no real upload): Passport scan, school transcript, recommendation letter.
4. **Local Questions** (NC-defined): For Brazil — 2 essay questions ("Why UWC?" 500 words, "Community contribution" 300 words).
5. **Parent/Guardian**: Name, relationship, contact email, phone. (Pre-filled `Maria Almeida` if guardian-required path.)
6. **Declaration**: Truth statement, GDPR consent, signature (typed name).

Save button → toast "Saved — resume any time from your email link" → showView('application-saved') → after 2s auto-return to sofia-dashboard.
Submit button → showView('application-submitted') → after 1s redirect to sofia-dashboard with "Submitted" badge.

## Guardian consent view (Maria)

Same form rendered read-only. Shows:
- Sofia's data populated (read-only fields).
- Section 5 (Parent/Guardian) editable for Maria's details.
- Bottom: "Consent block" — checkbox + signature field + Submit Consent button.
- After submit → toast "Consent submitted. Thank you."

## CRM side — key views

### applications-kanban (Ana's default landing)
10 stages from BUILD_PLAN_v4.1: Submitted · Eligibility Review · Local Selection · Interview · National Selection · Pending Place · Place Offered · Place Accepted · Confirmed · Withdrawn.
14 sample apps (locked in sample-data.js). Sofia in *Eligibility Review*, highlighted.
Role-filter (per A v5.2 commit `b3d0451`):
- Ana: only Brazil-tagged apps (5–6 cards visible)
- IO-Mkt: all global apps (read-only)
- Akanksha: all global apps + admin actions

### application-detail (Sofia's record)
Tabs: Overview · Timeline · Documents · Audit · Source Attribution
- Overview: Personal/Academic/Doc summary, eligibility status, NC tag.
- Timeline: history entries with pencil icon — "Application submitted via portal by Sofia Almeida · 27 May 2026" / "Eligibility flag PASS · auto · 27 May 2026" / "Assigned to Brazil NC · auto · 27 May 2026".
- Source Attribution: "Source: Portal · Organic · Direct" + "UTM: none" + first-touch / last-touch dates.

### analytics-source (IO Marketing default)
4-step funnel: Visitors (1,247 last 30d) → Started application (312) → Submitted (156) → In review (89).
By NC table: rows for Brazil/Germany/Kenya/India/UK with counts each stage.
"Last 24h" highlight card: "Sofia Almeida — Brazil — Submitted 2 minutes ago" (pulses).

## Lint + QA gates (all must pass before commit)

1. **Tbody/ul/ol lint** (the `api_dad66f29c2257f26` bug class):
   ```sh
   grep -nE 'data-role-variant' 02_scenario_B.html | grep -v ':variant"' | grep -E '<(tbody|ul|ol)'
   # Must return 0 lines
   ```
2. **showView coverage**: every `data-view=` ID must have at least one `onclick="showView('<id>')"` reference (or be the default-landing for a role).
3. **Single-file integrity**: `wc -c 02_scenario_B.html` ≤ 200KB. No external assets except inline-base64 logos already in `_shared/assets/uwc-brand/`.
4. **Role-show consistency**: every `[data-role-show]` value must reference at least one role id in the 6-role list.
5. **Playwright QA** (per `api_7470ff6e48506f19`):
   ```sh
   cd wireframes && python3 -m http.server 8765 &
   # then navigate to http://localhost:8765/02_scenario_B.html
   ```
   Screenshot each role × 2 key views = 12 screenshots. Write to session sandbox, then `cp` to `_shared/assets/qa/scB-v5/`.

## Commit message (when QA passes)

```
Scenario B v5 — product-mode parity with A (portal + CRM dual chrome)

- Replace STEP 1-9 wizard with showView() router (~14 views).
- Dual top-level wrap: .uwc-portal-wrap (visitor/sofia/maria) and
  .zoho-wrap (ana/io-mkt/akanksha) toggled by role-switcher.
- Eligibility wizard with 3 branches: pass / guardian-required /
  ineligible. Sofia primary path is pass; other 2 reachable for Q&A.
- 6-section application form with Save & Resume.
- Maria guardian-consent read-only view.
- Ana sees Brazil-filtered Applications Kanban; Sofia in
  Eligibility Review. Application detail has Overview/Timeline/Audit/
  Source Attribution tabs.
- IO Marketing analytics: 4-step funnel + per-NC table.
- Tbody-clobber lint passes (data-role-variant only on leaf nodes).
- Single file, ~130KB, self-contained, double-click to open.

Refs: api_4ace68f8dc6845b4 (product-mode pattern), api_dad66f29c2257f26
(lint rule), api_c40ae57c3b2bcd2c (one-scenario-at-a-time).
```

After commit: STOP. Tell Pranesh: "Scenario B v5 ready at file path X. Open it, switch through all 6 roles, walk the 10-minute path. Approve → I'll do C with the same chassis."

## Build sequence inside the file (recommended order — minimises mid-build context death)

1. `cp 02_scenario_B.html 02_scenario_B.html.bak`
2. Open file, locate the `<body>` opener at line ~268. Wrap entire current body content in a top-level `<div class="uwc-portal-wrap">` and a sibling empty `<div class="zoho-wrap" hidden>`. Add `data-role-show` to both. (~15 min)
3. Strip the linear STEP 1-9 structure: each `<!-- STEP N -->` block becomes `<section data-view="…" hidden>`. Keep all existing HTML inside the sections. (~30 min)
4. Add the showView() router + roleChanged event hook to the inline `<script>` block at line ~915. (~15 min)
5. Build the missing views (portal side: eligibility-wizard with 3 branches, sofia-dashboard, application-form 6 sections, application-saved, application-submitted, guardian-consent). (~60 min)
6. Build the missing CRM views (applications-kanban with role-filter, application-detail with 5 tabs, analytics-source funnel). (~60 min)
7. Wire all `onclick="showView('…')"` references in sidebar + portal CTAs. (~15 min)
8. Run lint, fix any tbody/ul violations. (~10 min)
9. Run python3 -m http.server, screenshot each role × landing view. (~15 min)
10. Commit. (~5 min)

Total estimate: ~4 hours focused. **Do NOT start past ~50% context in a fresh session.**

## Recovery if mid-build context dies

The .bak file is the rollback. `git reset --hard b3d0451` is the broader rollback (Scenario A v5.2 commit, untouched by B work).

Resume from the consciousness milestone (stored at `api_<hash>_scenario_B_v5_milestone`).
