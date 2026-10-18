# Edit Loan Product Config - Step 00 - Open Existing Product (Product list)

Test cases for this step (source of truth: `test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx`, sheet `Edit Loan Product Config`).

| Test Case ID | Summary | Priority | Requirement | Automation | Playwright spec |
|---|---|---|---|---|---|
| FLOW-LPC-EDIT-001 | Edit page opens an existing product with saved values | Critical | LPC-REQ-001, LPC-REQ-008 | Automated | `tests/ui/loan-product-configuration/workflow-level/edit/FLOW-LPC-EDIT-001-open-existing-product.spec.ts` |
| FLOW-LPC-EDIT-002 | Unknown or malformed product id does not open an editable form | Medium | LPC-REQ-032 | Candidate | `tests/ui/loan-product-configuration/workflow-level/edit/FLOW-LPC-EDIT-002-invalid-product-id.spec.ts` |
| FLOW-LPC-EDIT-003 | User without edit permission cannot modify a product | High | LPC-REQ-029 | Blocked | `tests/ui/loan-product-configuration/workflow-level/edit/FLOW-LPC-EDIT-003-unauthorized-user-cannot-edit.spec.ts` |
| FLOW-LPC-EDIT-030 | Product list search finds the product and shows the documented columns | Medium | LPC-REQ-027 | Automated | `tests/ui/loan-product-configuration/workflow-level/edit/FLOW-LPC-EDIT-030-product-list-search-and-columns.spec.ts` |

## Steps and expected results

### FLOW-LPC-EDIT-001 - Edit page opens an existing product with saved values
*Preconditions:* Logged in as QA maker; EDIT_PRODUCT_ID points to a QA-owned product with Steps 1-7 valid (not product 563).  
*Test data:* EDIT_PRODUCT_ID

1. Open the edit URL. -> **Expected:** Header 'Edit Loan Product', breadcrumb 'Edit Product'.
2. Review Step 1. -> **Expected:** Saved name, code, type, currency, status, fiscal year shown.
3. Review stepper. -> **Expected:** Completed steps marked Completed; % matches completed count.

### FLOW-LPC-EDIT-002 - Unknown or malformed product id does not open an editable form
*Preconditions:* Logged in as QA maker; EDIT_PRODUCT_ID points to a QA-owned product with Steps 1-7 valid (not product 563).  
*Test data:* Ids: 'abc', '0'.

1. Open /loan-product-config/edit/abc. -> **Expected:** Error / not-found state; no Update Product.
2. Open /loan-product-config/edit/0. -> **Expected:** Same.

### FLOW-LPC-EDIT-003 - User without edit permission cannot modify a product
*Preconditions:* Restricted account available.  
*Test data:* Restricted account; EDIT_PRODUCT_ID.

1. Log in as restricted user and open the edit URL. -> **Expected:** Access denied or read-only; Update Product unavailable.

### FLOW-LPC-EDIT-030 - Product list search finds the product and shows the documented columns
*Preconditions:* Logged in as QA maker; EDIT_PRODUCT_ID points to a QA-owned product with Steps 1-7 valid (not product 563).  
*Test data:* Code of EDIT_PRODUCT_ID.

1. Open the list. -> **Expected:** 'Loan Products' title, '+ Add Loan Product', counters (Loan Products / Active Products / With Workflows).
2. Review columns. -> **Expected:** PRODUCT NAME, TYPE, CREATED AT, ACTIVE VERSION, STATUS, LAST ACTIVITY, REVIEW STATUS, ACTIONS.
3. Search by product code. -> **Expected:** Matching row shown.
