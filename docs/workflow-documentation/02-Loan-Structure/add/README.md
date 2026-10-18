# Add Loan Product Config - Step 02 - Loan Structure

Test cases for this step (source of truth: `test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx`, sheet `Add Loan Product Config`).

| Test Case ID | Summary | Priority | Requirement | Automation | Playwright spec |
|---|---|---|---|---|---|
| FLOW-LPC-ADD-010 | Valid Loan Structure saves and opens Financial Rules (29%) | Critical | LPC-REQ-010, LPC-REQ-008 | Automated | `tests/ui/loan-product-configuration/02-Loan-Structure/add/FLOW-LPC-ADD-010-complete-loan-structure-valid.spec.ts` |
| FLOW-LPC-ADD-011 | Empty Minimum or Maximum Amount blocks Save & Continue | High | LPC-REQ-010, LPC-REQ-033 | Automated | `tests/ui/loan-product-configuration/02-Loan-Structure/add/FLOW-LPC-ADD-011-loan-structure-required-amounts.spec.ts` |
| FLOW-LPC-ADD-012 | Minimum greater than maximum (amount, months) is rejected | High | LPC-REQ-010 | Automated | `tests/ui/loan-product-configuration/02-Loan-Structure/add/FLOW-LPC-ADD-012-min-greater-than-max-rejected.spec.ts` |
| FLOW-LPC-ADD-013 | Down payment min % above max % or above 100 is rejected | Medium | LPC-REQ-010 | Automated | `tests/ui/loan-product-configuration/02-Loan-Structure/add/FLOW-LPC-ADD-013-down-payment-percentage-range.spec.ts` |
| FLOW-LPC-ADD-014 | Previous from Loan Structure returns to Step 1 with data retained | Medium | LPC-REQ-009 | Automated | `tests/ui/loan-product-configuration/02-Loan-Structure/add/FLOW-LPC-ADD-014-previous-keeps-general-information.spec.ts` |

## Steps and expected results

### FLOW-LPC-ADD-010 - Valid Loan Structure saves and opens Financial Rules (29%)
*Preconditions:* Logged in to staging as a QA maker with Loan Product Configuration access. Step 1 completed.  
*Test data:* Min 10000; Max 1000000; Monthly; 6-12 months; tenor 3; Monthly; down payment 10-50%; limits 5/2/2; guarantor 1-2 First Degree.

1. Complete Step 1. -> **Expected:** Loan Structure In Progress.
2. Fill Loan Structure with the test data. -> **Expected:** Values accepted, amounts formatted with thousands separators.
3. Click Save & Continue. -> **Expected:** Financial Rules opens; Steps 1-2 Completed; 29% Completed.

### FLOW-LPC-ADD-011 - Empty Minimum or Maximum Amount blocks Save & Continue
*Preconditions:* Logged in to staging as a QA maker with Loan Product Configuration access. On Step 2.  
*Test data:* Baseline with Minimum Amount empty, then Maximum Amount empty.

1. Fill baseline Loan Structure, clear Minimum Amount, try Save & Continue. -> **Expected:** Blocked; Step 2 remains.
2. Restore Minimum, clear Maximum Amount, try Save & Continue. -> **Expected:** Blocked; Step 2 remains.

### FLOW-LPC-ADD-012 - Minimum greater than maximum (amount, months) is rejected
*Preconditions:* Logged in to staging as a QA maker with Loan Product Configuration access. On Step 2.  
*Test data:* Min Amount 1000001 / Max 1000000; Min Months 13 / Max 12.

1. Set Minimum Amount above Maximum Amount; Save & Continue. -> **Expected:** Validation error; Step 2 remains.
2. Restore amounts; set Min Months above Max Months; Save & Continue. -> **Expected:** Validation error; Step 2 remains.

### FLOW-LPC-ADD-013 - Down payment min % above max % or above 100 is rejected
*Preconditions:* Logged in to staging as a QA maker with Loan Product Configuration access. On Step 2.  
*Test data:* Min 60 / Max 50; Max 101.

1. Enable Down Payment (Percentage), min 60, max 50; Save & Continue. -> **Expected:** Validation error; Step 2 remains.
2. Set min 10, max 101; Save & Continue. -> **Expected:** Validation error; Step 2 remains.
3. Set min 10, max 100; Save & Continue. -> **Expected:** Accepted; Financial Rules opens.

### FLOW-LPC-ADD-014 - Previous from Loan Structure returns to Step 1 with data retained
*Preconditions:* Logged in to staging as a QA maker with Loan Product Configuration access. Step 1 completed.  
*Test data:* Baseline Step 1 data.

1. Complete Step 1 and open Loan Structure. -> **Expected:** Step 2 shown.
2. Click Previous. -> **Expected:** General Information shown with the saved name and code.
