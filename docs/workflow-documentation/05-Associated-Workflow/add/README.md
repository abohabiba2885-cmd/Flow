# Add Loan Product Config - Step 05 - Associated Workflow

Test cases for this step (source of truth: `test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx`, sheet `Add Loan Product Config`).

| Test Case ID | Summary | Priority | Requirement | Automation | Playwright spec |
|---|---|---|---|---|---|
| FLOW-LPC-ADD-027 | Select a workflow and continue to Decision Engine | Critical | LPC-REQ-020 | Automated | `tests/ui/loan-product-configuration/05-Associated-Workflow/add/FLOW-LPC-ADD-027-select-workflow-and-continue.spec.ts` |
| FLOW-LPC-ADD-028 | Continuing without selecting a workflow follows the mandatory rule | Medium | LPC-REQ-020 | Candidate | `tests/ui/loan-product-configuration/05-Associated-Workflow/add/FLOW-LPC-ADD-028-continue-without-workflow.spec.ts` |
| FLOW-LPC-ADD-029 | 'Edit Workflow' link opens the workflow editor without losing the draft | Low | LPC-REQ-020 | Manual | `tests/ui/loan-product-configuration/05-Associated-Workflow/add/FLOW-LPC-ADD-029-edit-workflow-link-opens-editor.spec.ts` |

## Steps and expected results

### FLOW-LPC-ADD-027 - Select a workflow and continue to Decision Engine
*Preconditions:* Logged in to staging as a QA maker with Loan Product Configuration access. Steps 1-4 completed.  
*Test data:* Workflow 'Default Workflow'.

1. Review workflow list. -> **Expected:** Cards show name, steps, version (e.g. v1.0.0), 'Created by', 'Edit Workflow'.
2. Select 'Default Workflow'. -> **Expected:** Radio selected.
3. Save & Continue. -> **Expected:** Decision Engine opens.

### FLOW-LPC-ADD-028 - Continuing without selecting a workflow follows the mandatory rule
*Preconditions:* Logged in to staging as a QA maker with Loan Product Configuration access. On Step 5.  
*Test data:* No workflow selected.

1. Do not select a workflow; Save & Continue. -> **Expected:** Blocked with a message if workflow is mandatory (to confirm).

### FLOW-LPC-ADD-029 - 'Edit Workflow' link opens the workflow editor without losing the draft
*Preconditions:* Logged in to staging as a QA maker with Loan Product Configuration access. On Step 5.  
*Test data:* Workflow 'Default Workflow'.

1. Click 'Edit Workflow' on Default Workflow. -> **Expected:** Workflow editor opens (new tab or page - target not observed).
2. Return to the product. -> **Expected:** Draft data retained.
