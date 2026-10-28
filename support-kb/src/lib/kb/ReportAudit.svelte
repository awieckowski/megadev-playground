<script lang="ts">
  import raw from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import tickets from '#lib/data/tickets-4471.json';
  import { uniqueById, groupByCause, causeOf, readAs, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  const reports = uniqueById(raw as Report[]).filter((r) => r.mergedInto === 4471);
  const groups = groupByCause(reports, tenantOf);
  const disagreements = reports.filter((r) => r.meta.intakeTag !== causeOf(r, tenantOf(r)));
  const mergedDays = reports.reduce<Record<string, number>>((days, r) => {
    if (r.mergedAt) {
      const day = r.mergedAt.slice(0, 10);
      days[day] = (days[day] ?? 0) + 1;
    }
    return days;
  }, {});
  const largestBatch = Object.entries(mergedDays).sort((a, b) => b[1] - a[1])[0];
  const oneDay = groups.reduce((total, g) => total + readAs(g, notes.oneDayMove), 0);
  const names: Record<string, string> = {
    parser: 'Month-first parser for day-first tenants',
    hint: 'booking-v3 date hint disagrees with tenant format'
  };
</script>

<p><strong>{reports.length} unique reports</strong> in {raw.length} export rows.
  The export repeats {raw.length - reports.length} rows; repeated IDs are not new reports.</p>

<table aria-label="Separate problems and report counts">
  <thead><tr><th>problem</th><th>reports</th><th>tenants</th><th>GitHub issue</th></tr></thead>
  <tbody>
    {#each groups as g}
      <tr>
        <td><code>{g.cause}</code>: {names[g.cause] ?? 'Needs investigation'}</td>
        <td>{g.reports.length}</td>
        <td>{g.tenants}</td>
        <td>
          {#if g.cause !== 'unplaced' && tickets[g.cause]}
            <a href={tickets[g.cause] ?? ''}>{g.cause} issue</a>
          {:else}
            Draft — awaiting publication approval
          {/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<p>The intake tag disagrees with the tenant-and-channel classifier on
  <strong>{disagreements.length} reports</strong>. Counting tags gives a different split.</p>
<p>The desk marked <strong>{oneDay} reports</strong> as one-day moves:
  {notes.oneDayMove.join(', ')}. The supplied classifier places them under
  <code>parser</code>; keep their descriptions for investigation, not a third counted cause.</p>
<p>The largest merge batch was <strong>{largestBatch[1]} reports on {largestBatch[0]}</strong>.
  Receipt time and merge time describe different events. A merge spike does not establish
  when a bug started.</p>
