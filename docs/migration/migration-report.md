# Migration Report

Date: 16 Oct 2026. File-by-file detail: [migration-inventory.md](migration-inventory.md).

## 1. Paths

| | Path |
|---|---|
| Source 1 (Flow) | `D:\Projects\Flow` (root files, `tests/`, workbooks) |
| Source 2 (LPC) | `D:\Projects\Flow\FlowSky-Loan-Product-Configuration` |
| Unified project | `D:\Projects\Flow` (built in `Flow\FlowSky-QA-Automation`, then moved to the root, section 11) |
| Backup | `D:\Projects\_backups\Flow-pre-merge-2026-10-16.tar.gz` (both sources, `node_modules` excluded, 400 files) |

Neither source is a Git repository, so there is no branch. Instead, the merge copied the sources into a new folder and left the originals in place.

## 2. What was in each source

| | Flow | LPC |
|---|---|---|
| Specs | 243 step-suite specs (General Product Setup 102, Loan Structure 71, Financial Rules 70) + 2 scaffold examples | 72 wizard specs (Add 42, Edit 30) |
| Test design | One spec per case calling a suite helper (`run…Case(page, testInfo, id)`) with a `switch` per ID; case metadata in `source-cases.json` | One spec per case using fixtures and page objects |
| Config | `playwright.config.js`, chromium/firefox/webkit, parallel, no base URL | `playwright.config.ts`, chromium 1920×1080, `workers: 1`, `globalSetup` login |
| Base URL | `LOAN_PRODUCT_APP_URL` (spec skipped if unset) | `BASE_URL` (default staging) |
| Auth | `PLAYWRIGHT_STORAGE_STATE` recorded by hand with codegen (spec skipped if unset) | `FLOWSKY_EMAIL`/`FLOWSKY_PASSWORD` → `.auth/user.json` |
| Playwright | `^1.64.0` (1.64.0 installed) | `1.56.1` pinned |
| TypeScript | not installed, no tsconfig (specs never type-checked) | 5.9.3, strict |
| Workbooks | 5 `.xlsx` (merchant module, minimum coverage + backup, FS-643-645 scoped, loan structure) | 1 `.xlsx` (Add/Edit, 5 sheets) |

Both sources target the same application. The expired Flow session cookie and the LPC default point at the same origin, `frontend.aws-stage.flowsky.co`.

## 3. Architecture decisions

- **One root project.** One `package.json`, lockfile, `playwright.config.ts` and `tsconfig.json`.
- **Module identity kept.** All Flow and LPC suites cover the Loan Product Configuration wizard, so they share `tests/ui/loan-product-configuration/`. The Add/Edit suite keeps its `add/` and `edit/` step folders unchanged. The Flow suites live under `step-suites/<suite>/` and keep their helpers, `source-cases.json` and `automation-coverage.md` next to the specs, because the helpers load the JSON through `__dirname`.
- **Folder renames only where needed.** The Flow folders with spaces became kebab-case (`Loan Structure` → `loan-structure`). Step folder names and spec file names stayed the same, so no test ID or file name changed.
- **Four Playwright projects** in one config instead of two configs (table in README):
  - `lpc-chromium` keeps the LPC browser, viewport and timeouts.
  - `chromium`/`firefox`/`webkit` keep the Flow browsers and Playwright default timeouts for the step suites.
  - The step-suite project names stay unchanged, because the helpers check `testInfo.project.name === 'chromium'`.
- **`workers: 1` for everything.** The LPC Edit specs mutate one shared record, so this LPC setting applies to the whole run. Flow previously ran in parallel locally. The step-suite specs each create their own draft, so the setting does not change their results, only run time.
- **Target folders not created** because nothing would go in them: `tests/api`, `tests/integration`, `tests/regression`, `helpers/assertions`, `helpers/api`, `test-data/valid|invalid|boundary|configurations`, `docs/architecture|setup|test-strategy`. Neither source has API tests, API clients, or separate data sets: the invalid and boundary values are inline in the specs. Setup and architecture are covered in the README.
- **Fixture file names kept** (`fixtures/index.ts`, `fixtures/global-setup.ts`). Splitting them into `base/authentication/test-data.fixture.ts` would have changed 72 imports for no behaviour change.

## 4. Merged and consolidated

