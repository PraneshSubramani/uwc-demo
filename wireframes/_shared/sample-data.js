/* ========================================================================
   UWC Sample Data — single source of truth
   All names + facts from Build Plan v4.1 §2 — used verbatim across all
   scenario files. No improvisation, no Lorem Ipsum.
   ======================================================================== */
window.UWC = window.UWC || {};

UWC.users = [
  { id: 'akanksha', name: 'Akanksha Anand', initial: 'AA', role: 'IO Super Admin', scope: 'Global · Full visibility', badge: 'ios', email: 'akanksha.anand@uwcio.uwc.org' },
  { id: 'fatima',   name: 'Fatima Al-Rashid', initial: 'FA', role: 'IO Admissions', scope: 'Global · Place allocation', badge: 'ios', email: 'fatima.alrashid@uwcio.uwc.org' },
  { id: 'data-protection', name: 'Data Protection Lead', initial: 'DP', role: 'Compliance & GDPR', scope: 'Restricted record visibility', badge: 'dp', email: 'data.protection@uwcio.uwc.org' },
  { id: 'ana',      name: 'Ana Carvalho', initial: 'AC', role: 'NC Admin', scope: 'UWC Brazil only', badge: 'nc', email: 'ana.carvalho@uwcbrazil.org' },
  { id: 'marcus',   name: 'Marcus Weber', initial: 'MW', role: 'NC Admin', scope: 'UWC Germany only', badge: 'nc', email: 'm.weber@uwcgermany.de' },
  { id: 'grace',    name: 'Grace Omondi', initial: 'GO', role: 'NC Chair', scope: 'UWC Kenya only', badge: 'nc', email: 'g.omondi@uwckenya.org' },
  { id: 'clara',    name: 'Clara Ramos', initial: 'CR', role: 'NC Reviewer', scope: 'Assigned applications only', badge: 'reviewer', email: 'clara.ramos@uwcbrazil.org' },
  { id: 'paulo',    name: 'Paulo Fonseca', initial: 'PF', role: 'NC Reviewer', scope: 'Assigned applications only', badge: 'reviewer', email: 'paulo.fonseca@uwcbrazil.org' },
  { id: 'helen',    name: 'Helen Richards', initial: 'HR', role: 'Admissions Director', scope: 'UWC Atlantic only', badge: 'school', email: 'helen.richards@uwcatlantic.org' },
  { id: 'sofia',    name: 'Sofia Almeida', initial: 'SA', role: 'Applicant (Portal)', scope: 'Her own application only', badge: 'portal', email: 'sofia.almeida@example.com' },
  { id: 'maria',    name: 'Maria Almeida', initial: 'MA', role: 'Guardian / Parent', scope: 'Sofia\'s application — consent', badge: 'guardian', email: 'maria.almeida@example.com' },
  { id: 'visitor',  name: 'Public visitor', initial: '🌐', role: 'Not signed in', scope: 'Public portal only', badge: 'portal', email: '' },
  { id: 'io-mkt',   name: 'IO Marketing Staff', initial: 'IM', role: 'Marketing & Comms', scope: 'Source attribution + campaigns', badge: 'marketing', email: 'marketing@uwcio.uwc.org' },
  { id: 'io-crm',   name: 'IO CRM Administrator', initial: 'CR', role: 'CRM Admin', scope: 'Governance + NC data', badge: 'ios', email: 'crm.admin@uwcio.uwc.org' },
  { id: 'jonathan', name: 'Jonathan Osei', initial: 'JO', role: 'Donor (Contact view)', scope: 'Own communication history', badge: 'default', email: 'j.osei@example.com' }
];

UWC.nationalCommittees = [
  { id: 'nc-br', name: 'UWC Brazil National Committee', country: 'Brazil', countryCode: 'br', status: 'Active', admin: 'Ana Carvalho', members: 18, programmes2026: 1, applicationsThisCycle: 47, mou: 'Submitted' },
  { id: 'nc-de', name: 'UWC Germany National Committee', country: 'Germany', countryCode: 'de', status: 'Active', admin: 'Marcus Weber', members: 22, programmes2026: 1, applicationsThisCycle: 14, mou: 'Submitted' },
  { id: 'nc-ke', name: 'UWC Kenya National Committee', country: 'Kenya', countryCode: 'ke', status: 'Active', admin: 'Grace Omondi', members: 9, programmes2026: 1, applicationsThisCycle: 28, mou: 'Annual report OVERDUE' },
  { id: 'nc-in', name: 'UWC India National Committee', country: 'India', countryCode: 'in', status: 'Active', admin: 'Priya Sharma', members: 31, programmes2026: 1, applicationsThisCycle: 62, mou: 'Submitted' },
  { id: 'nc-uk', name: 'UWC UK National Committee', country: 'United Kingdom', countryCode: 'gb', status: 'Active', admin: 'James Thornton', members: 14, programmes2026: 1, applicationsThisCycle: 19, mou: 'Submitted' }
];

