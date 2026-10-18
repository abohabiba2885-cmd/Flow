# FlowSky – Loan Product Configuration: Test Coverage Report

**Inputs:** `Executed-Test-Cases-2026-10-17.xlsx` (760 result rows, 300 unique test IDs) compared against the video `2026-10-16_16-34-44.mp4` (3:31).
**Date:** 17 Oct 2026. Full detail is in `FlowSky_Loan_Product_Configuration_Coverage_Report.xlsx`.

## 1. Executive summary

| Metric (combined) | Value |
|---|---|
| Workflow steps identified | 25 (19 assessable + 6 Add steps not shown in the video) |
| Fully covered steps | **11 / 19 (57.9%)** |
| Partially covered steps | 8 |
| Uncovered steps | 0 |
| Unverified steps | 0 (8 individual behaviours were Unverified and excluded) |
| Weighted coverage | **78.9%** |
| Requirements adequately tested | **27 / 43 (62.8%)** (51 identified, 8 Unverified) |
| QA status (review aid) | **Needs Improvement** |

**What these numbers mean:**
- They measure how well the test cases' steps and expected results check the behaviour shown in the video.
- They do not show that the application works.
- The Good / Needs Improvement / Poor labels are a review aid set for this report, not an industry threshold: ≥85% weighted is Good, 60–84.9% is Needs Improvement, and below 60% is Poor.

**Overall:**
- The Edit path is well designed for Steps 1–3, Merchants, Update Product and the change banner.
- Coverage is partial for Eligibility, Associated Workflow and Decision Engine. The Decision Engine "Connect" step has no executed test.
- The video shows only the start of the Add path (list, Add page, Step 1), and none of it is fully covered.

## 2. Coverage by workflow

| Workflow | Assessable steps | Fully covered | Partial | Uncovered | Unverified | Fully covered % | Weighted % | Status |
|---|---|---|---|---|---|---|---|---|
| Add Loan Product Configuration | 3 | 0 | 3 | 0 | 0 | 0.0% | 50.0% | Poor |
| Edit Loan Product Configuration | 16 | 11 | 5 | 0 | 0 | 68.8% | 84.4% | Needs Improvement |
| **Combined** | **19** | **11** | **8** | **0** | **0** | **57.9%** | **78.9%** | **Needs Improvement** |

**Add Steps 2–7: Not Assessed (not shown in the video).** The recording leaves the Add page at 00:18 and opens `/edit/563` at 00:21 without saving Step 1. The Add tests for those steps (FLOW-LPC-ADD-010..041) exist, but the video can't be used to judge them.

## 3. Coverage by workflow step

| Step | Workflow | Step | Timestamp | Status | Main gap |
|---|---|---|---|---|---|
| A1 | Add | Loan Products list | 00:00 | Partial | Filters and pagination are untested |
| A2 | Add | Open Add page | 00:00–00:03 | Partial | No test clicks the "+ Add Loan Product" button; ADD-001 opens the URL directly |
| A3 | Add | Step 1 General Information | 00:03–00:18 | Partial | Required markers and placeholders are title-only evidence; only one of the six Product Type options is asserted |
| E1 | Edit | Open existing product | 00:21 | Covered | – |
| E2 | Edit | Step 1 (code read-only, Save & Continue) | 00:21–00:24 | Covered | – |
| E3 | Edit | Step 2 Loan Structure | 00:24–00:27 | Covered | – |
| E4 | Edit | Interest Rate tab | 00:27; 01:42–01:45 | Covered | – |
| E5 | Edit | Fees tab | 00:30–01:48 | Covered | (100% admin-fee cap: Unverified) |
| E6 | Edit | Disbursement Rules | 00:54–01:57 | Covered | – |
| E7 | Edit | Collection Rules | 00:57–02:12 | Partial | Delinquency Duration Unit and the helper texts are untested |
| E8 | Edit | Rounding | 01:12–01:15 | Covered | – |
| E9 | Edit | Save Financial Rules | 02:09–02:18 | Covered | – |
| E10 | Edit | Eligibility Criteria | 02:15–02:45 | Partial | Whole-number age messages are untested; income, credit score and geographic checks exist only for the Add path |
| E11 | Edit | Associated Workflow | 02:45–02:54 | Partial | No active test checks that Save is disabled until a workflow is selected; card details are checked only in Add |
| E12 | Edit | Decision Engine | 02:54–03:21 | Partial | The Connect step and its success message are not covered; mapping is tested only in Add |
| E13 | Edit | Merchants | 03:21 | Covered | – |
| E14 | Edit | Update Product | 03:24–03:27 | Covered | – |
| E15 | Edit | Change banner | 00:21–03:24 | Covered | (Discard / Submit for Review: Unverified) |
| E16 | Edit | List after update | 03:30 | Partial | The "With Workflows" counter (44→45) and the Last Activity user/role are untested |

## 4. Add vs. Edit

