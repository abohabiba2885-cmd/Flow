# FlowSky QA Automation

Playwright (TypeScript) automation, Jira-compatible test case workbooks and traceability for FlowSky **Loan Product Configuration** on staging (`https://frontend.aws-stage.flowsky.co`).

This project merges two earlier folders (see [docs/migration/migration-report.md](docs/migration/migration-report.md)):

- `FlowSky-Loan-Product-Configuration`: 7-step Add/Edit wizard suite, IDs `FLOW-LPC-ADD-nnn` / `FLOW-LPC-EDIT-nnn`.
- `Flow`: step suites for General Product Setup, Loan Structure and Financial Rules, IDs `FS-TC-nnn`, `FR-NEW-nnn`, `LS-NEW-nnn`, plus the merchant-module and minimum-coverage workbooks.

| Suite | Specs | Playwright project(s) | Test case source |
|---|---:|---|---|
| Add wizard (`FLOW-LPC-ADD-*`) | 43 | `lpc-chromium` | `test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx` + 2 supplemental cases |
| Edit wizard (`FLOW-LPC-EDIT-*`) | 39 | `lpc-chromium` | same workbook + 10 supplemental cases |
| General Product Setup (`FS-TC-*`) | 92 | `chromium`, `firefox`, `webkit` | `tests/ui/loan-product-configuration/01-General-Information/add/source-cases.json` |
| Loan Structure (`FS-TC-*`, `LS-NEW-*`) | 69 | `chromium`, `firefox`, `webkit` | `tests/ui/loan-product-configuration/02-Loan-Structure/add/source-cases.json` |
| Financial Rules (`FS-TC-*`, `FR-NEW-*`) | 69 | `chromium`, `firefox`, `webkit` | `tests/ui/loan-product-configuration/03-Financial-Rules/add/source-cases.json` |

## Structure

```text
Flow/
├── playwright.config.ts        one config, 4 projects (see below)
├── package.json / package-lock.json / tsconfig.json / .env.example
├── fixtures/                   index.ts (wizard, steps, editProductId, createDraftProduct, apiLog), global-setup.ts (auth)
├── pages/loan-product-configuration/   BaseForm, LoanProductWizardPage, StepPages
├── helpers/
│   ├── common/env.ts           base URL and session path (single source of truth)
│   ├── navigation/flow.ts      advanceAdd / advanceEdit
│   └── data/calc.ts            completion %, interest formulas
├── test-data/loan-product-configuration/   baseline.ts (observed values), types.ts
├── tests/ui/loan-product-configuration/
│   ├── 01-General-Information/ … 07-Merchants/   Add/Edit specs grouped by wizard step
│   └── workflow-level/add|edit/   product-list, open-existing and cross-cutting specs
├── test-cases/
│   ├── loan-product-configuration/source/   preserved source workbooks
│   ├── loan-product-configuration/LPC-Test-Catalog.xlsx   consolidated 7-step catalog and path mapping
│   └── merchant-module/source/   preserved merchant source workbooks
├── docs/
│   ├── workflow-documentation/   step and workflow README files
│   └── migration/                inventory, backup notes and migration report
├── scripts/                    validate-project.ts, validate-test-case-links.ts, generate-test-summary.ts
├── reports/loan-product-configuration/{coverage,improvement,execution}/
└── test-results/               generated: traces, screenshots, videos of failed tests
```

## Setup

Requirements: Node.js 22.18+ (scripts use built-in TypeScript type stripping; Node 24 verified), npm, network access to staging.

```bash
npm ci
npx playwright install chromium        # add firefox webkit for the cross-browser step-suite projects
cp .env.example .env                   # then fill in values (never commit .env)
```

### Environment variables (`.env`)

| Variable | Required | Purpose |
|---|---|---|
| `BASE_URL` | no (defaults to staging) | Application origin for every project. |
| `FLOWSKY_EMAIL`, `FLOWSKY_PASSWORD` | yes, unless `PLAYWRIGHT_STORAGE_STATE` is set | QA maker account. Global setup logs in once and writes `.auth/user.json`. |
| `PLAYWRIGHT_STORAGE_STATE` | no | Pre-recorded session file. When set, the credential login is skipped. Record with `npx playwright codegen --save-storage=.auth/user.json <BASE_URL>/login`. |
| `EDIT_PRODUCT_ID` | for Edit specs | Dedicated QA-owned product id. Edit specs change it. |
| `FLOWSKY_RESTRICTED_EMAIL`, `FLOWSKY_RESTRICTED_PASSWORD` | no | User without product-config permission (ADD-039, EDIT-003). |
| `TEST_PRODUCT_PREFIX` | no (default `QA-LPC`) | Prefix for products created by Add specs. |
| `LOAN_PRODUCT_APP_URL` | no | Legacy alias for `BASE_URL` from the Flow step suites. `BASE_URL` wins when both are set. |

