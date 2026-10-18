# Add Loan Product Config - Cross-step - Wizard, security and persistence

Test cases for this step (source of truth: `test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx`, sheet `Add Loan Product Config`).

| Test Case ID | Summary | Priority | Requirement | Automation | Playwright spec |
|---|---|---|---|---|---|
| FLOW-LPC-ADD-036 | All values entered during Add are persisted when the product is reopened | Critical | LPC-REQ-008, LPC-REQ-025 | Blocked | `tests/ui/loan-product-configuration/workflow-level/add/FLOW-LPC-ADD-036-end-to-end-persistence-after-create.spec.ts` |
| FLOW-LPC-ADD-037 | Double-clicking Save & Continue on Step 1 creates one product | High | LPC-REQ-035 | Automated | `tests/ui/loan-product-configuration/workflow-level/add/FLOW-LPC-ADD-037-double-click-save-single-record.spec.ts` |
| FLOW-LPC-ADD-038 | Header completion % and step statuses advance with each completed step | Medium | LPC-REQ-001 | Automated | `tests/ui/loan-product-configuration/workflow-level/add/FLOW-LPC-ADD-038-completion-percentage-progression.spec.ts` |
| FLOW-LPC-ADD-039 | User without create permission cannot open or submit Add | High | LPC-REQ-029 | Blocked | `tests/ui/loan-product-configuration/workflow-level/add/FLOW-LPC-ADD-039-unauthorized-user-cannot-add.spec.ts` |
| FLOW-LPC-ADD-041 | Reloading during Add keeps completed steps | Medium | LPC-REQ-008 | Candidate | `tests/ui/loan-product-configuration/workflow-level/add/FLOW-LPC-ADD-041-reload-mid-wizard-keeps-draft.spec.ts` |
| FLOW-LPC-ADD-042 | UI copy is free of the observed typos | Low | LPC-REQ-011, LPC-REQ-020 | Manual | `tests/ui/loan-product-configuration/workflow-level/add/FLOW-LPC-ADD-042-ui-copy-typos.spec.ts` |

## Steps and expected results

### FLOW-LPC-ADD-036 - All values entered during Add are persisted when the product is reopened
*Preconditions:* Logged in to staging as a QA maker with Loan Product Configuration access.  
*Test data:* Baseline data for all steps.

1. Create a product through all 7 steps. -> **Expected:** Product created.
2. Open it in Edit. -> **Expected:** Each step shows the values entered; Product Code read-only.

### FLOW-LPC-ADD-037 - Double-clicking Save & Continue on Step 1 creates one product
*Preconditions:* Logged in to staging as a QA maker with Loan Product Configuration access.  
*Test data:* Unique code.

1. Fill Step 1 and double-click Save & Continue. -> **Expected:** Loan Structure opens once.
2. Search the list for the code. -> **Expected:** Exactly one product.

### FLOW-LPC-ADD-038 - Header completion % and step statuses advance with each completed step
*Preconditions:* Logged in to staging as a QA maker with Loan Product Configuration access.  
*Test data:* Baseline data.

1. Complete steps 1 to 6 one by one. -> **Expected:** After each step, % = ROUND(n/7*100) and the step shows Completed.
2. Arrive on Merchants. -> **Expected:** 86% Completed; Merchants In Progress.

### FLOW-LPC-ADD-039 - User without create permission cannot open or submit Add
*Preconditions:* FLOWSKY_RESTRICTED_EMAIL/PASSWORD set for a user without product-config rights.  
*Test data:* Restricted account.

1. Log in as restricted user and open /loan-product-config/add. -> **Expected:** Access denied / redirected; no form.

### FLOW-LPC-ADD-041 - Reloading during Add keeps completed steps
*Preconditions:* Logged in to staging as a QA maker with Loan Product Configuration access.  
*Test data:* Baseline Steps 1-2.

1. Complete Steps 1-2 and reload. -> **Expected:** Draft reopens with Steps 1-2 Completed and values kept.

### FLOW-LPC-ADD-042 - UI copy is free of the observed typos
*Preconditions:* Logged in to staging as a QA maker with Loan Product Configuration access.  
*Test data:* None

1. Step 3 Fees helper. -> **Expected:** 'principal' (not 'principle').
2. Step 3 Rounding. -> **Expected:** 'Balloon payment rounding' (not 'Ballon').
3. Step 3 Collection late actions. -> **Expected:** 'Write Off' (not 'Right Off').
4. Step 5 workflow card. -> **Expected:** '0 steps' (not '0 steps steps').
