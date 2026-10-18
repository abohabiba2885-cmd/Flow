# Edit Loan Product Config - Cross-step - Change banner and review

Test cases for this step (source of truth: `test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx`, sheet `Edit Loan Product Config`).

| Test Case ID | Summary | Priority | Requirement | Automation | Playwright spec |
|---|---|---|---|---|---|
| FLOW-LPC-EDIT-022 | Change banner count grows and lists every changed step | High | LPC-REQ-026 | Automated | `tests/ui/loan-product-configuration/workflow-level/edit/FLOW-LPC-EDIT-022-banner-accumulates-changed-steps.spec.ts` |
| FLOW-LPC-EDIT-023 | Discard changes reverts pending edits to the last submitted version | High | LPC-REQ-026 | Candidate | `tests/ui/loan-product-configuration/workflow-level/edit/FLOW-LPC-EDIT-023-discard-changes-reverts.spec.ts` |
| FLOW-LPC-EDIT-024 | Submit for Review from the banner sets PENDING REVIEW | High | LPC-REQ-026 | Candidate | `tests/ui/loan-product-configuration/workflow-level/edit/FLOW-LPC-EDIT-024-submit-for-review-from-banner.spec.ts` |
| FLOW-LPC-EDIT-025 | Pending edits do not change the active version until approved | High | LPC-REQ-028 | Blocked | `tests/ui/loan-product-configuration/workflow-level/edit/FLOW-LPC-EDIT-025-pending-edits-not-live.spec.ts` |
| FLOW-LPC-EDIT-026 | Editing a product in PENDING REVIEW follows the documented rule | Medium | LPC-REQ-028 | Candidate | `tests/ui/loan-product-configuration/workflow-level/edit/FLOW-LPC-EDIT-026-edit-while-pending-review.spec.ts` |
| FLOW-LPC-EDIT-027 | Two sessions editing the same product do not silently overwrite each other | Medium | LPC-REQ-031 | Blocked | `tests/ui/loan-product-configuration/workflow-level/edit/FLOW-LPC-EDIT-027-concurrent-edit-detection.spec.ts` |
| FLOW-LPC-EDIT-028 | Editing a product does not alter loans already issued under it | Medium | LPC-REQ-028 | Blocked | `tests/ui/loan-product-configuration/workflow-level/edit/FLOW-LPC-EDIT-028-existing-loans-unaffected.spec.ts` |

## Steps and expected results

### FLOW-LPC-EDIT-022 - Change banner count grows and lists every changed step
*Preconditions:* Logged in as QA maker; EDIT_PRODUCT_ID points to a QA-owned product with Steps 1-7 valid (not product 563).  
*Test data:* Changes in Step 1 then Step 4.

1. Change Step 1 and save. -> **Expected:** Banner lists General Information with count N1.
2. Change Step 4 and save. -> **Expected:** Banner lists both steps; count N2 > N1.
3. Review text. -> **Expected:** Ends with '- not yet submitted for review.'

### FLOW-LPC-EDIT-023 - Discard changes reverts pending edits to the last submitted version
*Preconditions:* Logged in as QA maker; EDIT_PRODUCT_ID points to a QA-owned product with Steps 1-7 valid (not product 563).  
*Test data:* Pending description change.

1. Make a change and save the step. -> **Expected:** Banner shown.
2. Click Discard changes (confirm if prompted). -> **Expected:** Banner cleared; value reverted.

### FLOW-LPC-EDIT-024 - Submit for Review from the banner sets PENDING REVIEW
*Preconditions:* Logged in as QA maker; EDIT_PRODUCT_ID points to a QA-owned product with Steps 1-7 valid (not product 563).  
*Test data:* Pending change.

1. Make a change and click Submit for Review. -> **Expected:** Confirmation; banner cleared.
2. Check list. -> **Expected:** Review Status PENDING REVIEW.

### FLOW-LPC-EDIT-025 - Pending edits do not change the active version until approved
*Preconditions:* Logged in as QA maker; EDIT_PRODUCT_ID points to a QA-owned product with Steps 1-7 valid (not product 563). Checker account.  
*Test data:* Pending update.

1. Submit an update. -> **Expected:** Review Status PENDING REVIEW.
2. Check ACTIVE VERSION and live product data. -> **Expected:** Unchanged until a checker approves.

### FLOW-LPC-EDIT-026 - Editing a product in PENDING REVIEW follows the documented rule
*Preconditions:* Logged in as QA maker; EDIT_PRODUCT_ID points to a QA-owned product with Steps 1-7 valid (not product 563). Product in PENDING REVIEW.  
*Test data:* Pending product.

1. Open the pending product in Edit. -> **Expected:** Edit blocked, or further changes appended per rule (to confirm).

### FLOW-LPC-EDIT-027 - Two sessions editing the same product do not silently overwrite each other
*Preconditions:* Logged in as QA maker; EDIT_PRODUCT_ID points to a QA-owned product with Steps 1-7 valid (not product 563). Two sessions.  
*Test data:* Different descriptions per session.

1. Session A and B open the product. -> **Expected:** Both load.
2. A saves a change; B saves a different change. -> **Expected:** B warned of conflict or changes merged per design.

### FLOW-LPC-EDIT-028 - Editing a product does not alter loans already issued under it
*Preconditions:* Logged in as QA maker; EDIT_PRODUCT_ID points to a QA-owned product with Steps 1-7 valid (not product 563). A loan exists for the product.  
*Test data:* Existing loan.

1. Update interest/fees and approve. -> **Expected:** Existing loan schedule unchanged; new applications use the new version.
