# Edit Loan Product Config - Step 03 - Financial Rules

Test cases for this step (source of truth: `test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx`, sheet `Edit Loan Product Config`).

| Test Case ID | Summary | Priority | Requirement | Automation | Playwright spec |
|---|---|---|---|---|---|
| FLOW-LPC-EDIT-011 | Removing every fee leaves an empty fee list and saves | High | LPC-REQ-011 | Automated | `tests/ui/loan-product-configuration/03-Financial-Rules/edit/FLOW-LPC-EDIT-011-remove-all-fees.spec.ts` |
| FLOW-LPC-EDIT-012 | Turning off all collection toggles saves in Edit | Medium | LPC-REQ-013 | Automated | `tests/ui/loan-product-configuration/03-Financial-Rules/edit/FLOW-LPC-EDIT-012-collection-toggles-off.spec.ts` |
| FLOW-LPC-EDIT-013 | Clearing Interest Rate blocks Save & Continue in Edit | High | LPC-REQ-011, LPC-REQ-033 | Automated | `tests/ui/loan-product-configuration/03-Financial-Rules/edit/FLOW-LPC-EDIT-013-clear-interest-rate-blocks-save.spec.ts` |
| FLOW-LPC-EDIT-014 | Removing the only disbursement method shows the required message | High | LPC-REQ-012 | Automated | `tests/ui/loan-product-configuration/03-Financial-Rules/edit/FLOW-LPC-EDIT-014-remove-disbursement-method.spec.ts` |

## Steps and expected results

### FLOW-LPC-EDIT-011 - Removing every fee leaves an empty fee list and saves
*Preconditions:* Logged in as QA maker; EDIT_PRODUCT_ID points to a QA-owned product with Steps 1-7 valid (not product 563).  
*Test data:* Existing fee rows.

1. Fees tab: remove all fees. -> **Expected:** Fee list empty; '+ Add New' visible.
2. Save & Continue. -> **Expected:** Eligibility Criteria opens; banner includes 'Financial Rules'.

### FLOW-LPC-EDIT-012 - Turning off all collection toggles saves in Edit
*Preconditions:* Logged in as QA maker; EDIT_PRODUCT_ID points to a QA-owned product with Steps 1-7 valid (not product 563).  
*Test data:* All collection toggles off.

1. Collection Rules: turn every toggle off. -> **Expected:** Dependent inputs hidden.
2. Save & Continue. -> **Expected:** Eligibility Criteria opens.

### FLOW-LPC-EDIT-013 - Clearing Interest Rate blocks Save & Continue in Edit
*Preconditions:* Logged in as QA maker; EDIT_PRODUCT_ID points to a QA-owned product with Steps 1-7 valid (not product 563).  
*Test data:* Empty Interest Rate.

1. Clear Interest Rate. -> **Expected:** Save & Continue disabled / error.
2. Try Save & Continue. -> **Expected:** Step 3 remains.

### FLOW-LPC-EDIT-014 - Removing the only disbursement method shows the required message
*Preconditions:* Logged in as QA maker; EDIT_PRODUCT_ID points to a QA-owned product with Steps 1-7 valid (not product 563).  
*Test data:* Single method selected.

1. Disbursement Rules: remove the selected method. -> **Expected:** 'At least one disbursement method is required'.
2. Try Save & Continue. -> **Expected:** Step 3 remains.

## Additional automation paths

- `tests/ui/loan-product-configuration/03-Financial-Rules/edit/FLOW-LPC-EDIT-S03D-001-delinquency-duration-unit-and-collection-rules-helper-texts.spec.ts`