**Differences seen in the video:**
- Add: "Create New Loan Product", 0% completed, Product Code / ID editable.
- Edit:
  - "Edit Loan Product", "Saved as draft", and Product Code / ID read-only.
  - A change banner with Discard changes / Submit for Review.
  - "Update Product" as the final action, which sets the product to PENDING REVIEW.

**How tested each path is:**
- Edit has good designed coverage. The Loan Structure and Financial Rules suites run against a product opened for editing.
- Most Add tests cover screens that the video shows only in Edit. Under this report's rules, a test on one path is not counted for the other.
- Add can't be judged beyond Step 1 until there is a recording of a complete Add flow.

## 5. Top five coverage gaps

1. **Decision Engine connect step (VR-41, VR-42; 02:57–03:03).**
   - The video shows "Loading decision engine schema...", then "Connect Decision Engine", then "Decision engine linked successfully!".
   - The executed ADD-030 and EDIT-017 were rewritten as "...without a connect step".
   - Confirm which UI is current, then align the tests.
2. **Eligibility validation in Edit (VR-30–VR-34; 02:15–02:42).**
   - No test checks "Minimum/Maximum age accepts whole numbers only.".
   - The income and credit-score required checks and the geographic cascade are tested only for the Add path.
   - Credit score 0 keeps Save disabled at 02:41, but ADD-024 is skipped and its skip reason is outdated.
3. **Add entry and Step 1 detail (VR-01–VR-04).**
   - No test clicks "+ Add Loan Product".
   - The list filters and pagination are untested.
   - Required markers and placeholders are covered only by General Product Setup tests whose steps weren't provided.
   - Only "Business Loan" is asserted from the Product Type list.
4. **Workflow selection is required but not asserted (VR-38; 02:48–02:51).**
   - Save & Continue stays disabled until a workflow is chosen.
   - ADD-028's expected result is hedged and the test was skipped. There is no Edit equivalent.
5. **List after update (VR-51; 03:30).**
   - The "With Workflows" counter (44→45) and the Last Activity entry are untested.
   - The Last Activity entry shows the role "Checker" for a maker's update, which should be confirmed.

**Also observed (covered, but needs action):**
- **Currency defect (VR-06, 00:12–00:18):** Save & Continue is enabled while the required Currency is empty. FLOW-LPC-ADD-003 failed for exactly this reason in the 17-Oct run. Log it as a defect.
- **Change-banner failures:** five Edit tests (EDIT-005, -008, -011, -015, -022) failed only because the banner wasn't found. The banner is visible throughout the video, so check the locator or test data before treating these as product defects.

## 6. Recommended next actions

1. Log the Currency defect and keep FLOW-LPC-ADD-003 as its regression test.
2. Confirm the Decision Engine UI, and restore the Connect / success-message assertions if Connect still exists.
3. Add Edit-path cases for Eligibility:
   - whole-number messages for both age fields
   - income and credit-score required checks
   - credit score 0 blocked
   - the geographic cascade
4. Update ADD-028 to expect a disabled button when no workflow is selected, activate it, and add the same check for Edit.
5. Close the outdated gaps G-06 and G-07, and update ADD-024's expected result.
6. Investigate the five banner failures (traces, locator, whether the product had pending changes).
7. Remove the duplicate General Product Setup set (FS-TC-297..347). Export test steps and expected results alongside the execution results.
8. Record a complete Add flow (Steps 1–7 and the final action) so the Add path can be assessed.

## 7. Limitations and assumptions

**Video:**
- I sampled the video every 3 s and rechecked key moments at 1-s resolution, so timestamps are accurate to about ±3 s.
- The audio wasn't used.

**Test steps:**
- The executed Excel has no Test Steps or Expected Results columns.
- I took steps from the design workbooks, matched by Test Case ID: the FLOW-LPC workbook, the Loan Structure and Financial Rules AIO imports, and the AIO exports supplied earlier.
- The 92 General Product Setup IDs (46 unique tests) have no steps in any file supplied, so they are used only as supporting evidence.

**Tests that differ from their design record:**
- ADD-030 and EDIT-017 were retitled.
- ADD-035, ADD-039 and EDIT-003 were executed although they were designed as skipped (`test.fixme`).
- I didn't assume the design steps describe what actually ran for these five tests.

**Exclusions:**
- FLOW-LPC-ADD-040 and EDIT-029 are not in the executed file and are excluded.
- 159 executed tests cover behaviour the video doesn't show (loan calculations, versioning, permissions, concurrency). They are listed as not counted; this is not a judgement on their value.

**Execution results:** Pass/fail results are shown for information only. Coverage is based on test design.

**Corrections to my earlier analysis (16-Oct):** Rechecking the frames showed that an empty Interest Rate (01:42) and a credit score of 0 (02:41) both keep Save & Continue disabled. The earlier gaps G-06 and G-07 were misreadings. The video also shows that workflow selection is required, which answers G-09.