UWC.schools = [
  { id: 'sch-atlantic', name: 'UWC Atlantic College', country: 'Wales, UK', flag: 'gb', admissions: 'Helen Richards', placesAllocated: 12, remaining: 8 },
  { id: 'sch-rcn',      name: 'UWC Red Cross Nordic',  country: 'Norway',    flag: 'no', admissions: 'Erik Solberg',   placesAllocated: 8,  remaining: 6 },
  { id: 'sch-mahindra', name: 'UWC Mahindra College',  country: 'India',     flag: 'in', admissions: 'Anjali Mehta',   placesAllocated: 6,  remaining: 4 }
];

UWC.applicants = [
  { id: 'app-sofia',   name: 'Sofia Almeida',   age: 16, country: 'Brazil',   flag: 'br', nc: 'nc-br', stage: 'Under Review', isMinor: true, parent: 'Maria Almeida', consent: 'Received', flag_status: 'None',         language: 'Português',  primary: true, formPct: 100, scoreAcademic: 9, scoreCommunity: 8, scoreCommunication: 9, scoreValues: 9 },
  { id: 'app-amara',   name: 'Amara Diallo',    age: 17, country: 'Guinea',   flag: 'gn', nc: 'nc-de', stage: 'Shortlisted',  isMinor: true, parent: 'Fatou Diallo', consent: 'Received', flag_status: 'None',         language: 'English',    primary: false, formPct: 100, scoreAcademic: 8, scoreCommunity: 9, scoreCommunication: 8, scoreValues: 9 },
  { id: 'app-lena',    name: 'Lena Fischer',    age: 16, country: 'Germany',  flag: 'de', nc: 'nc-de', stage: 'Submitted',    isMinor: true, parent: 'Klaus Fischer', consent: 'Received', flag_status: 'None',        language: 'Deutsch',    primary: false, formPct: 100 },
  { id: 'app-kwame',   name: 'Kwame Asante',    age: 17, country: 'Ghana',    flag: 'gh', nc: 'nc-ke', stage: 'Nominated',    isMinor: true, parent: 'Akua Asante',  consent: 'Received', flag_status: 'None',         language: 'English',    primary: false, formPct: 100, nominatedTo: 'sch-atlantic' },
  { id: 'app-preethi', name: 'Preethi Nair',    age: 16, country: 'India',    flag: 'in', nc: 'nc-in', stage: 'In Progress',  isMinor: true, parent: 'Kavita Nair',  consent: 'Pending',  flag_status: 'None',         language: 'English',    primary: false, formPct: 72 },
  { id: 'app-miguel',  name: 'Miguel Santos',   age: 17, country: 'Portugal', flag: 'pt', nc: 'nc-br', stage: 'Shortlisted',  isMinor: true, parent: 'Beatriz Santos', consent: 'Received', flag_status: 'Under Review', language: 'Português',  primary: false, formPct: 100 }
];

UWC.programmes2026 = [
  { id: 'prog-br-2026', nc: 'nc-br', name: 'UWC Brazil 2026 Selection', open: '2026-03-01', deadline: '2026-06-15', stages: 'Eligibility · Form · Review · Panel · Nomination', localQuestion: 'Como você imagina contribuir para a sua comunidade após o UWC?' },
  { id: 'prog-de-2026', nc: 'nc-de', name: 'UWC Deutschland 2026 Auswahl', open: '2026-02-01', deadline: '2026-05-30', stages: 'Eligibility · Form · Review · Panel · Nomination', localQuestion: 'Beschreibe ein gesellschaftliches Problem in deiner Region und wie du es angehen würdest.' },
  { id: 'prog-ke-2026', nc: 'nc-ke', name: 'UWC Kenya 2026 Selection',     open: '2026-01-15', deadline: '2026-05-15', stages: 'Eligibility · Form · Review · Panel · Nomination', localQuestion: 'Describe a leadership initiative you led in your community.' },
  { id: 'prog-in-2026', nc: 'nc-in', name: 'UWC India 2026 Selection',     open: '2026-01-01', deadline: '2026-04-30', stages: 'Eligibility · Form · Review · Interview · Panel · Nomination', localQuestion: 'Share an experience where you crossed a cultural boundary.' },
  { id: 'prog-uk-2026', nc: 'nc-uk', name: 'UWC UK 2026 Selection',         open: '2026-02-15', deadline: '2026-06-01', stages: 'Eligibility · Form · Review · Panel · Nomination', localQuestion: 'How would you bring a UWC mission to your home town?' }
];