| Item | Result |
|---|---|
| Base URL | One function, `helpers/common/env.ts` → `baseUrl()`: `BASE_URL`, else legacy `LOAN_PRODUCT_APP_URL`, else staging. Used by the config and the 3 suite helpers, which previously each had their own `appOrigin()`. |
| Authentication | One global setup for all projects. If `PLAYWRIGHT_STORAGE_STATE` is set, it is reused (the Flow method). Otherwise the credential login runs (the LPC method). The Flow helpers' per-test `test.skip` on missing env vars was removed, because global setup now fails loudly instead of skipping 243 tests silently. |
| Session path | `.playwright/.auth/loan-product.json` (Flow) and `playwright/.auth/user.json` (LPC) → `.auth/user.json` (ignored). |
| Reports | `playwright-report/` (Flow) and `../execution-results/` (LPC) → `reports/html-report`, `reports/results.json`; artifacts → `test-results/`. |
| `.gitignore`, `.env.example`, CI workflow | Merged (inventory). |

### Duplicates found

| Duplicate | Decision |
|---|---|
| Form helpers: Flow `replaceValue` / `chooseOption` / `setSwitch` (loan-structure helper) vs LPC `BaseForm.fill` / `select` / `setToggle` | **Kept both.** They are not equivalent: `replaceValue` types key by key with `pressSequentially`, while `BaseForm.fill` calls `fill()` and resolves fields by label text. The number-formatting assertions (`'10,000'`) in the Flow suites depend on typing. Merging them would change test behaviour. |
| Draft-product creation: Flow `createDraftProductAtLoanStructure` vs LPC `createDraftProduct` / `advanceAdd` | Kept both, for the same reason (different locator strategies and data). |
| General Product Setup: 51 pairs of Jira cases with the same scenario (FS-TC-131…181 and FS-TC-297…; many titles end in "- Copy") | **Kept both IDs.** They are separate Jira records and the specs differ slightly: FS-TC-299 has an extra assertion that FS-TC-133 does not. Recommend deduplicating in Jira, then deleting the duplicate spec. |
| Workbooks with similar names | Compared by sheet structure and SHA-256: all 6 are different. None was merged or replaced. The 14 Oct backup has a different 16-sheet layout, so it went to `test-cases/superseded/`. |
| Duplicate test IDs across suites | None: 315 specs, 315 unique IDs. |

## 5. Dependencies

| Package | Flow | LPC | Unified | Reason |
|---|---|---|---|---|
| `@playwright/test` | ^1.64.0 | 1.56.1 | **1.64.0** (pinned) | Flow suites were last run on 1.64.0. LPC had never run past login. ADD-015 was run on both versions with the same result (section 7). |
| `typescript` | - | 5.9.3 | 5.9.3 | |
| `@types/node` | ^26.6.5 | 22.10.2 | 22.10.2 | Whole project type-checks with it. |
| `dotenv` | - | 16.4.7 | 16.4.7 | |
| `e2e`, `@e2e-dev/web`, `ai`, `@ai-sdk/openai`, `@ai-sdk/openai-compatible`, `zod` | declared | - | **dropped** | Only used by `e2e.config.ts` and `tests/example.e2e.ts`, a scaffold pointing at `localhost:3000` and a Copilot model. They were never installed in Flow's `node_modules`. Both files are archived. To use the e2e runner again, add these back together with the files. |

Lockfile regenerated by `npm install`; the original LPC lockfile is in `archive/lpc-playwright/`. Browsers: Playwright 1.64.0 uses Chromium build 1248 (already installed). Firefox and WebKit builds were not checked because those projects were not run.

## 6. Paths, imports and documents updated

- 72 LPC specs: 5 relative import targets each (`../../../x` → `../../../../../<new folder>/x`). Also `fixtures/index.ts`, `helpers/navigation/flow.ts`, `pages/loan-product-configuration/StepPages.ts`.
- `financial-rules-suite.helpers.ts`: import `../Loan Structure/…` → `../loan-structure/…`.
- 3 Flow suite helpers: `helpers/common/env.ts` replaces the local `appOrigin()` and `process.env.LOAN_PRODUCT_APP_URL` reads, including the clipboard permission origin.
- 3 `automation-coverage.md` files: commands and session path.
- 17 step READMEs (`docs/workflows`): spec paths.
- LPC workbook: 72 *Notes* cells (inventory). An unchanged copy is in `test-cases/superseded/`.
- Searched the maintained sources for old folder names, `playwright/tests/`, `.playwright/.auth`, absolute Windows paths and hard-coded FlowSky URLs in specs: none left (`npm run validate`). `archive/` and `docs/execution/` keep old paths because they are historical records.

