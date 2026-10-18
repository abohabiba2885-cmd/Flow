# Edit Loan Product Config - Step 01 - General Information

Test cases for this step (source of truth: `test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx`, sheet `Edit Loan Product Config`).

| Test Case ID | Summary | Priority | Requirement | Automation | Playwright spec |
|---|---|---|---|---|---|
| FLOW-LPC-EDIT-004 | Product Code / ID cannot be changed in Edit | Critical | LPC-REQ-005 | Automated | `tests/ui/loan-product-configuration/01-General-Information/edit/FLOW-LPC-EDIT-004-product-code-read-only.spec.ts` |
| FLOW-LPC-EDIT-005 | Changing name and description saves and appears in the change banner | High | LPC-REQ-008, LPC-REQ-026 | Automated | `tests/ui/loan-product-configuration/01-General-Information/edit/FLOW-LPC-EDIT-005-edit-name-and-description.spec.ts` |
| FLOW-LPC-EDIT-006 | Clearing Product Name blocks Save & Continue | High | LPC-REQ-003, LPC-REQ-033 | Automated | `tests/ui/loan-product-configuration/01-General-Information/edit/FLOW-LPC-EDIT-006-clear-required-name.spec.ts` |
| FLOW-LPC-EDIT-007 | Cancel in Edit does not save the current step | Medium | LPC-REQ-007 | Automated | `tests/ui/loan-product-configuration/01-General-Information/edit/FLOW-LPC-EDIT-007-cancel-discards-unsaved-step.spec.ts` |

## Steps and expected results

### FLOW-LPC-EDIT-004 - Product Code / ID cannot be changed in Edit
*Preconditions:* Logged in as QA maker; EDIT_PRODUCT_ID points to a QA-owned product with Steps 1-7 valid (not product 563).  
*Test data:* EDIT_PRODUCT_ID

1. Open Edit Step 1. -> **Expected:** Product Code / ID is disabled/read-only.
2. Try typing in it. -> **Expected:** Value unchanged.

### FLOW-LPC-EDIT-005 - Changing name and description saves and appears in the change banner
*Preconditions:* Logged in as QA maker; EDIT_PRODUCT_ID points to a QA-owned product with Steps 1-7 valid (not product 563).  
*Test data:* Name 'QA Loan Product Edited <ts>'; description 'Edited by automation'.

1. Change Product Name and Description. -> **Expected:** Counter updates.
2. Save & Continue. -> **Expected:** Loan Structure opens.
3. Review banner. -> **Expected:** '... fields changed in ... General Information ... - not yet submitted for review.'

### FLOW-LPC-EDIT-006 - Clearing Product Name blocks Save & Continue
*Preconditions:* Logged in as QA maker; EDIT_PRODUCT_ID points to a QA-owned product with Steps 1-7 valid (not product 563).  
*Test data:* Empty name.

1. Clear Product Name. -> **Expected:** Required state shown.
2. Try Save & Continue. -> **Expected:** Step 1 remains.

### FLOW-LPC-EDIT-007 - Cancel in Edit does not save the current step
*Preconditions:* Logged in as QA maker; EDIT_PRODUCT_ID points to a QA-owned product with Steps 1-7 valid (not product 563).  
*Test data:* Temporary name.

1. Change Product Name without saving. -> **Expected:** Field changed.
2. Click Cancel and reopen the product. -> **Expected:** Original name shown.