UWC.governance = [
  { id: 'gov-board',          name: 'UWC International Board',          type: 'Board',          purpose: 'Governance of UWC International, strategy, financial oversight', members: 5, gaps: ['Marketing & Communications', 'Youth Engagement', 'Asia-Pacific Regional Expertise'] },
  { id: 'gov-audit',          name: 'Audit & Risk Committee',           type: 'Committee',      purpose: 'Annual audit, risk register, internal controls', members: 4, gaps: ['Cybersecurity'] },
  { id: 'gov-nominations',    name: 'Nominations Committee',            type: 'Committee',      purpose: 'Board succession planning + recommendation of trustees', members: 3, gaps: [] },
  { id: 'gov-risk-advisory',  name: 'Risk Advisory Group',              type: 'Advisory',       purpose: 'Quarterly risk review and scenario planning', members: 4, gaps: ['Climate Risk'] }
];

UWC.boardMembers = [
  { id: 'gm-catherine', body: 'gov-board', name: 'Dame Catherine Prior', role: 'Chair',      appointed: '2022-01-01', termExpires: '2026-12-31', status: 'Current',   competencies: ['Governance', 'Education Policy', 'Fundraising'] },
  { id: 'gm-ravi',      body: 'gov-board', name: 'Dr Ravi Menon',         role: 'Trustee',    appointed: '2021-03-01', termExpires: '2025-03-31', status: 'EXPIRED',   competencies: ['Finance', 'International Relations'] },
  { id: 'gm-sarah',     body: 'gov-board', name: 'Sarah Okonkwo',         role: 'Secretary',  appointed: '2023-09-01', termExpires: '2027-08-31', status: 'Current',   competencies: ['Legal', 'HR', 'Safeguarding'] },
  { id: 'gm-thomas',    body: 'gov-board', name: 'Thomas Berger',         role: 'Trustee',    appointed: '2020-01-01', termExpires: '2024-12-31', status: 'EXPIRED',   competencies: ['Digital Transformation', 'Technology'] },
  { id: 'gm-amina',     body: 'gov-board', name: 'Amina Hassan',          role: 'Trustee',    appointed: '2024-10-01', termExpires: '2028-09-30', status: 'Current',   competencies: ['Climate', 'Sustainability', 'Africa Region'] }
];

UWC.competenciesRequired = ['Governance', 'Finance', 'Legal', 'HR', 'Safeguarding', 'Education Policy', 'Fundraising', 'International Relations', 'Digital Transformation', 'Technology', 'Climate', 'Sustainability', 'Marketing & Communications', 'Youth Engagement', 'Africa Region', 'Asia-Pacific Regional Expertise'];

UWC.kenyaVolunteers = [
  { id: 'vol-grace',  name: 'Grace Omondi',   role: 'NC Chair',                training: { type: 'Safeguarding', completed: '2024-01-14', expires: '2026-01-14', status: 'CURRENT' }, mou: 'Annual report submitted' },
  { id: 'vol-daniel', name: 'Daniel Kimani',  role: 'Selection Coordinator',   training: { type: 'Safeguarding', completed: '2023-03-03', expires: '2025-03-03', status: 'EXPIRED' }, mou: 'Annual report OVERDUE' },
  { id: 'vol-aisha',  name: 'Aisha Waweru',   role: 'Reviewer',                training: { type: 'Safeguarding', completed: null,         expires: null,        status: 'MISSING' }, mou: 'N/A' }
];

UWC.commsContacts = [
  { id: 'cn-jonathan',  name: 'Jonathan Osei',    type: 'Donor',     email: 'j.osei@example.com',          consent: 'Opted in',     note: 'Donated in last 12 months', lastSent: '2026-03-12', opens: 4 },
  { id: 'cn-isabelle',  name: 'Isabelle Fontaine', type: 'Donor',    email: 'i.fontaine@example.com',      consent: 'Opted in',     note: 'Donated in last 12 months', lastSent: '2026-03-12', opens: 3 },
  { id: 'cn-sam',       name: 'Sam Blackwood',     type: 'Alumni',   email: 'sam.blackwood@example.com',   consent: 'Opted in',     note: 'Former NC Chair',           lastSent: '2026-02-08', opens: 2 },
  { id: 'cn-grace',     name: 'Grace Omondi',      type: 'NC Chair', email: 'g.omondi@uwckenya.org',       consent: 'Opted in',     note: 'Active NC Chair, Kenya',    lastSent: '2026-05-01', opens: 5 },
  { id: 'cn-marcus',    name: 'Marcus Weber',      type: 'NC Admin', email: 'm.weber@uwcgermany.de',       consent: 'OPTED OUT',    note: 'Excluded from 14 campaigns', lastSent: null, opens: 0 }
];