## 7. Validation results

### Static (all passed)

| Check | Result |
|---|---|
| `npm install` | OK, 0 vulnerabilities |
| `npm run test:typecheck` (`tsc --noEmit`, strict) | Exit 0. This is the first type check of the 243 Flow specs, which had no tsconfig before. |
| `npx playwright test --list` | 801 tests in 315 files: `lpc-chromium` 72, `chromium` 243, `firefox` 243, `webkit` 243 |
| Discovery vs sources | Original LPC lists 72 in 72 files. Original Flow `--project=chromium` lists 245 in 244 files: the same 243 plus the 2 archived `example.spec.js` tests. |
| `--grep @smoke` | 11 tests (same as LPC) |
| `npm run validate` | OK |
| `npm run validate:links` | OK: 315 specs, file-name ID = title ID, no duplicates, every LPC ID in the coverage matrix and its step README, every step-suite ID in its `source-cases.json`, and no source case without a spec. |
| LPC workbook | 72 updated paths all exist. Values, styles, filters, freeze panes and column widths are otherwise identical to the original. |

### Functional (staging, chromium, with the user's `.env` credentials)

Global setup logged in and wrote `.auth/user.json`.

| Test | Project | Result | Cause of failure |
|---|---|---|---|
| FLOW-LPC-ADD-001 Add page initial state | lpc-chromium | **Passed** | |
| FLOW-LPC-ADD-002 Valid General Information | lpc-chromium | **Passed** | |
| FLOW-LPC-ADD-010 Valid Loan Structure | lpc-chromium | **Passed** | |
| FLOW-LPC-ADD-015 Valid Financial Rules | lpc-chromium | **Failed** | Locator defect, see D-1 |
| FLOW-LPC-ADD-021 / 027 / 030 | lpc-chromium | **Failed** | Same as D-1: `advanceAdd` fills Financial Rules on the way |
| FLOW-LPC-EDIT-001 Open existing product | lpc-chromium | **Passed** | |
| FLOW-LPC-EDIT-004 Product Code read-only | lpc-chromium | **Passed** | |
| FS-TC-132 Product name placeholder | chromium | **Passed** | |
| FS-TC-157 Default product type "Business Loan" | chromium | **Failed** | Application behaviour, see D-2 |
| FS-TC-1220 Loan Structure sections | chromium | **Passed** | |
| FR-NEW-012 Rounding settings | chromium | **Passed** | |

Totals: 13 run, 8 passed, 5 failed. Not run: the other 63 LPC specs, 239 step-suite specs, and all Firefox/WebKit runs.

**None of the 5 failures was caused by the migration.**

- FS-TC-157 fails the same way in the original Flow project with the same session.
- FLOW-LPC-ADD-015 fails the same way in the original LPC project on Playwright 1.56.1.

The original-project runs wrote their output to the session scratchpad. No assertion was changed.

### Why the full suite was not run

A full run has staging side effects that need the owner's agreement:

- Several hundred draft products would be created, and no cleanup is verified.
- EDIT-018 and EDIT-019 submit `EDIT_PRODUCT_ID` for review.

The representative runs above created about 9 draft products: 7 with `QA-LPC-*` codes (ADD-002, 010, 015 ×2, 021, 027, 030) and 2 with `LS*` codes (FS-TC-1220, FR-NEW-012).

## 8. Remaining defects and blockers

