# Financial Rules automation coverage

Source workbook: `Financial Rules_Evnhanced_Test_Cases_14Oct2026.xlsx`, worksheet `Enhanced Test Cases`. The project catalog retains 69 cases after removing the API-focused FR-NEW-014 case from the original 70-case set.

## Environment and commands

Set `LOAN_PRODUCT_APP_URL` and `PLAYWRIGHT_STORAGE_STATE`; do not store credentials in the repository.

```powershell
$env:LOAN_PRODUCT_APP_URL = 'https://frontend.aws-stage.flowsky.co'
$env:PLAYWRIGHT_STORAGE_STATE = '.auth/user.json'
npx playwright test tests/ui/loan-product-configuration/03-Financial-Rules/add --project=chromium --list
npx playwright test tests/ui/loan-product-configuration/03-Financial-Rules/add --project=chromium --reporter=list
```

## Staging execution (15-Oct-2026)

- Full Chromium run: 19 passed, 51 skipped (blocked or not implemented), 0 failed.
- Selectors were verified against product 503 with a read-only DOM dump. Most Step 3 inputs use stable ids (`#interest-rate`, `#processing-days`, `#max-late-days`, `#late-calc-*`, `#balloon-rounding-*`).
- Setup reuses the Loan Structure suite to complete Step 2, then fills the minimum valid Step 3: Interest Rate 25, Flat, Bank Transfer, Processing Days 2, with optional sections switched off.
- FS-TC-3328: staging keeps the formula input on screen and disables it for the non-Formula options; the source case expected it hidden. The test asserts it is not editable.
- FR-NEW-002 is skipped: it needs a product already submitted for review (change banner and Discard changes).
- FR-NEW-016 is marked `test.fail`: known copy defects 'Ballon payment rounding', 'Right Off' and 'principle amount'. Remove the marker once the copy is fixed.
- An expired storage state now fails fast with the refresh command instead of a 30-second timeout.
- Each run creates persistent draft products; no verified cleanup operation is available.

## Scenarios added (16-Oct-2026)

14 Ready cases that run on the Step 3 screen got a scenario in `financial-rules-suite.helpers.ts`. Selectors were verified on staging.

| Case | Result | Note |
|---|---|---|
| FS-TC-3241 | Passed | Uses the default allocation order: changing it needs drag-and-drop. |
| FS-TC-3084 | Passed | |
| FS-TC-5136 | Passed | |
| FS-TC-3065 | Passed | 256-character limit recorded as an annotation (G-08). |
| FS-TC-5163 | Passed | |
| FS-TC-7276 | Passed | |
| FS-TC-7278 | Passed | |
| FS-TC-3245 | Passed | |
| FR-NEW-011 | Passed | The value 0 disables Save & Continue; recorded for G-14. |
| FS-TC-3332 | Passed | `amount / 0` and `amount **` are accepted (recorded, G-11). The script text is stored literally and no script runs. |
| FS-TC-7294 | **Failed: defect** | After save and reopen, Days After Purchase is empty. The save request sends `collection_cycle_type: days_after_purchase` with `collection_cycle_days: [30]`, but the form reads the value from another field. API/DB check of stale values is not covered. |
| FS-TC-7287 | **Failed: same defect** | Same as FS-TC-7294. The option is retained; the value 30 is lost. |
| FS-TC-7284 | **Failed: defect** | Save & Continue stays enabled when the required "Collection days *" is empty. Values 0 and 29 are rejected correctly. |
| FR-NEW-007 | **Failed: defect** | Late Fee on with "Late Maximum Days *" empty does not block Save & Continue. The test stops at the first toggle. |

**Still skipped (36):**
- 23 cases need flows outside Step 3: an approved product, credit account, purchase, loan servicing, or Checker versioning. The skip reason now names what each one needs (`outsideStep3` in the helper).
- 13 cases are Blocked on an open gap. The skip reason names the gap.

## Minimum Coverage cases added (17-Oct-2026)

Six Financial Rules cases from `Flowsky_Minimum_Coverage_Jira_TestCases.xlsx` had no script. They are now `FR-MC-<source number>`. The source row is kept in `Original Test Case ID`.

