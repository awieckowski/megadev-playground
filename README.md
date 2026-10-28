# MEGA.dev playground — S01E03

This repository contains the course's fictional support knowledge base and an investigation
of the 412 unique reports merged into support ticket #4471.

## Deliverables

| Problem | Unique reports | GitHub issue |
| --- | ---: | --- |
| Month-first parser misreads day-first dates | 379 | [#1](https://github.com/awieckowski/megadev-playground/issues/1) |
| booking-v3 date hint conflicts with tenant input handling | 33 | [#2](https://github.com/awieckowski/megadev-playground/issues/2) |

- [Signed investigation source](support-kb/src/routes/kb/incidents/4471-review/+page.svx)
- [Rendered investigation HTML](support-kb/build/kb/incidents/4471-review/index.html)
- [Screenshot of the rendered page](support-kb/evidence/review-published.png)
- [Computed counts and report memberships](support-kb/evidence/analysis.json)
- [Proposed replacement deduplication decision](support-kb/src/routes/kb/decisions/0002-dedupe-by-cause/+page.svx)

The export contains 427 rows because pages overlap. Counting distinct report IDs and
classifying by tenant configuration and channel yields the disjoint split above.
Intake tags are guesses, not authoritative cause labels.

## Reproduce and view

Requires Node.js 22.18+ and npm.

```sh
cd support-kb
npm ci
npm run verify
npm run analyze
python3 -m http.server 4174 --bind 127.0.0.1 --directory build
```

Open `http://127.0.0.1:4174/kb/incidents/4471-review/`.
Serve the entire `build` directory so root-relative styles, scripts, and `/kb` links work.
The rendered output is committed alongside the `.svx` source; public web hosting is not
required to inspect these deliverables.

The original exported pages, accepted decision 0001, components, and report data remain
unchanged. Decision 0002 is a proposal, not an accepted policy or a production change.
No product fix or deployment is claimed.
