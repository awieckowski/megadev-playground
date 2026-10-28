import { readFileSync, readdirSync } from 'node:fs';
import {
  uniqueById, groupByCause, causeOf, readAs
} from '../src/lib/kb/causes.ts';

const data = new URL('../src/lib/data/', import.meta.url);
export const raw = JSON.parse(readFileSync(new URL('reports-4471.json', data), 'utf8'));
export const notes = JSON.parse(readFileSync(new URL('desk-notes.json', data), 'utf8'));
const directory = new URL('tenants/', data);
export const tenants = new Map(readdirSync(directory).filter((name) => name.endsWith('.json')).map((name) => {
  const tenant = JSON.parse(readFileSync(new URL(name, directory), 'utf8'));
  return [tenant.handle, tenant];
}));
export const tenantOf = (report) => tenants.get(report.tenant);
export const reports = uniqueById(raw).filter((report) => report.mergedInto === 4471);
export const groups = groupByCause(reports, tenantOf);
export const summary = {
  source: 'support-kb/src/lib/data/reports-4471.json',
  rawRows: raw.length,
  uniqueReports: reports.length,
  overlappingRows: raw.length - uniqueById(raw).length,
  groups: groups.map((group) => ({
    cause: group.cause,
    count: group.reports.length,
    tenants: group.tenants,
    firstSeen: group.firstSeen,
    lastSeen: group.lastSeen,
    intakeTags: group.taggedAs,
    oneDayMoveReports: readAs(group, notes.oneDayMove),
    reportIds: group.reports.map((report) => report.id)
  })),
  intakeDisagreements: reports.filter((report) => report.meta.intakeTag !== causeOf(report, tenantOf(report))).map((report) => report.id),
  oneDayMoveReports: notes.oneDayMove.map((id) => {
    const report = reports.find((report) => report.id === id);
    return { ...report, tenantConfig: tenantOf(report), computedCause: causeOf(report, tenantOf(report)) };
  })
};
