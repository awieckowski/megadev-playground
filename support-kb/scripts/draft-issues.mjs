import { mkdirSync, writeFileSync } from 'node:fs';
import { groups } from './analysis.mjs';

const drafts = new URL('../drafts/', import.meta.url);
mkdirSync(drafts, { recursive: true });
const content = {
  parser: {
    title: '[#4471 split] Month-first parser flips day-first tenant dates',
    diagnosis: 'The shared parser reads numeric dates month first for day-first tenants. This is the parser cause, not the separate booking-v3 field-hint problem.',
    example: '`R-41200`: harbour.dental, en-GB, booking-v2, app. A reminder intended for 7 April went out on 4 July.',
    reproduction: 'Use a day-first tenant on app/email or booking-v2 form. Enter an ambiguous day/month date such as 07/04/2026. The shared month-first parser reads 4 July instead of 7 April.',
    fix: 'Parse using an explicit tenant date convention. Check ambiguous dates, dates whose day exceeds 12, invalid dates, and a month-first control. Verify the independent booking-v3 hint issue separately.'
  },
  hint: {
    title: '[#4471 split] booking-v3 MM/DD/YYYY hint conflicts with day-first input handling',
    diagnosis: 'booking-v3 prints MM/DD/YYYY but reads the input using the day-first tenant format. People follow the hint, so bookings move to the wrong month/day. This needs a form-hint/input fix independent of the shared parser.',
    example: '`R-41230`: copper.studio, es-ES, booking-v3, form. Intake guessed parser; tenant/form/channel establish hint. Other affected form tenants: alder.physio and pale.harbour.',
    reproduction: 'Open booking-v3 for a day-first tenant. Follow MM/DD/YYYY for a 6 January booking and type 01/06/2026. Day-first input handling reads 1 June. App/email on the same tenant belong to the separate parser cause.',
    fix: 'Generate the field hint and input handling from the same tenant date convention. Test booking-v3 for es-ES, de-DE, pt-PT, a month-first control, and booking-v2. Do not close this issue solely because a shared parser fix ships.'
  }
};

for (const group of groups) {
  const c = content[group.cause];
  if (!c) throw new Error(`Unclassified group: ${group.cause}`);
  const body = `## Problem and scope

**Cause: ${group.cause}. Reports covered: ${group.reports.length} unique reports** originally merged into support ticket #4471, across ${group.tenants} tenants.
Received ${group.firstSeen} through ${group.lastSeen}; snapshot exported 4 October 2026.

${c.diagnosis}

## Evidence and reproduction

${c.example}

${c.reproduction}

This reproduction follows the exported support model, not a test against a live product.

## Count method

Read support-kb/src/lib/data/reports-4471.json, deduplicate by id, restrict mergedInto to 4471, and apply support-kb/src/lib/kb/causes.ts with tenants/*.json. Do not count overlapping export rows or classify by intakeTag/browserLocale/subject.
Intake tags within this cause: ${Object.entries(group.taggedAs).map(([tag, count]) => `${tag}=${count}`).join(', ')}.
The two issue counts form an exhaustive, disjoint split of 412 unique reports.

## Acceptance checks

${c.fix}

No fix or deployment is claimed. Keep this issue open until independently verified.

## Reproducible sources

- Analysis and membership: support-kb/scripts/analyze.mjs and support-kb/evidence/analysis.json
- Signed source: support-kb/src/routes/kb/incidents/4471-review/+page.svx
- Rendered page: support-kb/build/kb/incidents/4471-review/index.html
- Run: cd support-kb && npm ci && npm test && npm run analyze && npm run build

## Covered report IDs

${group.reports.map((report) => report.id).join(', ')}
`;
  writeFileSync(new URL(`${group.cause}.md`, drafts), body);
  writeFileSync(new URL(`${group.cause}-title.txt`, drafts), `${c.title}\n`);
}