| ID | Type | Description | Affects |
|---|---|---|---|
| D-1 | Script defect (existed before the migration) - **fixed, section 12** | `BaseForm.input('Interest Rate')` used `getByLabel()`, which matched the Financial Rules tab panel (`aria-labelledby` the "Interest Rate" tab) before the input. | Add/Edit specs that pass through Financial Rules |
| D-2 | Possible product defect or outdated expectation | Add Step 1 Product Type shows the placeholder "Select a product type" instead of the default "Business Loan". LPC ADD-001 (which passes) does not assert a Product Type default. Confirm the intended default with the PO, then either log a defect or update FS-TC-157 and its "- Copy" pair (scenario 157). | FS-TC-157 and its duplicate |
| B-1 | Blocker | Draft cleanup is not verified, so a full run leaves many staging drafts. | Full-suite runs |
| B-2 | Blocker | The LPC `test.fixme` cases (12 Candidate, 9 Blocked) wait on the gaps in `test-cases/requirements-gaps/Requirements-Gaps.md`. | 21 LPC cases |
| N-1 | Note | Firefox/WebKit step-suite projects not run. Install their browsers with `npx playwright install firefox webkit`. | 486 tests |
| N-2 | Note | No linter is configured in either source, so no lint script was added. | |
| N-3 | Note | CI workflow not run here. It needs repository secrets `FLOWSKY_EMAIL`, `FLOWSKY_PASSWORD` (+ restricted) and variables `BASE_URL`, `EDIT_PRODUCT_ID`. | CI |

## 9. Source folder changes noticed during the migration

- `Flow/playwright-report/index.html` was overwritten by the FS-TC-157 comparison run (Playwright default output). It was restored from the copy archived before the run and checked byte-identical against the backup.
- `FlowSky-Loan-Product-Configuration/playwright/.auth/user.json` was created by the ADD-015 comparison run, then deleted.
- `FlowSky-Loan-Product-Configuration/execution-results/results.json` and `html-report/` were rewritten at 18:46 by a run of the original LPC config (all 72 skipped). No command in this migration started that run; it may have come from the IDE. They were left as found. The 18:01 version is archived in `archive/execution-history/lpc-2026-10-16/`.
- The LPC `.env` holds the credentials the user entered. It is ignored and was copied into the unified project.

## 10. Excluded on purpose

Workspace editor/agent settings stay in `Flow` (`.claude/skills/e2e`, `.vscode`, `.mcp.json`; copy of `.mcp.json` archived). Also excluded: the expired Flow session cookie, `node_modules`, and the Flow `package-lock.json` (it describes the dropped e2e dependency set).

## 11. Retiring the sources

Done at the user's request (16 Oct 2026). The unified project now lives directly in `D:\Projects\Flow`. Old copies were moved, not deleted, to `D:\Projects\_backups\Flow-removed-2026-10-16\` (permanent deletion was blocked by the tool's safety policy). Details: [migration-inventory.md](migration-inventory.md), last section.

- The empty `Flow\FlowSky-Loan-Product-Configuration` folder is still there because VS Code held it open. Close the `.env` tab from that folder and delete it.
- `.vscode/mcp.json` contains a plain-text Jira API token. It is now in `.gitignore`. Moving the token to an environment variable is recommended.

## 12. Script fixes and Add/Edit runs after consolidation

### Fixes (page objects and helpers only; no assertion changed)

| File | Fix | Cause found on staging |
|---|---|---|
| `pages/loan-product-configuration/BaseForm.ts` `input()` | `getByLabel()` restricted to `input, textarea` | D-1: tab panel matched instead of the Interest Rate input |
| `BaseForm.ts` `clear()` | Select all + Backspace instead of `fill('')` | Formatted amount inputs put `10,000` back after `fill('')` (ADD-011) |
| `BaseForm.ts` `options()` | Waits until the list no longer shows `No ... available` / `Loading` | Options are loaded asynchronously (ADD-007) |
| `StepPages.ts` `DecisionEngineStep.chooseEngine()` | Finds the native `<select>` by its option | Placeholder is `Select decision engine...`, not `Select a decision engine` |
| `StepPages.ts` `connectIfPresent()` + `helpers/navigation/flow.ts` `advanceAdd` | Clicks Connect only if the button exists, otherwise waits for Field Mapping | Staging has no Connect button any more (see G-26) |
| `StepPages.ts` `MerchantsStep.emptyState` | `exact: true` | Strict-mode violation: help sentence also contains the text (ADD-034) |
| `StepPages.ts` `ProductListPage.goto()` | `waitUntil: 'domcontentloaded'` | List page `load` can exceed 30 s |
| `helpers/navigation/flow.ts` `advanceEdit` | Waits until the Edit data reload POST is finished | Edit reloads saved data ~0.5 s after a step opens and resets typed values (EDIT-015) |
| `FLOW-LPC-EDIT-030` spec | Column check via `getByRole('columnheader')`, case-insensitive, same column list | Headers are title case in the DOM; upper case is CSS |

