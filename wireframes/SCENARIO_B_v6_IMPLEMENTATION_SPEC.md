# Scenario B v6 — REVISED Implementation Spec (supersedes v5)

**Status**: Plan approved by Pranesh (2026-05-28, second-pass feedback). User confirmed all three recommendations:
- Font fallback: Cormorant Garamond + Inter (if uwc.org uses a proprietary font we can't replicate)
- Landing CTA: Apply Now → eligibility wizard directly (single click)
- Validation: Visible but not blocking (inline errors on blur, Next shows tooltip)

**Supersedes**: `SCENARIO_B_v5_IMPLEMENTATION_SPEC.md` (kept for diff-tracking). v6 adds the full landing page rebuild, English-only translation, font verification, dual-navigation pattern, and form-validation behaviour.

**Target file**: `/Users/raviagentstudio/workspace/uwc-demo-project/uwc-demo/wireframes/02_scenario_B.html`
**Backup**: copy current to `02_scenario_B.html.bak` first.
**Pattern reference**: Scenario A v5.2 at commit `b3d0451` (free-nav chassis).
**Project**: A2Z Cloud UWC International tender ref 5128. Demo Mon 1 June 2026 15:00 BST.
**Locked process rule**: One scenario at a time. After B v6 ships, STOP for Pranesh review before touching C-G.

---

## What Pranesh wants (decoded from second-pass feedback)

1. **All UI strings in English.** Current B has heavy Portuguese throughout (Brasil, mai 2026, Qualificado, Comitê Nacional, E-mail verificado, Consentimento, Candidatura, Escola Parceira, Redes Sociais, País). Brazil flag emoji stays, all text translates.
2. **Proper full-viewport landing page.** Current portal landing fills "only 1/4 of the screen". Build a complete uwc.org-style landing: sticky nav, full-bleed hero, stats strip, value props, schools row, how-to-apply, footer. Target page height ~3,200px scrollable.
3. **Free flow navigation** like Scenario A v5.2 (no STEP 1/2/3 wizard) — `showView()` router, free sidebar nav.
4. **BUT add Next/Back buttons within multi-step flows** (eligibility wizard 3-step, application form 6-section) so user can advance without targeting specific UI. Both modes coexist.
5. **Match uwc.org actual fonts** — current Playfair Display + DM Sans choice doesn't match per user. Task 7 verifies via Claude-in-Chrome BEFORE coding.
6. **Enterprise-grade UI/UX** — 20yr quality. Spacing, micro-interactions, hover states, focus rings, ARIA, smooth transitions.
7. **Form validation** — per-field, inline errors, success states, application ID generation on submit.

---

## TASK 7 (FIRST): Verify uwc.org actual fonts

Before any HTML/CSS is written, run this in Claude-in-Chrome:

```js
// In claude-in-chrome, navigate to https://www.uwc.org/ then run:
({
  headingFont: getComputedStyle(document.querySelector('h1, h2')).fontFamily,
  bodyFont:    getComputedStyle(document.body).fontFamily,
  navFont:     getComputedStyle(document.querySelector('header a, nav a')).fontFamily,
  primaryNavy: (function() {
    var el = document.querySelector('header, .site-header');
    return el ? getComputedStyle(el).backgroundColor : 'n/a';
  })(),
  fontWeightHeading: getComputedStyle(document.querySelector('h1, h2')).fontWeight,
  fontWeightBody: getComputedStyle(document.body).fontWeight,
  fontSizeBody: getComputedStyle(document.body).fontSize,
})
```

### Decision tree based on result

| Computed `headingFont` shows... | Action |
|---|---|
| `"Playfair Display"` or similar Google Font | Keep current spec — but improve weights/sizes per uwc.org's actual scale |
| Adobe Fonts (`use.typekit.net` linked) e.g. `larken`, `founders-grotesk`, `freight-text` | Fall back to **Cormorant Garamond + Inter** (user-approved fallback) |
| System stack only `-apple-system, BlinkMacSystemFont` | Fall back to **Cormorant Garamond + Inter** (user-approved fallback) |
| Some other Google Font we can use | Switch the spec to that exact font |

Whichever wins, capture the result in this file under "Locked fonts" section before proceeding to landing page build.

### Likely outcome (educated guess pending verification)

Recent uwc.org redesigns often use Adobe Fonts proprietary stack. **High probability we land on Cormorant Garamond + Inter as the fallback.** Pre-write the spec assuming this; swap if Task 7 finds otherwise.

---

## TASK 8: English translation table

Every Portuguese string in current `02_scenario_B.html` must be translated. Use this table:

| Portuguese (current) | English (target) |
|---|---|
| País | Country |
| Brasil | Brazil |
| mai 2026 | May 2026 |
| Candidatura | Application |
| Comitê Nacional do Brasil | Brazil National Committee |
| E-mail verificado | Email verified |
| Qualificado | Qualified |
| Novo | New |
| Converter | Convert |
| Redes Sociais | Social Media |
| Escola Parceira | Partner School |
| NC Website | NC Website (already English) |
| Consentimento de Contacto para Referências | Contact Consent for References |
| Autorizo que o Comitê Nacional... | I authorise the Brazil National Committee to contact the teachers and counsellors nominated by Sofia. |
| Converter Lead em Contact cria... | Converting a Lead to Contact automatically creates a linked record tagged to Brazil National Committee. The portal has already verified the email — conversion happens via Zoho webhook at registration. |
| In Progress (already English) | — |

Plus all sample applicant cards: keep names (Sofia Almeida, Lucas Ferreira, Isabela Costa, Pedro Nunes, Mariana Souza, Ana Lúcia Ramos) but English everything around them.

---

## TASK 9: Full-viewport landing page

### Layout (top to bottom)

```
┌─ NAV (sticky, 72px tall, white bg, subtle bottom border) ─────────┐
│  [logo SVG 32px]  About · Schools · Programmes · National Comm.   │
│  Stories · Apply                                Sign in  Apply →  │
├───────────────────────────────────────────────────────────────────┤
│                                                                    │
│  HERO (70vh / min 600px, full-bleed)                              │
│  Background: hero-students-flags.jpeg (cover, centre)             │
│  Overlay: linear-gradient(rgba(0,26,77,0.55), rgba(0,48,135,0.45))│
│                                                                    │
│  CONTENT (max-w 800px, centred):                                  │
│    Eyebrow text: "Applications open for September 2026 entry"     │
│      (small caps, gold #C8AB00, letter-spacing 2px)               │
│    Display headline: "Education for a peaceful and                 │
│      sustainable future"                                          │
│      (display serif, ~64px on desktop, white)                     │
│    Sub: "Join 11,000+ students from 130+ countries at one of      │
│      18 UWC schools and colleges around the world."               │
│    Dual CTA:                                                       │
│      [Apply Now →]  (filled, red C8102E, large)                   │
│      [Sign in to continue]  (ghost, white border)                 │
│                                                                    │
├─ STATS STRIP (white card, overlaps hero by 40px, shadow) ────────┤
│  4 stats centred: 60+ years · 18 schools · 130+ NCs · 11K alumni │
├───────────────────────────────────────────────────────────────────┤
│  WHY UWC (max-w 1200px, py 80px)                                  │
│  Section title: "An education like no other"                      │
│  3 columns (icon + heading + description):                        │
│    🌍 Diverse — students from 130+ countries                       │
│    💡 Transformative — IB Diploma + experiential learning          │
│    🤝 Connected — alumni network spanning every continent          │
├───────────────────────────────────────────────────────────────────┤
│  EXPLORE OUR SCHOOLS (max-w 1200px, py 80px, alt bg #f8f9fb)      │
│  Card carousel (4 visible, scroll horizontally):                  │
│    [UWC Atlantic 🇬🇧] [Maastricht 🇳🇱] [Mahindra 🇮🇳]            │
│    [Pearson 🇨🇦] [Adriatic 🇮🇹] [Costa Rica 🇨🇷]                 │
│  Each card: photo placeholder + name + country flag + year        │
├───────────────────────────────────────────────────────────────────┤
│  HOW TO APPLY (max-w 1100px, py 80px)                             │
│  Section title: "Your path to UWC in 4 steps"                     │
│  Numbered horizontal flow with connecting line:                   │
│    ① Check eligibility    ② Register account                       │
│    ③ Complete application  ④ Submit & track                       │
│  Bottom CTA: [Start your application →]                            │
├───────────────────────────────────────────────────────────────────┤
│  FOOTER (navy bg #001a4d, white text, py 60px)                    │
│  4-column layout:                                                  │
│    Logo + tagline   |  Programmes  |  Find a NC  |  Resources     │
│  Bottom row: © 2026 UWC International · Privacy · Cookies · GDPR │
└───────────────────────────────────────────────────────────────────┘
```

### CTA wiring

- **"Apply Now" (hero or final CTA)** → `showView('eligibility-wizard')`
- **"Sign in" (hero or nav)** → `showView('sign-in')` → mocked credentials → role flips to Sofia → lands on `sofia-dashboard`
- **Nav "Schools"** → `showView('landing-schools')` (anchor scroll to the schools section, same page)
- **Nav "Apply"** → same as Apply Now

### Hero copy alternatives (pick one in build)

Primary (recommended): "Education for a peaceful and sustainable future"  *(verbatim from uwc.org mission)*
Alt 1: "Make education a force to unite people, nations and cultures"
Alt 2: "Your journey starts here. Apply for September 2026."

---

## TASK 3+4: View tree (from v5, retained)

Portal views (visitor/sofia/maria):
- `portal-home` (THIS is the full landing page from Task 9 above)
- `eligibility-wizard` (3-step with Next/Back, see Task 10)
- `eligibility-pass` / `eligibility-guardian-required` / `eligibility-ineligible` (branch outcomes)
- `register` / `sign-in`
- `sofia-dashboard` (her application card + Resume CTA + status)
- `application-form` (6 sections, see Task 10 + 11)
- `application-saved` (toast view) / `application-submitted` (with generated app ID)
- `guardian-consent` (Maria's read-only view of Sofia's form + sign block)

CRM views (ana/io-mkt/akanksha):
- `home`, `contacts-list`, `contact-detail`, `applications-list`, `applications-kanban` (10-stage), `application-detail` (5 tabs), `analytics-source`

Role-aware landing:
```js
var ROLE_LANDING = {
  'visitor':  'portal-home',
  'sofia':    'sofia-dashboard',
  'maria':    'guardian-consent',
  'ana':      'applications-kanban',
  'io-mkt':   'analytics-source',
  'akanksha': 'home'
};
```

---

## TASK 10: Dual navigation pattern

### The two modes coexist

**Mode 1 — Free navigation (always available)**
- Top nav links (Apply, Schools, About, Login) → `showView()` jumps
- Sidebar items (when in Sofia/CRM mode) → `showView()` jumps
- User can break out of any wizard/form by clicking sidebar/nav

**Mode 2 — Next/Back within multi-step**
- Eligibility wizard: 3 questions, Next advances, Back goes one step. After step 3 → branch outcome view.
- Application form: 6 accordion sections. Next saves current section + auto-opens next. Back closes current + opens previous.
- "Save & exit" button in form footer → toast + `showView('sofia-dashboard')`

### Eligibility wizard — exact step flow

```
Step 1/3: Year of birth
  Input: number 1990-2015 with placeholder "e.g. 2009"
  Validation on blur: required, range check
  [Back disabled]  [Next →]

Step 2/3: Nationality
  Input: select dropdown with 21 country flags + names (English)
  Validation: required
  [← Back]  [Next →]

Step 3/3: Country of residency
  Input: select dropdown (same list)
  Optional checkbox: "I currently live in a different country than my nationality"
  Validation: required
  [← Back]  [Check eligibility →]

Outcome: branches per evaluateEligibility(yob, nat, res)
  - pass → eligibility-pass view with [Continue to register →]
  - guardian-required → eligibility-guardian-required view with [Continue with guardian email →]
  - ineligible → eligibility-ineligible view with [Explore UWC alumni programmes] link only
```

### Application form — accordion + Next chaining

```
┌─ Section 1: Personal info ─────────────────── [⌃ open] ┐
│  Full name, preferred name, DOB, gender, nationality,    │
│  passport, address                                       │
│                              [Save section]  [Next →]    │
└──────────────────────────────────────────────────────────┘
┌─ Section 2: Academic background ──────────── [⌃ closed] ┐
└──────────────────────────────────────────────────────────┘
┌─ Section 3: Documents (upload stubs) ──────── [⌃ closed]┐
└──────────────────────────────────────────────────────────┘
┌─ Section 4: Local questions (Brazil) ─────── [⌃ closed] ┐
│  2 essays: Why UWC (500w), Community contribution (300w) │
└──────────────────────────────────────────────────────────┘
┌─ Section 5: Parent/Guardian ────────────────[⌃ closed]  ┐
└──────────────────────────────────────────────────────────┘
┌─ Section 6: Declaration & Consent ──────── [⌃ closed] ┐
└──────────────────────────────────────────────────────────┘

Sticky footer bar:
  [Save & exit]   Section 1 of 6 · ●●○○○○                [Submit application]
```

Submit button is disabled until all 6 sections are marked complete (green tick).

---

## TASK 11: Validation behaviour (visible but non-blocking, per user choice)

### Field-level states

| State | Visual | Trigger |
|---|---|---|
| Empty (required) | Grey border, label asterisk | Default |
| Focused | Navy ring (--uwc-navy at 25% opacity) | Click into field |
| Typing | Navy border solid | onInput |
| Invalid (on blur) | Red border + ⚠ inline message below | onBlur if validation fails |
| Valid (on blur) | Green border + ✓ icon in field | onBlur if validation passes |
| Disabled | Light grey bg, no border | When section locked |

### Validators

```js
const validators = {
  required: (v) => v && v.trim() !== '' || 'This field is required',
  email:    (v) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) || 'Enter a valid email',
  age14_19: (yob) => { var a = 2026 - parseInt(yob); return (a >= 14 && a <= 19) || 'Applicants must be aged 14-19 at time of application'; },
  futureDate: (d) => new Date(d) > new Date() || 'Date cannot be in the future',
  pastDate:   (d) => new Date(d) <= new Date() || 'Date cannot be in the past',
  minLength:  (n) => (v) => (v && v.length >= n) || `Minimum ${n} characters`,
  wordCount:  (n) => (v) => (v && v.trim().split(/\s+/).length >= n) || `Minimum ${n} words`,
};
```

### Next-button behaviour (NON-BLOCKING per user choice)

- Next button is **always clickable**.
- On click, runs all field validators in current section.
- If any fail: shows toast `Please fix the highlighted fields before continuing` + scrolls to first error + tooltip on Next button explaining why blocked. **But the click does not advance.**
- If all pass: advances to next section + marks current section complete (green tick in progress dots).

### Submit confirmation view

When all 6 sections valid and Submit clicked:

```
┌──────────────────────────────────────────────────────┐
│                                                       │
│            ✓ Application submitted                    │
│                                                       │
│   Your reference number:                              │
│                                                       │
│         UWC-2026-BR-00127                             │
│                                                       │
│   What happens next:                                  │
│   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━            │
│   ● Today    Submitted                                │
│   ○ Jun 5    Eligibility review                       │
│   ○ Jun 15   Local interview                          │
│   ○ Jul 1    National selection                       │
│   ○ Aug 15   Place decision                           │
│                                                       │
│   You'll receive an email confirmation shortly at    │
│   sofia.almeida@example.com                          │
│                                                       │
│         [Back to dashboard]                           │
└──────────────────────────────────────────────────────┘
```

---

## Locked fonts (FILL IN AFTER TASK 7)

```
HEADING FONT  : ___________________ (font-family from uwc.org)
BODY FONT     : ___________________
MONO FONT     : ___________________ (fall back to ui-monospace if not specified)
GOOGLE FONTS LINK: ___________________

If proprietary → fallback locked to:
  HEADING: Cormorant Garamond (Google Fonts, weights 500/600/700)
  BODY   : Inter (Google Fonts, weights 400/500/600/700)
  Link: <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

---

## Lint + QA gates (all must pass before commit)

1. **Tbody/ul/ol lint** (the `api_dad66f29c2257f26` bug class):
   ```sh
   grep -nE 'data-role-variant' 02_scenario_B.html | grep -v ':variant"' | grep -E '<(tbody|ul|ol)' # → 0 lines
   ```
2. **No Portuguese remaining**:
   ```sh
   grep -nE 'Brasil|Comitê|mai 2026|Qualificado|Candidatura|Consentimento|Redes Sociais|Escola Parceira|País' 02_scenario_B.html # → 0 lines
   ```
3. **showView coverage**: every `data-view=` ID has ≥1 `onclick="showView('<id>')"` reference OR is a role-landing default.
4. **File size**: `wc -c 02_scenario_B.html` ≤ 250KB (allow extra for landing page + form sections).
5. **Validators wired**: every required field has a `data-validate=` attribute referencing a validator from the validators object.
6. **Playwright QA** (per `api_7470ff6e48506f19`):
   ```sh
   cd wireframes && python3 -m http.server 8765 &
   # open http://localhost:8765/02_scenario_B.html
   ```
   12 screenshots: 6 roles × 2 key views each, plus 3 wizard branches + submit confirmation.

---

## Commit message (when QA passes)

```
Scenario B v6 — enterprise landing + English + free flow + validation

REVISED from v5 based on Pranesh's second-pass feedback (2026-05-28):
- Full-viewport uwc.org-style landing page (nav, hero ~70vh, stats
  strip, value props, schools row, how-to-apply, footer). Replaces
  the cramped 1/4-screen portal opening.
- All Portuguese stripped (Brasil, mai 2026, Qualificado, Comitê
  Nacional, etc.) — entire UI now English.
- Free navigation chassis (showView router from A v5.2) PLUS
  Next/Back buttons within eligibility wizard (3 steps) and
  application form (6 sections). Both modes coexist; sidebar
  always lets user break out.
- Fonts: <verify-via-chrome result> with Cormorant Garamond + Inter
  fallback for proprietary uwc.org fonts.
- Per-field validation, visible but non-blocking. Inline errors on
  blur, success ticks, toast on Next when section invalid.
- Application submit → generates UWC-2026-BR-00127 reference + 
  status timeline view.

Tbody-clobber lint passes. Portuguese-residue lint passes. Single
file, ~180-220KB, self-contained, double-click to open.

Refs: api_4ace68f8dc6845b4 (product-mode pattern), api_dad66f29c2257f26
(lint rule), api_c40ae57c3b2bcd2c (one-scenario-at-a-time),
api_3e961bbbf8e7117b (v5 spec, superseded).
```

After commit: STOP. Tell Pranesh ready for review at file path.

---

## Build sequence (10 steps, ~6-8 hours, fresh session only)

1. **Task 7** — Navigate Chrome to uwc.org, inspect computed styles, write font result into this spec. (15 min)
2. `cp 02_scenario_B.html 02_scenario_B.html.bak`
3. Update `_shared/uwc-tokens.css` with verified fonts (or Cormorant+Inter fallback). (15 min)
4. **Task 9** — Build the full landing page HTML+CSS (largest chunk). Hero + stats + value props + schools + how-to-apply + footer. ~80KB CSS+HTML. (120 min)
5. **Task 8** — Sweep entire file for Portuguese → English using translation table. (30 min)
6. **Task 3** — Build remaining portal views: eligibility wizard 3-step with Next/Back, sofia-dashboard, application form 6-section accordion, guardian consent. (120 min)
7. **Task 4** — Build CRM views: applications-kanban role-filtered, application-detail tabs, analytics funnel (English). (90 min)
8. **Tasks 5+10** — Wire role-switcher chrome-swap + showView router + Next-button auto-advance. (45 min)
9. **Task 11** — Wire validators, inline error UI, toast on Next, submit confirmation with app ID. (45 min)
10. **Task 6** — Run lint gates, serve via http.server, 15 screenshots, commit. (45 min)

**Total: ~530 min = ~8.5 hours focused.** Do NOT start past 30% context in resume session.

---

## Rollback if mid-build breaks

```sh
cp 02_scenario_B.html.bak 02_scenario_B.html
# Or broader:
git reset --hard b3d0451  # A v5.2 commit, untouched by B work
```

## Recovery from consciousness in fresh session

Query: `"UWC Scenario B v6 implementation spec revised landing English validation"`
→ Returns the milestone written this session.
→ Read this file at `wireframes/SCENARIO_B_v6_IMPLEMENTATION_SPEC.md`.
→ Execute build sequence above.
