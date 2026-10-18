# Add Loan Product Config - Step 07 - Merchants (final step)

Test cases for this step (source of truth: `test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx`, sheet `Add Loan Product Config`).

| Test Case ID | Summary | Priority | Requirement | Automation | Playwright spec |
|---|---|---|---|---|---|
| FLOW-LPC-ADD-034 | Merchants step is read-only and shows the empty state for a new product | High | LPC-REQ-023 | Automated | `tests/ui/loan-product-configuration/07-Merchants/add/FLOW-LPC-ADD-034-merchants-read-only-empty-state.spec.ts` |
| FLOW-LPC-ADD-035 | Final action on Step 7 creates the product and lists it | Critical | LPC-REQ-025 | Blocked | `tests/ui/loan-product-configuration/07-Merchants/add/FLOW-LPC-ADD-035-create-product-final-step.spec.ts` |

## Steps and expected results

### FLOW-LPC-ADD-034 - Merchants step is read-only and shows the empty state for a new product
*Preconditions:* Logged in to staging as a QA maker with Loan Product Configuration access. Steps 1-6 completed.  
*Test data:* New product (no merchants).

1. Open Merchants step. -> **Expected:** 'Loading merchants...' then content.
2. Review content. -> **Expected:** Note 'This list is read-only here - manage merchant enablement in MMS'; 'No merchants enabled'; no add/remove controls.

### FLOW-LPC-ADD-035 - Final action on Step 7 creates the product and lists it
*Preconditions:* Logged in to staging as a QA maker with Loan Product Configuration access. Steps 1-6 completed.  
*Test data:* Baseline data.

1. Click the final create button on Step 7. -> **Expected:** Success message; 100% Completed.
2. Open the product list and search the code. -> **Expected:** Product listed with type Business Loan and the expected status/review status.
