import test from 'node:test';
import assert from 'node:assert/strict';
import { raw, reports, groups, tenantOf, summary } from '../scripts/analysis.mjs';
import { causeOf, sameCause, uniqueById, dayFirst } from '../src/lib/kb/causes.ts';

test('overlapping pages count one report per ID without conflicting copies', () => {
  const seen = new Map();
  for (const report of raw) {
    if (seen.has(report.id)) assert.deepEqual(report, seen.get(report.id));
    seen.set(report.id, report);
  }
  assert.equal(raw.length, 427);
  assert.equal(reports.length, 412);
  assert.equal(uniqueById([...raw, ...raw]).length, reports.length);
});

test('every report has a tenant and a cause; groups are a disjoint exhaustive partition', () => {
  assert.ok(reports.every((report) => tenantOf(report) && causeOf(report, tenantOf(report))));
  const ids = groups.flatMap((group) => group.reports.map((report) => report.id));
  assert.equal(new Set(ids).size, reports.length);
  assert.equal(ids.length, reports.length);
  assert.deepEqual(Object.fromEntries(groups.map((g) => [g.cause, g.reports.length])), { parser: 379, hint: 33 });
  assert.equal(summary.intakeDisagreements.length, 38);
});

test('same subject is not sufficient and different subjects do not prevent a duplicate', () => {
  const form = { tenant: 'alder.physio', channel: 'form', subject: 'Booking on the wrong date' };
  const app = { ...form, channel: 'app' };
  assert.equal(sameCause(form, tenantOf(form), app, tenantOf(app)), false);
  const email = { tenant: 'kettle.books', channel: 'email', subject: 'Different subject' };
  assert.equal(sameCause(app, tenantOf(app), email, tenantOf(email)), true);
  assert.equal(sameCause(app, undefined, email, undefined), false);
});

test('locale, not browser language or intake guess, drives the supplied classifier', () => {
  assert.equal(dayFirst('en-GB'), true);
  assert.equal(dayFirst('en-US'), false);
  assert.equal(causeOf({ channel: 'form' }, { locale: 'en-US', form: 'booking-v3' }), null);
  assert.ok(summary.intakeDisagreements.length > 0);
});

test('one-day descriptions remain with their computed cause, not an invented third bug', () => {
  assert.equal(summary.oneDayMoveReports.length, 5);
  assert.ok(summary.oneDayMoveReports.every((report) => report.computedCause === 'parser'));
});
