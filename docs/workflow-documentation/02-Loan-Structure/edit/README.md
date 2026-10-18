# Edit Loan Product Config - Step 02 - Loan Structure

Test cases for this step (source of truth: `test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx`, sheet `Edit Loan Product Config`).

| Test Case ID | Summary | Priority | Requirement | Automation | Playwright spec |
|---|---|---|---|---|---|
| FLOW-LPC-EDIT-008 | Updating the amount range saves and lists Loan Structure in the banner | High | LPC-REQ-010, LPC-REQ-026 | Automated | `tests/ui/loan-product-configuration/02-Loan-Structure/edit/FLOW-LPC-EDIT-008-update-amount-range.spec.ts` |
| FLOW-LPC-EDIT-009 | Minimum amount above maximum is rejected in Edit | High | LPC-REQ-010 | Automated | `tests/ui/loan-product-configuration/02-Loan-Structure/edit/FLOW-LPC-EDIT-009-invalid-range-in-edit.spec.ts` |
| FLOW-LPC-EDIT-010 | Saving one step leaves other steps' values unchanged | Medium | LPC-REQ-008 | Automated | `tests/ui/loan-product-configuration/02-Loan-Structure/edit/FLOW-LPC-EDIT-010-untouched-fields-preserved.spec.ts` |

## Steps and expected results

### FLOW-LPC-EDIT-008 - Updating the amount range saves and lists Loan Structure in the banner
*Preconditions:* Logged in as QA maker; EDIT_PRODUCT_ID points to a QA-owned product with Steps 1-7 valid (not product 563).  
*Test data:* Min 10000; Max 900000.

1. Open Loan Structure and change Maximum Amount. -> **Expected:** Accepted.
2. Save & Continue. -> **Expected:** Financial Rules opens; banner includes 'Loan Structure'.

### FLOW-LPC-EDIT-009 - Minimum amount above maximum is rejected in Edit
*Preconditions:* Logged in as QA maker; EDIT_PRODUCT_ID points to a QA-owned product with Steps 1-7 valid (not product 563).  
*Test data:* Min 2000000; Max 1000000.

1. Set Minimum above Maximum; Save & Continue. -> **Expected:** Validation error; Step 2 remains.

### FLOW-LPC-EDIT-010 - Saving one step leaves other steps' values unchanged
*Preconditions:* Logged in as QA maker; EDIT_PRODUCT_ID points to a QA-owned product with Steps 1-7 valid (not product 563).  
*Test data:* Read current Minimum/Maximum Amount.

1. Record Loan Structure values. -> **Expected:** Values captured.
2. Change only Product Description and Save & Continue. -> **Expected:** Loan Structure opens.
3. Compare Loan Structure values. -> **Expected:** Identical to recorded values.
