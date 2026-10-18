/**
 * Static checks for the unified project layout. Run: npm run validate
 * Exit code 1 when any check fails. Never prints .env values.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const failures: string[] = [];
const fail = (message: string) => failures.push(message);
const read = (file: string) => readFileSync(join(root, file), 'utf8');

function walk(dir: string, skip: string[] = []): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const rel = relative(root, full).replaceAll('\\', '/');
    if (skip.some((s) => rel === s || rel.startsWith(`${s}/`))) continue;
    if (statSync(full).isDirectory()) out.push(...walk(full, skip));
    else out.push(rel);
  }
  return out;
}

// 1. Required files.
const required = [
  'README.md', 'package.json', 'package-lock.json', 'playwright.config.ts', 'tsconfig.json', '.gitignore', '.env.example',
  'fixtures/index.ts', 'fixtures/global-setup.ts', 'helpers/common/env.ts',
  'test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx',
  'test-cases/loan-product-configuration/source/Flowsky_Minimum_Coverage_Jira_TestCases.xlsx',
  'test-cases/loan-product-configuration/LPC-Test-Catalog.xlsx',
  'test-cases/merchant-module/source/Flowsky_Merchant_Module_Full_Coverage_2026-10-15.xlsx',
  'reports/loan-product-configuration/coverage/Coverage-Matrix.md',
  'reports/loan-product-configuration/coverage/Workflow-Inventory.md',
  'reports/loan-product-configuration/coverage/Requirements-Gaps.md',
  'docs/migration/migration-inventory.md', 'docs/migration/migration-report.md',
  'docs/migration/LPC-organization-inventory-2026-10-17.csv',
  'reports/.gitkeep',
];
const workflowSteps = [
  '01-General-Information', '02-Loan-Structure', '03-Financial-Rules', '04-Eligibility-Criteria',
  '05-Associated-Workflow', '06-Decision-Engine', '07-Merchants',
];
for (const step of workflowSteps) {
  required.push(`tests/ui/loan-product-configuration/${step}/README.md`);
  required.push(`docs/workflow-documentation/${step}/README.md`);
}
required.push(
  'reports/loan-product-configuration/execution/results.json',
  'reports/loan-product-configuration/execution/Executed-Test-Cases-2026-10-17.xlsx',
);
for (const file of required) if (!existsSync(join(root, file))) fail(`Missing required file: ${file}`);

// 2. package.json and lockfile agree.
const pkg = JSON.parse(read('package.json'));
const lock = JSON.parse(read('package-lock.json'));
const lockDev = lock.packages?.['']?.devDependencies ?? {};
for (const [name, version] of Object.entries<string>(pkg.devDependencies ?? {})) {
  if (lockDev[name] !== version) fail(`package-lock.json devDependency ${name} is ${lockDev[name]}, package.json has ${version}`);
  const installed = join(root, 'node_modules', name, 'package.json');
  if (existsSync(installed)) {
    const actual = JSON.parse(readFileSync(installed, 'utf8')).version;
    if (/^\d/.test(version) && actual !== version) fail(`Installed ${name} ${actual} does not match pinned ${version}`);
  }
}

// 3. Paths used by npm scripts exist.
for (const [name, command] of Object.entries<string>(pkg.scripts ?? {})) {
  for (const p of command.match(/(?:tests|scripts|reports)\/[\w./-]+/g) ?? []) {
    if (p.startsWith('reports/')) continue;
    if (!existsSync(join(root, p))) fail(`npm script "${name}" references missing path ${p}`);
  }
}

// 4. Secrets stay out of version control.
const gitignore = read('.gitignore');
for (const entry of ['.env', '.auth/']) if (!gitignore.split(/\r?\n/).includes(entry)) fail(`.gitignore does not ignore ${entry}`);
const example = read('.env.example');
for (const key of ['FLOWSKY_PASSWORD', 'FLOWSKY_RESTRICTED_PASSWORD']) {
  const value = example.match(new RegExp(`^${key}=(.*)$`, 'm'))?.[1]?.trim() ?? '';
  if (value && value !== 'change-me') fail(`.env.example ${key} must be empty or the placeholder`);
}

// 5. Every spec belongs to a configured project folder.
const specs = walk(join(root, 'tests')).filter((f) => f.endsWith('.spec.ts'));
const supportedSpecPath = /^tests\/ui\/loan-product-configuration\/(?:0[1-7]-[^/]+\/(?:add|edit)|workflow-level\/(?:add|edit))\//;
for (const spec of specs) if (!supportedSpecPath.test(spec)) fail(`Spec outside every Playwright project: ${spec}`);

// 6. Stale references and hard-coded values in maintained sources (editor/agent workspace settings are not project sources).
const sourceFiles = walk(root, ['node_modules', 'reports', 'test-results', '.auth', '.claude', '.vscode', '.mcp.json', 'FlowSky-Loan-Product-Configuration', 'docs/execution', 'docs/migration'])
  .filter((f) => /\.(ts|js|json|md|yml)$/.test(f) && f !== 'package-lock.json' && f !== 'scripts/validate-project.ts');
const stale: [RegExp, string][] = [
  [/FlowSky-Loan-Product-Configuration\//, 'old LPC folder path'],
  [/playwright\/tests\//, 'old LPC tests path'],
  [/tests\/(Financial Rules|Loan Structure|General Product Setup)/, 'old Flow suite folder'],
  [/tests\/ui\/loan-product-configuration\/(?:add|edit|step-suites)\//, 'pre-reorganization LPC test path'],
  [/docs\/workflows\//, 'pre-reorganization workflow documentation path'],
  [/test-cases\/Flowsky_Loan_Product_Configuration_Jira_TestCases\.xlsx/, 'pre-reorganization source workbook path'],
  [/test-cases\/(?:coverage-matrix|workflow-inventory|requirements-gaps)\//, 'pre-reorganization coverage path'],
  [/reports\/(?:results\.json|test-summary\.md)/, 'pre-reorganization execution report path'],
  [/\.playwright\/\.auth/, 'old Flow session path'],
  [/[A-Za-z]:\\\\?(Users|Projects)\\/, 'absolute Windows path'],
];
for (const file of sourceFiles) {
  const text = read(file);
  for (const [pattern, label] of stale) if (pattern.test(text)) fail(`${file}: ${label}`);
  if (file.startsWith('tests/') && file.endsWith('.ts') && /https?:\/\/[\w.-]*flowsky\.co/.test(text)) {
    fail(`${file}: hard-coded FlowSky URL (use baseURL or helpers/common/env.ts)`);
  }
}

console.log(`Specs found: ${specs.length}`);
if (failures.length) {
  console.error(`validate-project: ${failures.length} problem(s)`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log('validate-project: OK');
