# Add Loan Product Config - Step 03 - Financial Rules

Test cases for this step (source of truth: `test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx`, sheet `Add Loan Product Config`).

| Test Case ID | Summary | Priority | Requirement | Automation | Playwright spec |
|---|---|---|---|---|---|
| FLOW-LPC-ADD-015 | Valid Financial Rules saves and opens Eligibility Criteria (43%) | Critical | LPC-REQ-011, LPC-REQ-008 | Automated | `tests/ui/loan-product-configuration/03-Financial-Rules/add/FLOW-LPC-ADD-015-complete-financial-rules-valid.spec.ts` |
| FLOW-LPC-ADD-016 | Financial Rules cannot be saved without a disbursement method | High | LPC-REQ-012 | Automated | `tests/ui/loan-product-configuration/03-Financial-Rules/add/FLOW-LPC-ADD-016-disbursement-method-required.spec.ts` |
| FLOW-LPC-ADD-017 | Empty Interest Rate blocks Save & Continue | High | LPC-REQ-011, LPC-REQ-033 | Automated | `tests/ui/loan-product-configuration/03-Financial-Rules/add/FLOW-LPC-ADD-017-interest-rate-required.spec.ts` |
| FLOW-LPC-ADD-018 | Admin fee percentage accepts 100 and rejects values above 100 | High | LPC-REQ-011 | Automated | `tests/ui/loan-product-configuration/03-Financial-Rules/add/FLOW-LPC-ADD-018-admin-fee-percentage-100-boundary.spec.ts` |
| FLOW-LPC-ADD-019 | Financial Rules saves with every collection-rule toggle off | Medium | LPC-REQ-013 | Automated | `tests/ui/loan-product-configuration/03-Financial-Rules/add/FLOW-LPC-ADD-019-collection-toggles-optional.spec.ts` |
| FLOW-LPC-ADD-020 | With Late Fee on, empty LATE MAXIMUM DAYS blocks save | Medium | LPC-REQ-013 | Automated | `tests/ui/loan-product-configuration/03-Financial-Rules/add/FLOW-LPC-ADD-020-late-fee-maximum-days-required.spec.ts` |

## Steps and expected results

### FLOW-LPC-ADD-015 - Valid Financial Rules saves and opens Eligibility Criteria (43%)
*Preconditions:* Logged in to staging as a QA maker with Loan Product Configuration access. Steps 1-2 completed.  
*Test data:* Interest 10 Flat; fees removed; Mobile Wallet; processing 1 day; collection toggles off.

1. Fill Interest Rate tab. -> **Expected:** Accepted.
2. Fees tab: configure / remove fees. -> **Expected:** Fees List updates; '+ Add New' visible.
3. Disbursement Rules: select Mobile Wallet, processing days 1. -> **Expected:** 'Mobile Wallet' chip under Selected Methods.
4. Collection Rules: turn all toggles off. -> **Expected:** Dependent fields hidden.
5. Click Save & Continue. -> **Expected:** Eligibility Criteria opens; 43% Completed.

### FLOW-LPC-ADD-016 - Financial Rules cannot be saved without a disbursement method
*Preconditions:* Logged in to staging as a QA maker with Loan Product Configuration access. On Step 3.  
*Test data:* No disbursement method selected.

1. Fill Interest Rate, leave Disbursement methods empty. -> **Expected:** Message 'At least one disbursement method is required' shown.
2. Try Save & Continue. -> **Expected:** Step 3 remains.
3. Select Mobile Wallet. -> **Expected:** Message disappears; chip shown.

### FLOW-LPC-ADD-017 - Empty Interest Rate blocks Save & Continue
*Preconditions:* Logged in to staging as a QA maker with Loan Product Configuration access. On Step 3.  
*Test data:* Interest Rate empty; other tabs valid.

1. Fill all Financial Rules except Interest Rate. -> **Expected:** Save & Continue disabled or required error.
2. Try Save & Continue. -> **Expected:** Step 3 remains (defect candidate G-06 if it proceeds).

### FLOW-LPC-ADD-018 - Admin fee percentage accepts 100 and rejects values above 100
*Preconditions:* Logged in to staging as a QA maker with Loan Product Configuration access. On Step 3, Fees tab, Admin fee on.  
*Test data:* 99.99, 100, 100.01, 101

1. Enter 100. -> **Expected:** Accepted, no error.
2. Enter 100.01. -> **Expected:** Error / not accepted.
3. Enter 101. -> **Expected:** Error / not accepted.

### FLOW-LPC-ADD-019 - Financial Rules saves with every collection-rule toggle off
*Preconditions:* Logged in to staging as a QA maker with Loan Product Configuration access. On Step 3.  
*Test data:* Late Fee, Late Installment Rule, Allow Partial Payment, Allow Early Settlement = off.

1. Turn all Collection Rules toggles off. -> **Expected:** Dependent inputs hidden.
2. Save & Continue. -> **Expected:** Eligibility Criteria opens.

### FLOW-LPC-ADD-020 - With Late Fee on, empty LATE MAXIMUM DAYS blocks save
*Preconditions:* Logged in to staging as a QA maker with Loan Product Configuration access. On Step 3.  
*Test data:* Late Fee on, Fixed, One Time, LATE MAXIMUM DAYS empty.

1. Turn Late Fee on and leave LATE MAXIMUM DAYS empty. -> **Expected:** Field marked required.
2. Save & Continue. -> **Expected:** Blocked; Step 3 remains.
