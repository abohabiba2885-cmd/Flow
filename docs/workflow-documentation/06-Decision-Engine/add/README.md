# Add Loan Product Config - Step 06 - Decision Engine

Test cases for this step (source of truth: `test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx`, sheet `Add Loan Product Config`).

| Test Case ID | Summary | Priority | Requirement | Automation | Playwright spec |
|---|---|---|---|---|---|
| FLOW-LPC-ADD-030 | Selecting a decision engine shows field mapping without a connect step | Critical | LPC-REQ-021, LPC-REQ-022 | Automated | `tests/ui/loan-product-configuration/06-Decision-Engine/add/FLOW-LPC-ADD-030-select-decision-engine-shows-field-mapping.spec.ts` |
| FLOW-LPC-ADD-031 | Continuing without a decision engine follows the optional/mandatory rule | Medium | LPC-REQ-034 | Candidate | `tests/ui/loan-product-configuration/06-Decision-Engine/add/FLOW-LPC-ADD-031-continue-without-engine.spec.ts` |
| FLOW-LPC-ADD-032 | Mapping a field enables 'Save Mappings' and increments its count | Medium | LPC-REQ-022 | Automated | `tests/ui/loan-product-configuration/06-Decision-Engine/add/FLOW-LPC-ADD-032-save-mappings-counter.spec.ts` |
| FLOW-LPC-ADD-033 | Required (*) engine fields must be mapped before continuing | High | LPC-REQ-034 | Candidate | `tests/ui/loan-product-configuration/06-Decision-Engine/add/FLOW-LPC-ADD-033-required-mappings-enforced.spec.ts` |

## Steps and expected results

### FLOW-LPC-ADD-030 - Selecting a decision engine shows field mapping without a connect step
*Preconditions:* Logged in to staging as a QA maker with Loan Product Configuration access. Steps 1-5 completed.
*Test data:* Engine 'Credit Lending - Egyptian Banking Rules'.

1. Choose the engine. -> **Expected:** 'Configure Field Mappings' appears at once with 'The decision engine will be linked automatically when you save the product.' No 'Connect Decision Engine' button.
2. Review Field Mapping. -> **Expected:** 'Field Mapping Configuration' with tabs 'financial (0)' and 'personal (0)'; 'Save Mappings (0)' disabled.
3. Open the financial tab, then the personal tab. -> **Expected:** Inputs Credit Score (financial.credit_score), Monthly Income (personal.monthly_income) and National ID (personal.national_id), each with Workflow and Customer mapping fields.

*Design change:* the connect step was removed; PO confirmed on 16-Oct-2026 (G-26).

### FLOW-LPC-ADD-031 - Continuing without a decision engine follows the optional/mandatory rule
*Preconditions:* Logged in to staging as a QA maker with Loan Product Configuration access. On Step 6.  
*Test data:* No engine.

1. Leave engine unselected; Save & Continue. -> **Expected:** Blocked if engine mandatory, or proceeds if optional (to confirm).

### FLOW-LPC-ADD-032 - Mapping a field enables 'Save Mappings' and increments its count
*Preconditions:* Logged in to staging as a QA maker with Loan Product Configuration access. Steps 1-5 completed; engine selected (no connect step, G-26).
*Test data:* Engine 'Credit Lending - Egyptian Banking Rules'; Credit Score -> first Customer option.

1. Open the financial tab and map Credit Score to a Customer field. -> **Expected:** 'Save Mappings (1)' enabled; tab shows 'Financial (1)'; personal tab still 0.
2. Click Save Mappings. -> **Expected:** Confirmation 'Mappings saved.' shown.

### FLOW-LPC-ADD-033 - Required (*) engine fields must be mapped before continuing
*Preconditions:* Logged in to staging as a QA maker with Loan Product Configuration access. Engine connected.  
*Test data:* No mappings.

1. Leave all mappings 'No mapping'; Save & Continue. -> **Expected:** Blocked with required-mapping message (to confirm).