### Results (staging, `lpc-chromium`)

| Suite | Passed | Failed | Skipped (`test.fixme`) | Total |
|---|---:|---:|---:|---:|
| Add (all 42) | 24 (+ ADD-011 on rerun, see below) | 4 | 14 | 42 |
| Edit (26 of 30) | 12 | 6 | 8 | 26 |

Not run: EDIT-018, 019, 020, 024 (they submit `EDIT_PRODUCT_ID` for review). Step suites: not rerun after consolidation (only representatives in section 7).

| Failed | Reason | Type |
|---|---|---|
| FLOW-LPC-ADD-003 | Save & Continue stays enabled with Currency empty | **Product defect G-05** (assertion correct) |
| FLOW-LPC-ADD-011 | `page.goto` timeout in the full run; passed alone and in the earlier rerun | Staging slowness (intermittent) |
| FLOW-LPC-ADD-030, ADD-032, EDIT-017 | Specs click `Connect Decision Engine` and expect `Decision engine linked successfully!`. Staging no longer has that step: mapping appears on selection, text says the engine is linked when the product is saved | **G-26 new gap**: requirement changed or regression. PO to confirm, then update the 3 specs |
| FLOW-LPC-EDIT-005, 008, 011, 015, 022 | Change banner (`n fields changed in <step>`) never appears | **Test data**: `EDIT_PRODUCT_ID` points to a Draft without an approved active version; the banner needs an approved product. Provide such a QA-owned product |

### Staging side effects of these runs

- About 60 more draft products (`QA-LPC-*`) were created by the Add runs and probes.
- `EDIT_PRODUCT_ID` (563) was edited by the Edit specs: name, description, amounts, fees, eligibility, workflow and engine selection. The original LPC README said product 563 belonged to another user in the recording; its current data (code `LS5DC1ED47327B`, automation names) suggests it is an automation draft, but please confirm it is safe to use.
- New observation: the final Step 7 button is `Save Product` (answers G-03; ADD-035 can be activated).

## 13. PO decisions applied (16 Oct 2026)

Target Segment cases retired, the decision engine flow rewritten (G-26 resolved), the Product Code placeholder and the empty Product Type default adopted. Details and results: `docs/execution/Test-Report-2026-10-16.md`, section *Update: PO decisions*.

## 14. LPC seven-step organization (17 Oct 2026)

This section supersedes the earlier folder-layout descriptions in this historical merge report.

- The new [file-by-file inventory](LPC-organization-inventory-2026-10-17.csv) records 418 project paths and their proposed destinations. It records 356 moved files.
- A recoverable ZIP snapshot was created and CRC-verified before the moves. It is stored outside the project under the Copilot session artifact directory; the exact path is on the `Summary` and `Change Log` sheets of `test-cases/loan-product-configuration/LPC-Test-Catalog.xlsx`.
- LPC automation is grouped under `tests/ui/loan-product-configuration/01-General-Information` through `07-Merchants`; cases outside a single wizard step remain under `workflow-level/add|edit`.
- Workflow READMEs are now under `docs/workflow-documentation`. The preserved source workbooks are under `test-cases/loan-product-configuration/source` and `test-cases/merchant-module/source`.
- Coverage, improvement and execution assets are under `reports/loan-product-configuration/{coverage,improvement,execution}`. Historical result files were moved, not regenerated as part of the organization.
- `LPC-Test-Catalog.xlsx` consolidates 322 source/spec records, including 10 retired source cases and 12 supplemental spec-only cases. It contains an executive summary, a workflow inventory, one worksheet per wizard step, workflow-level cases, requirement traceability, the original-to-new path map and a change log. Source records are retained in JSON cells; source workbooks were not edited.
- Playwright now discovers all reorganized step folders and separates LPC IDs from migrated step-suite IDs through project filters. Project names remain unchanged.
- Validation completed: `npm run validate`, `npm run validate:links` and `npm run test:typecheck` pass. Playwright discovery finds 312 unique spec files / 772 project cases (82 LPC and 230 step-suite cases); each of the seven step folders lists independently. The Add, Edit, General Product Setup, Loan Structure and Financial Rules selectors also list the expected 43, 39, 92, 69 and 69 cases. No staging tests were executed during this reorganization; historical execution reports remain unchanged.
