# Test Report: 16 Oct 2026

**Environment:** staging `https://frontend.aws-stage.flowsky.co`, Chromium, Playwright 1.64.0.

**Command:** `npx playwright test --project=lpc-chromium --project=chromium`

Raw results: `reports/loan-product-configuration/execution/results.json` and `reports/html-report/`.

## Totals

| Suite | Passed | Failed | Skipped | Total |
|---|---:|---:|---:|---:|
| Add wizard (FLOW-LPC-ADD) | 26 | 4 | 12 | 42 |
| Edit wizard (FLOW-LPC-EDIT) | 13 | 6 | 7 | 26 |
| General Product Setup (FS-TC) | 69 | 23 | 10 | 102 |
| Loan Structure (FS-TC, LS-NEW) | 47 | 0 | 24 | 71 |
| Financial Rules (FS-TC, FR-NEW) | 19 | 0 | 51 | 70 |
| **Total** | **174** | **33** | **104** | **311** |

FS-TC-175 failed only because of a network timeout (`net::ERR_TIMED_OUT`) and passed on rerun. Counting the rerun, the totals are **175 passed and 32 failed** (groups A–C below).

**Not run:**
- EDIT-018, EDIT-019, EDIT-020 and EDIT-024. They submit the Edit product for review.
- The Firefox and WebKit projects (2 × 243 tests).

## Why tests failed (33)

None of the failures is a test-script error. The assertions were left unchanged because changing them would hide the findings.

### A. The application accepts input it should reject: possible defects (10)

| Test | Finding |
|---|---|
| FLOW-LPC-ADD-003 | Save & Continue stays enabled when Currency (required) is empty. Gap G-05. |
| FLOW-LPC-ADD-039 | The restricted user (`FLOWSKY_RESTRICTED_EMAIL`) can open the Add page. Either an authorization defect, or the account has the permission. |
| FS-TC-135, FS-TC-301 | A 201-character Product Name is accepted with no validation. |
| FS-TC-137, FS-TC-303 | Special characters and emoji are accepted in Product Name. |
| FS-TC-148, FS-TC-314 | An invalid Product Code (`INVALID`) is accepted. |
| FS-TC-150, FS-TC-316 | Special characters are accepted in Product Code (`MF@001#`). |

**Action:** confirm the rules with the PO, then log defects or update the cases.

### B. The screen differs from the test case: requirement changed or regression (17)

| Test | Expected | Actual on staging |
|---|---|---|
| FS-TC-160–164, FS-TC-326–330 (10) | Target Segment field on General Information | The field no longer exists. |
| FLOW-LPC-ADD-030, ADD-032, EDIT-017 (3) | A "Connect Decision Engine" button and "linked successfully" message | No button. Field mapping appears on selection, and the engine is linked when the product is saved (new gap G-26). |
| FS-TC-143, FS-TC-309 (2) | Placeholder `e.g., MF001, GL001` | `e.g., MF-001, GL-001` |
| FS-TC-157, FS-TC-323 (2) | Product Type defaults to "Business Loan" | No default: shows "Select a product type". |

**Action:** the PO confirms the current design, then the test cases and scripts are updated.

### C. Test data (5)

| Test | Reason |
|---|---|
| FLOW-LPC-EDIT-005, 008, 011, 015, 022 | The change banner (`n fields changed in …`) never appears, because `EDIT_PRODUCT_ID` (563) is a Draft with no approved version. |

**Action:** set `EDIT_PRODUCT_ID` to an approved, QA-owned product.

### D. Environment (1)

| Test | Reason |
|---|---|
| FS-TC-175 | Staging timed out (`net::ERR_TIMED_OUT`). Passed on rerun. |

## Why tests were skipped (104)

Skips are deliberate. Each spec states its reason, and nothing was skipped because of an error.

