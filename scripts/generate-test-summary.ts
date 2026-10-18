/**
 * Summarises a Playwright JSON report by project and status, keyed by test case ID.
 * Run: npm run summary [-- <results.json>]   (default LPC execution results)
 * Writes reports/loan-product-configuration/execution/test-summary.md and prints the same table.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

type Result = { status: string; error?: { message?: string } };
type Spec = { title: string; file: string; tests: { projectName: string; status: string; results: Result[] }[] };
type Suite = { specs?: Spec[]; suites?: Suite[] };

const root = resolve(import.meta.dirname, '..');
const input = resolve(root, process.argv[2] ?? 'reports/loan-product-configuration/execution/results.json');
if (!existsSync(input)) {
  console.error(`No JSON report at ${input}. Run the tests first (the json reporter writes the execution results folder).`);
  process.exit(1);
}
const report: { suites: Suite[]; stats?: { startTime?: string; duration?: number } } = JSON.parse(readFileSync(input, 'utf8'));

const rows: { id: string; project: string; outcome: string; error: string }[] = [];
const visit = (suite: Suite) => {
  for (const spec of suite.specs ?? []) {
    const id = spec.title.match(/\b(FLOW-LPC-(?:ADD|EDIT)-(?:\d{3}|S\d{2}[A-Z]?-\d{3})|FS-TC-\d+|FR-NEW-\d+|FR-MC-\d+|LS-NEW-\d+)\b/)?.[1] ?? spec.title;
    for (const t of spec.tests) {
      // Playwright test status: expected | unexpected | flaky | skipped.
      const last = t.results.at(-1);
      const outcome = t.status === 'expected' ? (last?.status === 'skipped' ? 'skipped' : 'passed')
        : t.status === 'unexpected' ? 'failed' : t.status;
      const error = (last?.error?.message ?? '').replace(/\u001b\[[0-9;]*m/g, '').split('\n')[0].slice(0, 160);
      rows.push({ id, project: t.projectName, outcome, error });
    }
  }
  for (const child of suite.suites ?? []) visit(child);
};
report.suites.forEach(visit);

const outcomes = ['passed', 'failed', 'flaky', 'skipped'];
const projects = [...new Set(rows.map((r) => r.project))];
const lines = [
  `# Test Summary`,
  ``,
  `Source: \`${input.replace(root, '.').replaceAll('\\', '/')}\` | Start: ${report.stats?.startTime ?? 'n/a'} | Duration: ${Math.round((report.stats?.duration ?? 0) / 1000)} s`,
  ``,
  `| Project | ${outcomes.join(' | ')} | Total |`,
  `|---|${outcomes.map(() => '---:').join('|')}|---:|`,
  ...projects.map((p) => {
    const mine = rows.filter((r) => r.project === p);
    return `| ${p} | ${outcomes.map((o) => mine.filter((r) => r.outcome === o).length).join(' | ')} | ${mine.length} |`;
  }),
];
const failed = rows.filter((r) => r.outcome === 'failed' || r.outcome === 'flaky');
if (failed.length) {
  lines.push('', '## Failed or flaky', '', '| Test case | Project | Outcome | First error line |', '|---|---|---|---|');
  for (const r of failed) lines.push(`| ${r.id} | ${r.project} | ${r.outcome} | ${r.error.replaceAll('|', '\\|')} |`);
}
const text = lines.join('\n') + '\n';
writeFileSync(join(root, 'reports', 'loan-product-configuration', 'execution', 'test-summary.md'), text);
console.log(text);
