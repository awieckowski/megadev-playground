## Problem and scope

**Cause: hint. Reports covered: 33 unique reports** originally merged into support ticket #4471, across 3 tenants.
Received 2026-04-17 through 2026-09-22; snapshot exported 4 October 2026.

booking-v3 prints MM/DD/YYYY but reads the input using the day-first tenant format. People follow the hint, so bookings move to the wrong month/day. This needs a form-hint/input fix independent of the shared parser.

## Evidence and reproduction

`R-41230`: copper.studio, es-ES, booking-v3, form. Intake guessed parser; tenant/form/channel establish hint. Other affected form tenants: alder.physio and pale.harbour.

Open booking-v3 for a day-first tenant. Follow MM/DD/YYYY for a 6 January booking and type 01/06/2026. Day-first input handling reads 1 June. App/email on the same tenant belong to the separate parser cause.

This reproduction follows the exported support model, not a test against a live product.

## Count method

Read support-kb/src/lib/data/reports-4471.json, deduplicate by id, restrict mergedInto to 4471, and apply support-kb/src/lib/kb/causes.ts with tenants/*.json. Do not count overlapping export rows or classify by intakeTag/browserLocale/subject.
Intake tags within this cause: parser=15, hint=18.
The two issue counts form an exhaustive, disjoint split of 412 unique reports.

## Acceptance checks

Generate the field hint and input handling from the same tenant date convention. Test booking-v3 for es-ES, de-DE, pt-PT, a month-first control, and booking-v2. Do not close this issue solely because a shared parser fix ships.

No fix or deployment is claimed. Keep this issue open until independently verified.

## Reproducible sources

- Analysis and membership: support-kb/scripts/analyze.mjs and support-kb/evidence/analysis.json
- Signed source: support-kb/src/routes/kb/incidents/4471-review/+page.svx
- Rendered page: support-kb/build/kb/incidents/4471-review/index.html
- Run: cd support-kb && npm ci && npm test && npm run analyze && npm run build

## Covered report IDs

R-41230, R-41241, R-41251, R-41259, R-41262, R-41275, R-41294, R-41305, R-41308, R-41366, R-41372, R-41384, R-41387, R-41396, R-41400, R-41406, R-41415, R-41416, R-41418, R-41428, R-41439, R-41441, R-41449, R-41453, R-41456, R-41460, R-41472, R-41485, R-41493, R-41539, R-41572, R-41582, R-41584
