# kb — the support knowledge base

**kb** = knowledge base. What the support desk knows about how our products break, written
down where the code can keep it honest.

One desk takes reports for every product we run: `sched-prod` (calendar invites for about
300k people) and the rest. When something
goes wrong, the reports reach the desk first. This kb is how the desk triages them, what each
incident turned out to be, and why we decided what we decided.

## What's here

```
src/routes/kb/      the pages (.svx: Markdown with components)
  triage/           how the desk handles incoming reports
  incidents/        one page per big ticket
  decisions/        numbered decision records
src/lib/kb/         components and the logic they run
src/lib/layouts/    the frame every page shares
src/lib/data/       exports from the ticket system
```

## Conventions

- Words in the page, logic in `src/lib` (imported as `#lib/…`). A number that can be computed belongs in a component.
- Every page starts with frontmatter: `title`, `owner`, `status`, `reviewed`.
- A decision is never edited after it is accepted. A new record replaces it.
- A page you add is signed: its frontmatter carries your `signature` and it ends with `<RenderStamp {signature} />`, so the desk knows who wrote it.

## Owners

Support desk. Decision records: whoever signed them.

---

Exported 2026-10-04 from the `support` repo, `apps/kb/` → `src/`.

## S01E03 review and local rendering

The original data and pages are preserved. The new investigation is
`src/routes/kb/incidents/4471-review/+page.svx`; decision 0002 proposes replacing
subject-only deduplication without editing accepted decision 0001.
The new pages use the course-issued ticket verbatim as their frontmatter signature,
as required by S01E03. `RenderStamp` computes the corresponding desk reference.
The review also records the course's 5 October engineering update: parser fixed;
hint won't fix because booking-v3 was retired. Those outcomes are attributed to the
course, not presented as independent live-product verification.

Requires Node.js 22.18+ (native TypeScript stripping) and npm.

```sh
npm ci
npm run verify
npm run analyze
npm run preview -- --port 4173
```

Open `/kb/incidents/4471-review/` on the preview server. `build/` contains the actual
prerendered HTML, styles, and interactive JavaScript, not a Markdown approximation.
`build/kb/incidents/4471-review/index.html` is the rendered deliverable; serve the whole
`build/` directory so its `/kb` and `/_app` paths work.

`scripts/draft-issues.mjs` writes two local issue drafts. `evidence/analysis.json` records
the disjoint report memberships; regenerate it with `node scripts/analyze.mjs`.
`src/lib/data/tickets-4471.json` holds the two published issue URLs.
No issues, visibility changes, or remote publication are performed by the
build scripts.