| Suite | Count | Reason |
|---|---:|---|
| Financial Rules | 51 | The case has no automated scenario yet (the helper skips it with its workbook readiness), or it waits on an open gap (G-02/04/06/08/11/14/15/22/23/24/25/26). |
| Loan Structure | 24 | Needs flows outside the wizard: customer purchase/QR, loan activation, approval lifecycle, audit history. Or waits on an open rule (Q-01/04/06/07/08/11/22/23), or needs another user, API contract or submitted product. |
| Add wizard | 12 | Rule not documented (Candidate: G-04, G-07, G-08, G-09, G-10, G-11). Manual review (UI copy, occupation list, workflow editor link). API endpoint unknown (G-17). Final create/id behaviour (G-03, G-04). |
| General Product Setup | 10 | Duplicate-name/code checks need an existing product and a cleanup plan (4). Refresh/draft persistence is not defined (6). |
| Edit wizard | 7 | Not-found behaviour, discard rules, pending-review rules and concurrency are undocumented (G-15, G-20, G-23). Checker account missing. API endpoint unknown (G-17). Loan data missing (G-24). |

To activate a skipped case once its gap is answered, remove its `test.fixme(...)` or `test.skip(...)` line.

## Fixed in this round

- `tsconfig.json`: VS Code's TypeScript 6.0.3 rejected `moduleResolution: "node"` as deprecated, so it is now `node16`. Type check: 0 errors on TS 6.0.3 and TS 5.9.3.
- FLOW-LPC-ADD-035 activated: the final button is "Save Product" (gap G-03 answered). **Passed.**
- FLOW-LPC-EDIT-003 activated with a real restricted-user login (new `restrictedPage` fixture, `helpers/common/auth.ts`). **Passed.**
- FLOW-LPC-ADD-039 activated the same way. **Failed:** finding A.

## Update: PO decisions (16 Oct 2026)

| Decision | Change | Result |
|---|---|---|
| Target Segment was removed by design | FS-TC-160–164 and FS-TC-326–330 retired: status `Retired` in `source-cases.json` and `automation-coverage.md`, specs removed (kept in `D:\Projects\_backups\Flow-removed-2026-10-16\retired-specs\`), helper branches removed. `npm run validate:links` now fails if a retired case gets a spec again. | 10 fewer tests |
| The decision engine is linked on save (no Connect step) | FLOW-LPC-ADD-030, ADD-032 and EDIT-017 rewritten (specs, workbook rows, step READMEs). Gap G-26 added as resolved; LPC-REQ-021 text updated. Spec files renamed: `…ADD-030-select-decision-engine-shows-field-mapping`, `…EDIT-017-change-decision-engine-shows-field-mapping`. | 3 passed |
| The placeholder is `e.g., MF-001, GL-001` | FS-TC-143 / FS-TC-309 now assert it. | 2 passed |
| Product Type has no default | FS-TC-157 / FS-TC-323 now assert the placeholder "Select a product type". | 2 passed |

### Totals after the update

These counts apply the 7 rerun results to the full run and remove the 10 retired cases:

| | Passed | Failed | Skipped | Total |
|---|---:|---:|---:|---:|
| Before | 174 | 33 | 104 | 311 |
| After | **181** | **16** | **104** | **301** |

FS-TC-175 (a network timeout that passed on rerun) is counted as failed here, as in the original totals.

**Remaining failures:**
- Group A, possible defects (10).
- Group C, test data (5).
- FS-TC-175, network timeout (1).

## Update: skip markers restored (17 Oct 2026)

The 17-Oct reorganization had removed the `test.skip` calls from the step-suite helpers. As a result, 67 blocked or out-of-scope cases reported **passed** without testing anything:
- Financial Rules: 36
- Loan Structure: 21
- General Product Setup: 10

The markers are restored with their original reasons, plus the per-case reasons added on 16 Oct. A rerun of those 67 cases gives 67 skipped, 0 passed, 0 failed.

The same reorganization also removed 3 cases and their specs:
- FR-NEW-014: API replay of Financial Rules limits.
- LS-NEW-023: API replay of the Loan Structure save.
- LS-NEW-024: object-level access.

The Add/Edit cases FLOW-LPC-ADD-040 and FLOW-LPC-EDIT-029 (API rejects missing fields / a changed code) were also removed. They have not been restored. Their originals are in `D:\Projects\_backups\Flow-pre-merge-2026-10-16.tar.gz`.
