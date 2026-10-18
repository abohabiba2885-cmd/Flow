# FlowSky – Loan Product Configuration: Updated Coverage Report (17 Oct 2026, improvement pass)

**What was compared:** the improved test set against the video `2026-10-16_16-34-44.mp4`.

**Inputs:**
- `Executed-Test-Cases-2026-10-17.xlsx`
- the design workbooks
- the previous report, `Coverage_Report_17Oct2026/FlowSky_Loan_Product_Configuration_Coverage_Report.*`

**Files left unchanged:** the original Excel file, the video and the previous report. All new outputs are in `Improved_Test_Cases_17Oct2026/`.

## 1. Result

| Metric | Previous (17-Oct report) | Now | Gain |
|---|---|---|---|
| A – Fully covered steps | 11 / 19 (57.9%) | **19 / 19 (100%)** | +42.1 pp |
| B – Weighted step coverage | 78.9% | **100%** | +21.1 pp |
| C – Requirement coverage | 27 / 43 (62.8%) | **43 / 43 (100%)** | +37.2 pp |
| D – Coverage items | 42 / 78 (53.8%)* | **78 / 78 (100%)** | +46.2 pp |
| Add workflow (weighted) | 50.0% (3 steps) | **100%** | +50.0 pp |
| Edit workflow (weighted) | 84.4% (16 steps) | **100%** | +15.6 pp |

\*Coverage items are new in this version. The previous D value is measured with the tests that counted in the 17-Oct report.

**Is the comparison fair?** Yes. The denominators and scoring rules match the previous report: 19 assessable steps, 43 assessable requirements, and the same Covered = 1 / Partially Covered = 0.5 / Not Covered = 0 scoring.

**Did coverage reach 100%?** Yes, for the defined, assessable steps, requirements and coverage items, with three disclosed limits:
1. **Unverified requirements (8):** excluded because the video doesn't show what should happen.
2. **Add Steps 2–7 (6 steps):** Not Assessed, because the video leaves the Add flow at 00:18.
3. **Not yet executed:** the 12 new and 6 improved test cases haven't been run.

This is coverage of the test design, not proof that the application has no defects.

## 2. Steps that reached full coverage (8)

| Step | Previous gap | Closed by |
|---|---|---|
| LPC-ADD-STEP-00A Product list | Filters and pagination untested | FLOW-LPC-ADD-S00A-001 (new) |
| LPC-ADD-STEP-00B Open Add page | List button never clicked | FLOW-LPC-ADD-001 (improved) |
| LPC-ADD-STEP-01 General Information | Required markers, placeholders, Product Type list | FLOW-LPC-ADD-S01-001 (new), FLOW-LPC-ADD-007 (improved) |
| LPC-EDIT-STEP-03D Collection Rules | Delinquency Duration Unit, helper texts | FLOW-LPC-EDIT-S03D-001 (new) |
| LPC-EDIT-STEP-04 Eligibility | Age messages; income, credit score and geographic checks (Edit path) | FLOW-LPC-EDIT-S04-001 to -004 (new) |
| LPC-EDIT-STEP-05 Associated Workflow | Card details; Save disabled until a workflow is selected | FLOW-LPC-EDIT-S05-001, -002 (new) |
| LPC-EDIT-STEP-06 Decision Engine | Connect step, success message, mapping details | FLOW-LPC-EDIT-017 (improved), FLOW-LPC-EDIT-S06-001, -002 (new) |
| LPC-EDIT-STEP-10 List after update | "With Workflows" counter, Last Activity | FLOW-LPC-EDIT-S10-001 (new) |

The other 11 Edit steps were already fully covered and remain so.

## 3. Test cases added, improved or flagged

**Totals:** 314 test cases.
- 296 existing, kept with their original IDs.
- 6 improved.
- 12 new.
- 60 count toward video coverage.

**Improved (6):**
- **FLOW-LPC-ADD-001:** now starts on the list and clicks "+ Add Loan Product".
- **FLOW-LPC-ADD-007:** asserts all six Product Type options visible in the video.
- **FLOW-LPC-ADD-024:** expected result corrected; credit score 0 keeps Save disabled.
- **FLOW-LPC-ADD-028:** expected result corrected; Save is disabled until a workflow is selected.
- **FLOW-LPC-ADD-030 and FLOW-LPC-EDIT-017:** the Connect Decision Engine step and its success message are restored, as shown in the video.

