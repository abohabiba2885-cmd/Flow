# Edit Loan Product Config - Step 05 - Associated Workflow

Test cases for this step (source of truth: `test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx`, sheet `Edit Loan Product Config`).

| Test Case ID | Summary | Priority | Requirement | Automation | Playwright spec |
|---|---|---|---|---|---|
| FLOW-LPC-EDIT-016 | Changing the associated workflow persists | High | LPC-REQ-020 | Automated | `tests/ui/loan-product-configuration/05-Associated-Workflow/edit/FLOW-LPC-EDIT-016-change-workflow.spec.ts` |

## Steps and expected results

### FLOW-LPC-EDIT-016 - Changing the associated workflow persists
*Preconditions:* Logged in as QA maker; EDIT_PRODUCT_ID points to a QA-owned product with Steps 1-7 valid (not product 563).  
*Test data:* 'Default Workflow'.

1. Select 'Default Workflow'. -> **Expected:** Radio checked.
2. Save & Continue, then reopen Step 5. -> **Expected:** 'Default Workflow' still selected.

## Additional automation paths

- `tests/ui/loan-product-configuration/05-Associated-Workflow/edit/FLOW-LPC-EDIT-S05-001-workflow-cards-show-name-description-status-steps-version-cr.spec.ts`
- `tests/ui/loan-product-configuration/05-Associated-Workflow/edit/FLOW-LPC-EDIT-S05-002-save-continue-stays-disabled-until-a-workflow-is-selected.spec.ts`
