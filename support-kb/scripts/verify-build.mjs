import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { deskRef } from '../src/lib/kb/desk-ref.ts';
import { summary } from './analysis.mjs';
import tickets from '../src/lib/data/tickets-4471.json' with { type: 'json' };

const html = readFileSync(new URL('../build/kb/incidents/4471-review/index.html', import.meta.url), 'utf8');
const source = readFileSync(new URL('../src/routes/kb/incidents/4471-review/+page.svx', import.meta.url), 'utf8');
const signature = source.match(/^signature:\s*'([^']+)'$/m)?.[1];
assert.ok(signature?.startsWith('v1.'), 'The page must carry the course-issued signature');
const text = html.replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
for (const group of summary.groups) {
  assert.ok(text.includes(String(group.count)), `Missing rendered count for ${group.cause}`);
}
assert.ok(text.includes('412 unique reports'));
assert.ok(text.includes('427 export rows'));
assert.ok(text.includes('38 reports'));
assert.ok(text.includes(deskRef(signature)), 'Missing computed desk ref');
assert.ok(!text.includes('no desk ref:'));
assert.ok(!html.includes('<CauseTable'));
assert.ok(!html.includes('<RenderStamp'));
assert.ok(text.includes('not this ticket — no ticket of its own'));
assert.ok(text.includes('184 reports on 2026-07-02'));
assert.ok(text.includes('Engineering update: 5 October 2026'));
assert.ok(text.includes('fix(dates): parse dd/mm for eu locales'));
assert.ok(text.includes('booking-v3 form retired'));
assert.ok(text.includes('not planned'));
assert.ok(text.includes('not as a repaired hint'));
for (const url of Object.values(tickets)) {
  assert.match(url, /^https:\/\/github\.com\/awieckowski\/megadev-playground\/issues\/\d+$/);
  assert.ok(html.includes(`href="${url}"`), `Missing actual issue link: ${url}`);
}
assert.equal(new Set(Object.values(tickets)).size, 2);
assert.ok(!text.includes('Draft — awaiting publication approval'));
const index = readFileSync(new URL('../build/kb/index.html', import.meta.url), 'utf8');
assert.ok(index.includes('/kb/incidents/4471-review'));
assert.ok(index.includes('/kb/decisions/0002-dedupe-by-cause'));
console.log(`Rendered checks passed; computed desk ref ${deskRef(signature)}.`);