| Case | Source | Result | Note |
|---|---|---|---|
| FR-MC-008 | FLOW-008 | Passed | Fixed fee 150.50 is kept as entered (GAP-34). |
| FR-MC-010 | FLOW-010 | Passed | Processing Days 0 enables Save & Continue (GAP-35). A 500-character Arabic note reloads. |
| FR-MC-011 | FLOW-011 | Passed | Transfer to Collection After defaults to 0 (GAP-36). |
| FR-MC-012 | FLOW-012 | Passed | An empty formula disables Save & Continue (GAP-37). |
| FR-MC-019 | FLOW-019 | Skipped | Needs an approved product: set `EDIT_PRODUCT_APPROVED=true` with an approved `EDIT_PRODUCT_ID`. It submits the product for review. |
| FR-MC-021 | FLOW-021 | **Failed: defect** | The server-action save stores Admin fee 101%. Early Percentage 8 / Early Settlement available 25 and empty Disbursement Methods are rejected (400, field named). |

## Status summary

- Automated: 12
- Partially Automated: 19
- Blocked: 38

## Case traceability

| Test Case ID | Test Case Title | Automation File | Expected Results Asserted | Status | Notes |
|---|---|---|---|---|---|
| FR-NEW-001 | Save a complete valid Financial Rules configuration and continue to Eligibility Criteria | [FR-NEW-001_fr-new-001.spec.ts](./FR-NEW-001_fr-new-001.spec.ts) | 1. [Step 7] Save & Continue is enabled.<br>2. [Step 8] Step 4 Eligibility Criteria opens; no validation message is shown.<br>3. [Step 9] Step 3 Financial Rules no longer shows 'In  | Automated | Ready |
| FS-TC-3035 | Persist all Financial Rules values after save, reload and re-login | [FS-TC-3035_fs-tc-3035.spec.ts](./FS-TC-3035_fs-tc-3035.spec.ts) | 1. [Step 2] All values, toggles, radios, checkboxes, allocation order and fee rows equal the baseline.<br>2. [Step 3] Save succeeds; Step 4 opens.<br>3. [Step 4] Edited values are  | Automated | Ready |
| FS-TC-5126 | Keep Save & Continue disabled while any required Financial Rules field is empty | [FS-TC-5126_fs-tc-5126.spec.ts](./FS-TC-5126_fs-tc-5126.spec.ts) | 1. [Step 2] Field label shows a red *; Save & Continue is disabled; the wizard stays on Step 3.<br>2. [Step 3] Save & Continue is enabled again.<br>3. [Step 4] Same result for ever | Automated | Ready |
| FS-TC-3348 | Keep entered values when switching between Financial Rules tabs | [FS-TC-3348_fs-tc-3348.spec.ts](./FS-TC-3348_fs-tc-3348.spec.ts) | 1. [Step 3] Interest Rate still shows 25 and every value entered on the other tabs is still shown when each tab is reopened.<br>2. [Step 4] No value is reset, overwritten or lost. | Automated | Ready |
| FR-NEW-002 | Track and discard unsubmitted Financial Rules changes | [FR-NEW-002_fr-new-002.spec.ts](./FR-NEW-002_fr-new-002.spec.ts) | 1. [Step 2] Banner reads '<n> fields changed in ... Financial Rules ... - not yet submitted for review.' with Discard changes and Submit for Review buttons (format per S1).<br>2. [ | Automated | Ready |
| FS-TC-3308 | Save once when Save & Continue is double-clicked | [FS-TC-3308_fs-tc-3308.spec.ts](./FS-TC-3308_fs-tc-3308.spec.ts) | 1. [Step 2] Step 4 opens once; no error.<br>2. [Step 3] Banner counts the change once; one save request is sent (DevTools Network). | Automated | Ready |
| FS-TC-3241 | Keep the allocation order when another Collection Rule is edited | [FS-TC-3241_fs-tc-3241.spec.ts](./FS-TC-3241_fs-tc-3241.spec.ts) | 1. [Step 2] Allocation order is still Loan Amount, Fees, Interest; Minimum Percentage is 60.<br>2. [Step 3] Loan Structure values are unchanged. | Automated | Ready |
| FR-NEW-003 | Save a valid Interest Rate with each Interest Type option | [FR-NEW-003_fr-new-003.spec.ts](./FR-NEW-003_fr-new-003.spec.ts) | 1. [Step 1] Values are accepted; field shows the % suffix.<br>2. [Step 2] Options include Flat and Decreasing and match the confirmed list (G-04).<br>3. [Step 3] Selected option an | Automated | Ready |
| FR-NEW-004 | Reject invalid Interest Rate values | [FR-NEW-004_fr-new-004.spec.ts](./FR-NEW-004_fr-new-004.spec.ts) | 1. [Step 1] Rejected or Save & Continue disabled.<br>2. [Step 2] Letters cannot be entered; malformed number rejected.<br>3. [Step 3] Behaviour matches the confirmed bounds (G-05). | Partially Automated | Ready - 0/100/101 per G-05 |
| FS-TC-7262 | Apply flat interest to a 6-month purchase | [FS-TC-7262_fs-tc-7262.spec.ts](./FS-TC-7262_fs-tc-7262.spec.ts) | 1. [Step 2] Total interest 1,400.00; total repayment 21,400.00; 6 installments of 3,566.67 (last installment absorbs any rounding remainder). | Partially Automated | Ready - formula per existing case; confirm G-04 |
| FS-TC-7263 | Apply decreasing interest to a 6-month purchase | [FS-TC-7263_fs-tc-7263.spec.ts](./FS-TC-7263_fs-tc-7263.spec.ts) | 1. [Step 2] Installment 3,470.76; month-1 interest 233.33; interest falls each month; total interest 824.56 (+/-0.01).<br>2. [Step 3] Schedules differ: Flat interest 1,400.00 vs De | Partially Automated | Ready - formula per existing cases; confirm G-04 |
| FS-TC-7264 | Carry the product Interest Rate and Interest Type to the credit account and loan details | [FS-TC-7264_fs-tc-7264.spec.ts](./FS-TC-7264_fs-tc-7264.spec.ts) | 1. [Step 1] Interest Rate 14% and Interest Type Flat are displayed.<br>2. [Step 2] Loan Details show 14% and Flat. | Automated | Ready |
| FS-TC-7265 | Recalculate interest when the purchase tenor changes | [FS-TC-7265_fs-tc-7265.spec.ts](./FS-TC-7265_fs-tc-7265.spec.ts) | 1. [Step 1] Interest 1,400.00; installment 3,566.67.<br>2. [Step 2] Interest 2,800.00; installment 1,983.33; no value from 6 months remains. | Automated | Ready |
| FS-TC-7266 | Use the purchase amount, not the credit limit, as the interest principal | [FS-TC-7266_fs-tc-7266.spec.ts](./FS-TC-7266_fs-tc-7266.spec.ts) | 1. [Step 2] Total interest 1,400.00 (20,000 base), not 7,000.00 (100,000 base). | Automated | Ready |
| FS-TC-3049 | Show or hide Admin fee settings with the Admin fee toggle | [FS-TC-3049_fs-tc-3049.spec.ts](./FS-TC-3049_fs-tc-3049.spec.ts) | 1. [Step 1] Admin fee fields are hidden; Save & Continue is enabled.<br>2. [Step 2] Basis radios, PERCENTAGE (red *) and COLLECTION TIMING are shown; Save & Continue is disabled.<b | Automated | Ready |
| FS-TC-3310 | Enforce the confirmed Admin fee maximum percentage for each basis | [FS-TC-3310_fs-tc-3310.spec.ts](./FS-TC-3310_fs-tc-3310.spec.ts) | 1. [Step 1] Helper states the confirmed maximum (G-06).<br>2. [Step 2] Values up to the confirmed maximum accepted; the next value above rejected with a message.<br>3. [Step 3] Sam | Blocked | Blocked - awaiting G-06 |
| FS-TC-3053 | Reject negative and non-numeric Admin fee percentages | [FS-TC-3053_fs-tc-3053.spec.ts](./FS-TC-3053_fs-tc-3053.spec.ts) | 1. [Step 1] Rejected or Save & Continue disabled.<br>2. [Step 2] Characters cannot be entered or are rejected. | Automated | Ready |
| FS-TC-3061 | Save each Admin fee Collection Timing option | [FS-TC-3061_fs-tc-3061.spec.ts](./FS-TC-3061_fs-tc-3061.spec.ts) | 1. [Step 1] Exactly the confirmed options are listed (G-07).<br>2. [Step 2] Each selection is retained. | Partially Automated | Ready - option list per G-07 |
| FS-TC-7347 | Collect a principal-based Admin fee upfront in cash with flat interest | [FS-TC-7347_fs-tc-7347.spec.ts](./FS-TC-7347_fs-tc-7347.spec.ts) | 1. [Step 2] Admin fee 1,000.00 shown as upfront; interest 2,800.00; installment 1,900.00; total repayment 22,800.00.<br>2. [Step 3] Sales Person view lists Admin fee, 1,000.00, pay | Automated | Ready |
| FS-TC-7389 | Deduct a total-amount-based Admin fee from disbursement with flat interest | [FS-TC-7389_fs-tc-7389.spec.ts](./FS-TC-7389_fs-tc-7389.spec.ts) | 1. [Step 2] Interest 4,800.00; principal + interest 44,800.00; Admin fee 3,136.00; installment 3,733.33.<br>2. [Step 3] Net disbursement 36,864.00; installments unchanged by the fe | Partially Automated | Ready - 7% subject to G-06 |
| FS-TC-7400 | Finance a total-amount-based Admin fee with flat interest | [FS-TC-7400_fs-tc-7400.spec.ts](./FS-TC-7400_fs-tc-7400.spec.ts) | 1. [Step 2] Admin fee 3,136.00; total repayment 47,936.00; installment 3,994.67.<br>2. [Step 3] Disbursement 40,000.00; no separate upfront fee. | Partially Automated | Ready - financed model per G-22 |
| FS-TC-7350 | Deduct a principal-based Admin fee from disbursement with decreasing interest | [FS-TC-7350_fs-tc-7350.spec.ts](./FS-TC-7350_fs-tc-7350.spec.ts) | 1. [Step 2] Installment 1,795.74; total interest 1,548.91; Admin fee 1,000.00.<br>2. [Step 3] Net disbursement 19,000.00; installments unchanged by the fee. | Automated | Ready |
| FS-TC-7351 | Finance a principal-based Admin fee with decreasing interest | [FS-TC-7351_fs-tc-7351.spec.ts](./FS-TC-7351_fs-tc-7351.spec.ts) | 1. [Step 2] Admin fee 1,000.00. Model A (fee added to repayment): installment 1,879.08. Model B (fee financed and amortised): financed 21,000.00, installment 1,885.53. Expected per | Blocked | Blocked - awaiting G-22 |
| FS-TC-7355 | Collect a total-amount-based Admin fee upfront with decreasing interest | [FS-TC-7355_fs-tc-7355.spec.ts](./FS-TC-7355_fs-tc-7355.spec.ts) | 1. [Step 2] Installment 3,553.95; principal + interest 42,647.42 (42,647.40 if installments are rounded first, G-15); Admin fee 2,985.32.<br>2. [Step 3] Installments stay 3,553.95; | Partially Automated | Ready - 7% subject to G-06 |
| FS-TC-7405 | Charge Admin fee and mixed Fees list items at purchase | [FS-TC-7405_fs-tc-7405.spec.ts](./FS-TC-7405_fs-tc-7405.spec.ts) | 1. [Step 2] Admin 2,800.00; Application 200.00; Insurance 1,600.00; total fees 4,600.00; installment 3,733.33; total payable 49,400.00.<br>2. [Step 3] Each fee appears as its own l | Partially Automated | Ready - fee base and timing per G-08 |
| FS-TC-7374 | Apply each Rounding Direction to a financed Admin fee | [FS-TC-7374_fs-tc-7374.spec.ts](./FS-TC-7374_fs-tc-7374.spec.ts) | 1. [Step 2] Admin fee: Round Up 2,986; Round Down 2,985; Nearest 2,985; Flat 2,985.32 (or per confirmed precision).<br>2. [Step 3] The rounded fee is the value used in the financed | Partially Automated | Ready - option names per G-15 |
| FS-TC-3084 | Add, configure and remove fees in the Fees List | [FS-TC-3084_fs-tc-3084.spec.ts](./FS-TC-3084_fs-tc-3084.spec.ts) | 1. [Step 1] Each fee shows FEE TYPE, FEE METHOD and FEE VALUE (red *) with placeholder 'Enter fixed amount in EGP'.<br>2. [Step 2] A new fee block is added at the end of the list.< | Automated | Ready |
| FS-TC-5136 | List all fee types in the Fee Type dropdown | [FS-TC-5136_fs-tc-5136.spec.ts](./FS-TC-5136_fs-tc-5136.spec.ts) | 1. [Step 1] Options: Application fees, Service fees, Insurance fees, Other. | Automated | Ready |
| FS-TC-3065 | Require and validate the name for fee type Other | [FS-TC-3065_fs-tc-3065.spec.ts](./FS-TC-3065_fs-tc-3065.spec.ts) | 1. [Step 1] OTHER field with red * appears.<br>2. [Step 2] Save & Continue disabled for empty and whitespace-only.<br>3. [Step 3] 'Courier fee' retained.<br>4. [Step 4] Limited or  | Automated | Ready |
| FS-TC-3070 | Confirm the available Fee Methods | [FS-TC-3070_fs-tc-3070.spec.ts](./FS-TC-3070_fs-tc-3070.spec.ts) | 1. [Step 1] Options match the confirmed list (G-08); if Tiered exists, its controls appear only when selected. | Blocked | Blocked - awaiting G-08 |
| FS-TC-5163 | Clear the fee value and apply the 100% limit when switching Fixed to Percentage | [FS-TC-5163_fs-tc-5163.spec.ts](./FS-TC-5163_fs-tc-5163.spec.ts) | 1. [Step 2] Value is cleared; placeholder shows a percentage.<br>2. [Step 3] 100 accepted and saved.<br>3. [Step 4] Rejected or Save & Continue disabled. | Automated | Ready |
| FS-TC-3073 | Reject negative and non-numeric fee values | [FS-TC-3073_fs-tc-3073.spec.ts](./FS-TC-3073_fs-tc-3073.spec.ts) | 1. [Step 1] Rejected.<br>2. [Step 2] Rejected or not enterable.<br>3. [Step 3] Accepted and retained as 10.5, or rejected per confirmed precision (G-08). | Automated | Ready |
| FR-NEW-005 | Apply the confirmed rule to duplicate fee types | [FR-NEW-005_fr-new-005.spec.ts](./FR-NEW-005_fr-new-005.spec.ts) | 1. [Step 2] Behaviour matches the confirmed rule (G-08); record actual. | Blocked | Blocked - awaiting G-08 |
| FS-TC-3087 | Require at least one Disbursement Method | [FS-TC-3087_fs-tc-3087.spec.ts](./FS-TC-3087_fs-tc-3087.spec.ts) | 1. [Step 1] 'At least one disbursement method is required' is shown; Save & Continue disabled.<br>2. [Step 2] Error clears; method appears under 'Selected Methods:'.<br>3. [Step 3] | Automated | Ready |
| FR-NEW-006 | Validate Processing Days and save disbursement notes | [FR-NEW-006_fr-new-006.spec.ts](./FR-NEW-006_fr-new-006.spec.ts) | 1. [Step 1] Accepted.<br>2. [Step 2] Rejected or Save & Continue disabled.<br>3. [Step 3] Per confirmed rule (G-09).<br>4. [Step 4] Notes saved; markup is shown as plain text and n | Partially Automated | Ready - 0 per G-09 |
| FS-TC-7276 | Show the bucket field only for Starting Bucket delinquency mode | [FS-TC-7276_fs-tc-7276.spec.ts](./FS-TC-7276_fs-tc-7276.spec.ts) | 1. [Step 1] Options: Exact Days, Starting Bucket.<br>2. [Step 2] Options: 0-30, 31-60, 61-90, 90+ Days.<br>3. [Step 3] Bucket field hidden; Transfer to Collection After shown.<br>4 | Automated | Ready |
| FS-TC-7294 | Ignore stale settings after changing the delinquency mode or first-installment option | [FS-TC-7294_fs-tc-7294.spec.ts](./FS-TC-7294_fs-tc-7294.spec.ts) | 1. [Step 3] Exact Days 30 and Days After Purchase 30 are shown; no bucket or collection days are stored (verify via API/DB if available). | Automated | Ready |
| FS-TC-7278 | Save each First Installment Status option | [FS-TC-7278_fs-tc-7278.spec.ts](./FS-TC-7278_fs-tc-7278.spec.ts) | 1. [Step 1] Options: Pending, Waived.<br>2. [Step 2] Waived retained.<br>3. [Step 3] Pending retained. | Partially Automated | Ready - schedule effect per G-10 |
| FS-TC-7287 | Show the dependent field for each First Installment Due option | [FS-TC-7287_fs-tc-7287.spec.ts](./FS-TC-7287_fs-tc-7287.spec.ts) | 1. [Step 1] Options: On Disbursement Date, Days After Purchase, Every N Days, Fixed Days of Month.<br>2. [Step 2] 'Days After Purchase' field shown; 30 accepted.<br>3. [Step 3] 'In | Automated | Ready |
| FS-TC-7284 | Validate Collection Days for Fixed Days of Month | [FS-TC-7284_fs-tc-7284.spec.ts](./FS-TC-7284_fs-tc-7284.spec.ts) | 1. [Step 1] Save & Continue disabled.<br>2. [Step 2] Each rejected with a validation message.<br>3. [Step 3] Accepted.<br>4. [Step 4] All four days retained. | Automated | Ready |
| FS-TC-7293 | Record default values on a new product's Financial Rules step | [FS-TC-7293_fs-tc-7293.spec.ts](./FS-TC-7293_fs-tc-7293.spec.ts) | 1. [Step 1] Values match the confirmed defaults (G-26). | Blocked | Blocked - awaiting G-26 |
| FS-TC-3136 | Set the first due date from Days After Purchase | [FS-TC-3136_fs-tc-3136.spec.ts](./FS-TC-3136_fs-tc-3136.spec.ts) | 1. [Step 1] First due date 16-Jan-2026.<br>2. [Step 2] 31-Jan-2026.<br>3. [Step 3] 25-Jan-2026. | Blocked | Blocked - awaiting G-23 |
| FS-TC-3133 | Confirm whether a Collection Cycle drives installment intervals | [FS-TC-3133_fs-tc-3133.spec.ts](./FS-TC-3133_fs-tc-3133.spec.ts) | 1. [Step 1] Presence matches the confirmed design (G-23).<br>2. [Step 2] First due date identical for all cycles; only intervals differ. | Blocked | Blocked - awaiting G-23 |
| FR-NEW-007 | Show or hide Collection Rules fields with their toggles | [FR-NEW-007_fr-new-007.spec.ts](./FR-NEW-007_fr-new-007.spec.ts) | 1. [Step 1] Its fields are hidden and do not block Save & Continue.<br>2. [Step 2] Fields shown; required fields (red *) block Save & Continue.<br>3. [Step 3] Same for all four tog | Automated | Ready |
| FS-TC-3328 | Show the formula field only for the Formula calculation and require it | [FS-TC-3328_fs-tc-3328.spec.ts](./FS-TC-3328_fs-tc-3328.spec.ts) | 1. [Step 1] Options: One Time, Incrementally (Daily), Incrementally (Monthly), Formula (S7).<br>2. [Step 2] 'Add your formula' hidden.<br>3. [Step 3] Field shown and required; Save | Automated | Ready |
| FR-NEW-008 | Validate Late Maximum Days, late-day actions and grace period | [FR-NEW-008_fr-new-008.spec.ts](./FR-NEW-008_fr-new-008.spec.ts) | 1. [Step 1] 90 accepted; -1 and abc rejected.<br>2. [Step 2] Multiple actions can be ticked; Legal unticks independently.<br>3. [Step 3] 90, Right Off + Blacklist, 5 days and Inclu | Automated | Ready |
| FS-TC-3332 | Reject unsafe late fee formulas | [FS-TC-3332_fs-tc-3332.spec.ts](./FS-TC-3332_fs-tc-3332.spec.ts) | 1. [Step 1] Rejected at save, or calculation returns a safe handled result with no crash or infinite value.<br>2. [Step 2] Rejected per confirmed syntax (G-11).<br>3. [Step 3] No s | Automated | Ready |
| FS-TC-3219 | Apply the grace period to a daily late fee with Include Grace Period on and off | [FS-TC-3219_fs-tc-3219.spec.ts](./FS-TC-3219_fs-tc-3219.spec.ts) | 1. [Step 1] Late fee 300.00.<br>2. [Step 2] Late fee 0.00.<br>3. [Step 3] Late fee 200.00 (days 6-7). | Partially Automated | Ready - semantics per existing cases; confirm G-11 |
| FS-TC-3192 | Charge a One Time late fee once regardless of days overdue | [FS-TC-3192_fs-tc-3192.spec.ts](./FS-TC-3192_fs-tc-3192.spec.ts) | 1. [Step 2] Late fee 100.00 charged once. | Partially Automated | Ready - confirm 'Constant' = 'One Time' (G-11) |
| FS-TC-3169 | Apply the confirmed cap to a daily incremental late fee | [FS-TC-3169_fs-tc-3169.spec.ts](./FS-TC-3169_fs-tc-3169.spec.ts) | 1. [Step 2] Fee stops at 9,000.00 (90 days) if Late Maximum Days caps accrual, else 36,500.00, per G-11. | Blocked | Blocked - awaiting G-11 |
| FS-TC-3203 | Run all selected actions when Late Maximum Days is reached | [FS-TC-3203_fs-tc-3203.spec.ts](./FS-TC-3203_fs-tc-3203.spec.ts) | 1. [Step 1] No action executed.<br>2. [Step 2] Write-off, legal referral and blacklist are all recorded for the loan/customer (observable outcome per G-11). | Automated | Ready |
| FS-TC-3205 | Run Maximum Late Days actions only once per overdue installment | [FS-TC-3205_fs-tc-3205.spec.ts](./FS-TC-3205_fs-tc-3205.spec.ts) | 1. [Step 1] No duplicate write-off, legal or blacklist record is created. | Automated | Ready |
| FR-NEW-009 | Configure the Late Installment Rule and payment allocation order | [FR-NEW-009_fr-new-009.spec.ts](./FR-NEW-009_fr-new-009.spec.ts) | 1. [Step 1] 50 accepted; 101 and -1 per confirmed bounds (G-12).<br>2. [Step 2] Only one rule type selected at a time.<br>3. [Step 3] Order Loan Amount, Fees, Interest is retained. | Automated | Ready |
| FS-TC-3242 | Allocate a customer payment in the configured order | [FS-TC-3242_fs-tc-3242.spec.ts](./FS-TC-3242_fs-tc-3242.spec.ts) | 1. [Step 2] Fees 100 settled, interest 200 settled, principal 0 settled; remaining due 1,300.<br>2. [Step 3] Principal 300 settled; fees and interest unchanged. | Automated | Ready |
| FR-NEW-010 | Validate the Allow Partial Payment minimum percentage | [FR-NEW-010_fr-new-010.spec.ts](./FR-NEW-010_fr-new-010.spec.ts) | 1. [Step 1] Save & Continue state matches the confirmed rule (G-13).<br>2. [Step 2] 50 accepted; 101 and -1 rejected or per G-13.<br>3. [Step 3] 50 retained. | Partially Automated | Ready - required status per G-13 |
| FS-TC-3245 | Enforce the Early Percentage range above 0 up to 7% | [FS-TC-3245_fs-tc-3245.spec.ts](./FS-TC-3245_fs-tc-3245.spec.ts) | 1. [Step 1] Accepted.<br>2. [Step 2] Rejected with a validation message.<br>3. [Step 3] Rejected.<br>4. [Step 4] 7 retained. | Automated | Ready |
| FR-NEW-011 | Enforce the 24-installment maximum on Early Settlement Available | [FR-NEW-011_fr-new-011.spec.ts](./FR-NEW-011_fr-new-011.spec.ts) | 1. [Step 1] Accepted.<br>2. [Step 2] Rejected or Save & Continue disabled.<br>3. [Step 3] Per confirmed rule (G-14). | Automated | Ready |
| FS-TC-3258 | Allow early settlement only from the configured installment count | [FS-TC-3258_fs-tc-3258.spec.ts](./FS-TC-3258_fs-tc-3258.spec.ts) | 1. [Step 1] Rejected.<br>2. [Step 2] Rejected.<br>3. [Step 3] Accepted.<br>4. [Step 4] Accepted. | Automated | Ready |
| FS-TC-3252 | Calculate the early settlement fee on principal only | [FS-TC-3252_fs-tc-3252.spec.ts](./FS-TC-3252_fs-tc-3252.spec.ts) | 1. [Step 1] Fee 5,000.00 (not 6,000.00). | Partially Automated | Ready - base per existing cases; confirm G-14 |
| FR-NEW-012 | Save rounding settings | [FR-NEW-012_fr-new-012.spec.ts](./FR-NEW-012_fr-new-012.spec.ts) | 1. [Step 1] Options match the confirmed lists (G-15); defaults observed Round Nearest / Not set / Last Installment.<br>2. [Step 3] Selections retained; only one balloon option sele | Automated | Ready |
| FR-NEW-013 | Place the rounding remainder on the configured balloon installment | [FR-NEW-013_fr-new-013.spec.ts](./FR-NEW-013_fr-new-013.spec.ts) | 1. [Step 2] Installments 3,333 / 3,333 / 3,334; total 10,000.<br>2. [Step 3] Installments 3,334 / 3,333 / 3,333; total 10,000. | Partially Automated | Ready - base 1 EGP per G-15 |
| FS-TC-3040 | Keep existing loan schedules unchanged after a new product version is approved | [FS-TC-3040_fs-tc-3040.spec.ts](./FS-TC-3040_fs-tc-3040.spec.ts) | 1. [Step 2] Every installment, interest amount, fee and due date equals the recorded V1 values. | Automated | Ready |
| FS-TC-3270 | Keep servicing rules of existing loans after a new product version is approved | [FS-TC-3270_fs-tc-3270.spec.ts](./FS-TC-3270_fs-tc-3270.spec.ts) | 1. [Step 1] Late fee follows V1 (100 EGP per day after grace).<br>2. [Step 2] Payment below V1's 50% minimum handled per V1; allocated Fees-Interest-Loan Amount.<br>3. [Step 3] Rej | Automated | Ready |
| FS-TC-3301 | Apply the newly approved version to new loans only after Checker approval | [FS-TC-3301_fs-tc-3301.spec.ts](./FS-TC-3301_fs-tc-3301.spec.ts) | 1. [Step 1] Loan B uses 10% (interest 2,000.00).<br>2. [Step 3] Loan C uses 15% (interest 3,000.00); Loan B unchanged. | Automated | Ready |
| FS-TC-7267 | Confirm which version applies to a new purchase on an existing credit account | [FS-TC-7267_fs-tc-7267.spec.ts](./FS-TC-7267_fs-tc-7267.spec.ts) | 1. [Step 1] Interest type follows the confirmed rule (G-25): Flat 1,400.00 or Decreasing 824.56. | Blocked | Blocked - awaiting G-25 |
| FS-TC-3038 | Confirm how an approved product's Financial Rules can be edited | [FS-TC-3038_fs-tc-3038.spec.ts](./FS-TC-3038_fs-tc-3038.spec.ts) | 1. [Step 2] Per confirmed rule (G-24): read-only, or editable creating a pending version with the change banner. | Blocked | Blocked - awaiting G-24 |
| FR-NEW-015 | Prevent users without edit permission from changing Financial Rules | [FR-NEW-015_fr-new-015.spec.ts](./FR-NEW-015_fr-new-015.spec.ts) | 1. [Step 1] Access denied or read-only view.<br>2. [Step 2] Edit not possible or rejected; values unchanged for an editor. | Blocked | Blocked - role matrix per G-20 |
| FR-NEW-016 | Show correct labels and helper texts on Financial Rules | [FR-NEW-016_fr-new-016.spec.ts](./FR-NEW-016_fr-new-016.spec.ts) | 1. [Step 1] 'Right Off' reads 'Write Off' per approved copy (G-17).<br>2. [Step 2] 'Ballon payment rounding' reads 'Balloon'.<br>3. [Step 3] 'principle' reads 'principal' per appro | Partially Automated | Ready - copy per G-17 |
| FS-TC-5121 | Match the Financial Rules tabs to the approved Figma design | [FS-TC-5121_fs-tc-5121.spec.ts](./FS-TC-5121_fs-tc-5121.spec.ts) | 1. [Step 2] Notes, Selected Methods, Grace Period, Partial Payment field and layout match Figma. | Blocked | Blocked - Figma not supplied (G-02) |
