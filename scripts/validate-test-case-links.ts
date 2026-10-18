/**
 * Traceability checks between spec files, Playwright titles and test case sources. Run: npm run validate:links
 * - File name ID == ID in the test title; IDs unique across the project.
 * - FLOW-LPC-*: ID listed in the coverage matrix, and spec path listed in its workflow README.
 * - Step suites: ID present in the suite's source-cases.json (exported from the Flow workbook).
 * The .xlsx workbooks are not parsed here (no spreadsheet dependency); the coverage matrix and step READMEs
 * are the markdown exports of the LPC workbook.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const lpcRoot = 'tests/ui/loan-product-configuration';
const failures: string[] = [];
const fail = (message: string) => failures.push(message);
const read = (file: string) => readFileSync(join(root, file), 'utf8');

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [relative(root, full).replaceAll('\\', '/')];
  });
}

const ID = /^(FLOW-LPC-(?:ADD|EDIT)-(?:\d{3}|S\d{2}[A-Z]?-\d{3})|FS-TC-\d+|FR-NEW-\d+|FR-MC-\d+|LS-NEW-\d+)(?=[-_])/;
const specs = walk(join(root, 'tests')).filter((f) => f.endsWith('.spec.ts'));
const seen = new Map<string, string>();
const coverage = read('reports/loan-product-configuration/coverage/Coverage-Matrix.md');
const workflowReadmes = new Map<string, string>();
const sourceIds = new Map<string, Set<string>>();
const retired = new Map<string, string>();

for (const spec of specs) {
  const id = basename(spec).match(ID)?.[1];
  if (!id) {
    fail(`${spec}: file name does not start with a known test case ID`);
    continue;
  }
  if (seen.has(id)) fail(`Duplicate test case ID ${id}: ${seen.get(id)} and ${spec}`);
  seen.set(id, spec);

  const titles = [...read(spec).matchAll(/\btest\(\s*(['"`])((?:\\.|(?!\1).)*)\1/g)].map((m) => m[2]);
  if (!titles.length) fail(`${spec}: no test() title found`);
  for (const title of titles) if (!title.includes(id)) fail(`${spec}: title "${title.slice(0, 60)}" does not contain ${id}`);

  if (id.startsWith('FLOW-LPC-')) {
    if (!coverage.includes(id)) fail(`${id}: not listed in reports/loan-product-configuration/coverage/Coverage-Matrix.md`);
    const specDir = dirname(spec).replace(`${lpcRoot}/`, '');
    const readme = `docs/workflow-documentation/${specDir}/README.md`;
    if (!workflowReadmes.has(readme)) workflowReadmes.set(readme, existsSync(join(root, readme)) ? read(readme) : '');
    const text = workflowReadmes.get(readme)!;
    if (!text) fail(`${spec}: step README ${readme} is missing`);
    else if (!text.includes(spec)) fail(`${spec}: path not listed in ${readme}`);
  } else {
    const suiteDir = dirname(spec);
    if (!sourceIds.has(suiteDir)) {
      const cases: Record<string, unknown>[] = JSON.parse(read(`${suiteDir}/source-cases.json`));
      // Retired cases stay in the source for traceability but must not have a spec.
      const id = (c: Record<string, unknown>) => String(c.id ?? c['Test Case ID']);
      sourceIds.set(suiteDir, new Set(cases.filter((c) => c.status !== 'Retired').map(id)));
      for (const c of cases.filter((c) => c.status === 'Retired')) retired.set(id(c), suiteDir);
    }
    if (retired.has(id)) fail(`${spec}: ${id} is Retired in ${suiteDir}/source-cases.json; remove the spec`);
    else if (!sourceIds.get(suiteDir)!.has(id)) fail(`${spec}: ${id} not found in ${suiteDir}/source-cases.json`);
  }
}

// Source cases without a spec are reported, not failed: they can be manual or blocked by design.
for (const [suiteDir, ids] of sourceIds) {
  const unscripted = [...ids].filter((id) => !seen.has(id));
  if (unscripted.length) console.log(`${suiteDir}: ${unscripted.length} source case(s) without a spec: ${unscripted.join(', ')}`);
}

if (retired.size) console.log(`Retired source cases (no spec by design): ${[...retired.keys()].join(', ')}`);
const lpc = [...seen.keys()].filter((id) => id.startsWith('FLOW-LPC-')).length;
console.log(`Specs: ${specs.length} (FLOW-LPC: ${lpc}, step suites: ${specs.length - lpc}); unique IDs: ${seen.size}`);
if (failures.length) {
  console.error(`validate-test-case-links: ${failures.length} problem(s)`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log('validate-test-case-links: OK');