Global setup fails with a clear message when no credentials and no session are available. Values are never printed.

## Commands

| Command | What it runs |
|---|---|
| `npm test` | All projects (82 LPC + 3 × 230 step-suite cases = 772 project cases). |
| `npm run test:lpc` | Add + Edit wizard suite (`lpc-chromium`, 82 cases). |
| `npm run test:add` / `npm run test:edit` | Add only / Edit only. |
| `npm run test:smoke` | 11 `@smoke` cases. |
| `npm run test:step-suites` | All step suites on Chromium. |
| `npm run test:step-suites:all-browsers` | Step suites on Chromium, Firefox and WebKit (original Flow setting). |
| `npm run test:general-product-setup` / `test:loan-structure` / `test:financial-rules` | One step suite on Chromium. |
| `npx playwright test --grep FLOW-LPC-ADD-018` | One test case by ID (works for every ID scheme). |
| `npx playwright test --grep @step-03` | One wizard step (LPC tags: `@add`/`@edit`, `@step-NN`, priority, `@smoke`). |
| `npm run test:headed` / `npm run test:ui` | Headed / UI mode. |
| `npm run test:list` | Discovery only (no login). |
| `npm run test:typecheck` | `tsc --noEmit`. |
| `npm run validate` | Layout, lockfile, script paths, secrets hygiene, stale paths, hard-coded URLs. |
| `npm run validate:links` | ID ↔ file name ↔ test title ↔ coverage matrix / step README / source-cases.json. |
| `npm run summary` | Summarises `reports/loan-product-configuration/execution/results.json` into the execution folder. |
| `npm run test:report` | Opens `reports/loan-product-configuration/execution/html-report`. |

No linter is configured in either source project, so there is no lint script.

## Playwright projects

| Project | Specs | Browser | Timeouts |
|---|---|---|---|
| `lpc-chromium` | all wizard step and workflow-level folders; grep `FLOW-LPC-*` | Chromium 1920×1080 | test 90 s, expect 10 s, action 15 s, navigation 30 s |
| `chromium`, `firefox`, `webkit` | all step folders; grep `FS-TC-*`, `FR-NEW-*`, `LS-NEW-*` | Desktop Chrome / Firefox / Safari | test 30 s, expect 5 s (original Flow values; specs call `test.slow()`) |

Shared: `workers: 1`, `fullyParallel: false` (Edit specs mutate one record), `retries: 1` on CI only, trace/screenshot/video kept on failure. The step-suite project names must stay `chromium`/`firefox`/`webkit`: the suite helpers check `testInfo.project.name` for clipboard cases.

## Traceability

| Test case | Spec file | Title | Folder | Requirement |
|---|---|---|---|---|
| `FLOW-LPC-ADD-018` | `tests/ui/loan-product-configuration/03-Financial-Rules/add/FLOW-LPC-ADD-018-*.spec.ts` | starts with the ID | Excel column *Workflow Step* | Excel *Requirement / Story* column, `reports/loan-product-configuration/coverage/Coverage-Matrix.md` |
| `FR-NEW-001` | `tests/ui/loan-product-configuration/03-Financial-Rules/add/FR-NEW-001_*.spec.ts` | starts with the ID | Step 3 folder | `source-cases.json` (*Requirement ID*), `automation-coverage.md` |

Current reports are written to `reports/loan-product-configuration/execution/`; historical reports remain unchanged. `npm run validate:links` checks IDs, spec paths, workflow READMEs and source case records.

## Data side effects (staging only, never production)

- Add specs and step-suite specs create draft products (`QA-LPC-*`, `LS*` codes). No cleanup action is verified yet.
- Edit specs leave pending changes on `EDIT_PRODUCT_ID`. EDIT-018 and EDIT-019 submit it for review (status PENDING REVIEW).

## Known issues

See the *Remaining defects and blockers* section of [docs/migration/migration-report.md](docs/migration/migration-report.md) and the gap list in `reports/loan-product-configuration/coverage/Requirements-Gaps.md`.
#   F l o w  
 