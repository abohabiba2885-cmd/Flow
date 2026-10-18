# Edit Loan Product Config - Step 07 - Merchants & Update Product

Test cases for this step (source of truth: `test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx`, sheet `Edit Loan Product Config`).

| Test Case ID | Summary | Priority | Requirement | Automation | Playwright spec |
|---|---|---|---|---|---|
| FLOW-LPC-EDIT-018 | Update Product succeeds and sets Review Status to PENDING REVIEW | Critical | LPC-REQ-024 | Automated | `tests/ui/loan-product-configuration/07-Merchants/edit/FLOW-LPC-EDIT-018-update-product-pending-review.spec.ts` |
| FLOW-LPC-EDIT-019 | Values submitted with Update Product are shown on reopening | Critical | LPC-REQ-024 | Automated | `tests/ui/loan-product-configuration/07-Merchants/edit/FLOW-LPC-EDIT-019-reopen-after-update-persists.spec.ts` |
| FLOW-LPC-EDIT-020 | Double-clicking Update Product produces one update | Medium | LPC-REQ-035 | Candidate | `tests/ui/loan-product-configuration/07-Merchants/edit/FLOW-LPC-EDIT-020-double-click-update-product.spec.ts` |
| FLOW-LPC-EDIT-021 | Merchants list is read-only in Edit | Medium | LPC-REQ-023 | Automated | `tests/ui/loan-product-configuration/07-Merchants/edit/FLOW-LPC-EDIT-021-merchants-read-only-in-edit.spec.ts` |

## Steps and expected results

### FLOW-LPC-EDIT-018 - Update Product succeeds and sets Review Status to PENDING REVIEW
*Preconditions:* Logged in as QA maker; EDIT_PRODUCT_ID points to a QA-owned product with Steps 1-7 valid (not product 563). At least one pending change.  
*Test data:* Product description change.

1. Make a change in Step 1 and go to Merchants. -> **Expected:** Banner shows pending changes.
2. Click Update Product. -> **Expected:** 'Product updated successfully!'; 100% Completed; banner cleared.
3. Open the list and search the code. -> **Expected:** Review Status PENDING REVIEW; Last Activity shows the user (role label - see G-14).

### FLOW-LPC-EDIT-019 - Values submitted with Update Product are shown on reopening
*Preconditions:* Logged in as QA maker; EDIT_PRODUCT_ID points to a QA-owned product with Steps 1-7 valid (not product 563).  
*Test data:* Unique description.

1. Change description, go to Merchants, Update Product. -> **Expected:** Success message.
2. Reopen the product. -> **Expected:** New description shown.

### FLOW-LPC-EDIT-020 - Double-clicking Update Product produces one update
*Preconditions:* Logged in as QA maker; EDIT_PRODUCT_ID points to a QA-owned product with Steps 1-7 valid (not product 563).  
*Test data:* Pending change.

1. Double-click Update Product. -> **Expected:** One success message; one activity entry; no error.

### FLOW-LPC-EDIT-021 - Merchants list is read-only in Edit
*Preconditions:* Logged in as QA maker; EDIT_PRODUCT_ID points to a QA-owned product with Steps 1-7 valid (not product 563).  
*Test data:* EDIT_PRODUCT_ID

1. Open Merchants step. -> **Expected:** 'Loading merchants...' then list or 'No merchants enabled'.
2. Review controls. -> **Expected:** Read-only note shown; no enable/disable controls.

## Additional automation paths

- `tests/ui/loan-product-configuration/07-Merchants/edit/FLOW-LPC-EDIT-S10-001-list-shows-the-update-with-workflows-counter-pending-review.spec.ts`