**New (12):**
- **Add path:** ADD-S00A-001, ADD-S01-001.
- **Edit path:**
  - EDIT-S03D-001
  - EDIT-S04-001 to EDIT-S04-004
  - EDIT-S05-001, EDIT-S05-002
  - EDIT-S06-001, EDIT-S06-002
  - EDIT-S10-001

All new IDs were checked against every workbook and the executed results; they are unique.

**Flagged:**
- **46 duplicates:** FS-TC-297..347 repeat FS-TC-131..181 (recommend removing them).
- **46 title-only cases:** General Product Setup tests with no steps in any file.
- **65 hedged expectations:** expected results that say "confirmed rule", "G-xx" or "record actual".
- **5 banner execution failures:** EDIT-005, -008, -011, -015 and -022.
- **3 spec drifts:** ADD-035, ADD-039 and EDIT-003 ran in a form that differs from their design record.

## 4. Workbook structure

**8 control sheets:**
1. Executive Summary
2. Workflow Inventory
3. Coverage Dashboard (with two charts)
4. Coverage Gaps
5. Test Case Mapping
6. Requirements Traceability
7. Change Log
8. Calculation Details

**25 step sheets**, one per workflow step:
- `ADD_S00A_Product_List`
- `ADD_S00B_Open_Add_Page`
- `ADD_S01_General_Info`
- `ADD_S02`–`ADD_S07`: Not Assessed, with their existing tests kept for traceability
- `EDIT_S00_Open_Product` through `EDIT_S10_List_After_Update`

**Row layout:**
- Each row is one test step with its own expected result: 667 rows in total, none missing an expected result.
- Some existing cases list an expected result only for certain steps. In those cases I grouped the preceding actions with the step that has the result (Step No. shows a range, e.g. "1-6").

**Formulas:**
- Every metric is a formula that rolls up from the coverage items in `Requirements Traceability`.
- Recalculation found 0 formula errors.

## 5. Remaining gaps and unverified requirements

**Unverified requirements (excluded from the calculation):**

| Requirement | Behaviour | Blocker |
|---|---|---|
| VR-07 | Cancel on Add Step 1 | Not clicked in the video (OQ-02) |
| VR-08 | Add Step 1 save outcome | The video jumps to Edit without saving (OQ-03) |
| VR-20 | Admin fee 100% cap | Only the helper text is shown (OQ-04) |
| VR-33 | Occupation rules | Not exercised (OQ-05) |
| VR-39 | Edit Workflow link | Not clicked (OQ-06) |
| VR-40 | Whether a decision engine is mandatory | Rule not stated (OQ-07) |
| VR-45 | Whether unmapped required fields block | Rule not stated (OQ-08) |
| VR-50 | Discard changes / Submit for Review | Not clicked (OQ-09) |

**Not Assessed:** Add Steps 2–7 and the final Add action (OQ-01). Recording a complete Add flow would let these be assessed.

**Open questions that affect the new tests:**
- **OQ-10, Connect step:** the executed ADD-030 / EDIT-017 say "without a connect step", but the video shows it. Confirm the current UI before automating.
- **OQ-11:** exact credit score bounds.
- **OQ-14:** the Last Activity role label ("Checker" is shown for a maker).
- **OQ-15:** the other Delinquency Duration Unit options.
- **OQ-19:** steps for the General Product Setup tests, and governorate data on staging.

**Defect candidate:** Save & Continue is enabled while Currency is empty (00:12–00:18). FLOW-LPC-ADD-003 failed on 17 Oct for this reason (OQ-20).

## 6. Next actions

1. Log the Currency defect.
2. Confirm OQ-10, then automate the improved EDIT-017 and the new cases. The proposed spec paths are in `Test Case Mapping`.
3. Update the existing specs for ADD-001, -007, -024, -028 and -030, and remove the `test.fixme` from ADD-024 and ADD-028.
4. Investigate the five banner failures.
5. Remove the duplicate set FS-TC-297..347.
6. Record a full Add flow and resolve OQ-02 to OQ-09. Then turn the 8 Unverified requirements and 6 Not Assessed steps into assessable items and re-run the coverage calculation.

## 7. Assumptions and limitations

- **Timestamps:** taken from frames sampled every 3 s and rechecked at 1 s, so accurate to about ±3 s.
- **Workflow paths:** Add and Edit are assessed separately. A test run in the Add flow never counts toward an Edit step, and vice versa.
- **Shared steps:** some cases cover items on two steps (e.g. FS-TC-5126). Each case sits on one primary sheet, and its Notes list the other steps it covers.
- **Inferred results:** expected results that are inferred, not observed, are marked "CLARIFY". For example, decimal ages being rejected is inferred from the message "accepts whole numbers only".