UWC.applicationStages = [
  { id: 'registered',  label: 'Registered',  color: '#9ca3af', probability: 5,   open: true },
  { id: 'in_progress', label: 'In Progress', color: '#3b82f6', probability: 15,  open: true },
  { id: 'submitted',   label: 'Submitted',   color: '#003087', probability: 30,  open: true },
  { id: 'under_review',label: 'Under Review',color: '#7c3aed', probability: 45,  open: true },
  { id: 'shortlisted', label: 'Shortlisted', color: '#C8AB00', probability: 60,  open: true },
  { id: 'nominated',   label: 'Nominated',   color: '#10b981', probability: 80,  open: true },
  { id: 'placed',      label: 'Placed',      color: '#059669', probability: 100, open: false, terminal: 'Won' },
  { id: 'declined',    label: 'Declined',    color: '#C8102E', probability: 0,   open: false, terminal: 'Lost' },
  { id: 'withdrawn',   label: 'Withdrawn',   color: '#6b7280', probability: 0,   open: false, terminal: 'Lost' },
  { id: 'waitlisted',  label: 'Waitlisted',  color: '#f59e0b', probability: 25,  open: true }
];

UWC.brand = {
  navy: '#003087', navyLive: '#004A97', red: '#C8102E', teal: '#009482',
  tint: '#E8EEF6', grey: '#6C757D',
  fontTitle: "'Playfair Display', Georgia, serif",
  fontBody: "'DM Sans', system-ui, sans-serif"
};

UWC.scenarios = [
  { code: 'A', title: 'NC Administration, Permissions, and Programme Configuration', file: '01_scenario_A.html', steps: 9, duration: '8 min', defaultRole: 'marcus', protagonist: 'Marcus Weber', focus: 'Self-service NC admin, role boundaries, field-level security' },
  { code: 'B', title: 'Applicant Registration, Eligibility, and Form Submission',     file: '02_scenario_B.html', steps: 10, duration: '10 min', defaultRole: 'visitor', protagonist: 'Sofia Almeida', focus: 'Sofia\'s journey through the portal in Portuguese' },
  { code: 'C', title: 'Multi-Stage Selection, Scoring, and Safeguarding',             file: '03_scenario_C.html', steps: 10, duration: '10 min', defaultRole: 'clara',   protagonist: 'Clara & Paulo (reviewers)', focus: 'Blind review enforcement + safeguarding workflow' },
  { code: 'D', title: 'Nomination, Place Allocation, and Pack Generation',            file: '04_scenario_D.html', steps: 10, duration: '9 min', defaultRole: 'fatima',  protagonist: 'Fatima → Ana → Helen', focus: 'IO allocates quota → NC nominates → School accepts' },
  { code: 'E', title: 'Governance Structure and Body Management',                     file: '05_scenario_E.html', steps: 8, duration: '7 min', defaultRole: 'akanksha', protagonist: 'IO Super Admin', focus: 'Governance bodies, members, competency matrix' },
  { code: 'F', title: 'National Committee Management and Volunteer Oversight',        file: '06_scenario_F.html', steps: 8, duration: '8 min', defaultRole: 'akanksha', protagonist: 'IO Super Admin', focus: 'NC health, volunteers, training compliance, MoU' },
  { code: 'G', title: 'Communications, Mailing Lists, and Bulk Record Updates',       file: '07_scenario_G.html', steps: 9, duration: '8 min', defaultRole: 'io-mkt',  protagonist: 'IO Marketing', focus: 'Mailchimp integration + consent + GDPR' }
];

// Per-scenario role-switcher lists — exactly what appears in the dropdown
UWC.scenarioRoles = {
  A: ['marcus', 'ana', 'akanksha', 'data-protection'],
  B: ['visitor', 'sofia', 'maria', 'ana', 'io-mkt'],
  C: ['clara', 'paulo', 'ana', 'akanksha'],
  D: ['fatima', 'ana', 'helen'],
  E: ['akanksha', 'io-crm'],
  F: ['akanksha', 'grace'],
  G: ['io-mkt', 'akanksha', 'jonathan']
};

// Helper to get role objects for a scenario in the order to render in dropdown
UWC.getRolesFor = function (scenarioCode) {
  return (UWC.scenarioRoles[scenarioCode] || []).map(function (id) {
    return UWC.users.find(function (u) { return u.id === id; });
  }).filter(Boolean);
};
