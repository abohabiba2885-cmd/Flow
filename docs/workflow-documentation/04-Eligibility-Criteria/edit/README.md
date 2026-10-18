# Edit Loan Product Config - Step 04 - Eligibility Criteria

Test cases for this step (source of truth: `test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx`, sheet `Edit Loan Product Config`).

| Test Case ID | Summary | Priority | Requirement | Automation | Playwright spec |
|---|---|---|---|---|---|
| FLOW-LPC-EDIT-015 | Updating eligibility refreshes the summary and banner | High | LPC-REQ-014, LPC-REQ-019, LPC-REQ-026 | Automated | `tests/ui/loan-product-configuration/04-Eligibility-Criteria/edit/FLOW-LPC-EDIT-015-update-eligibility-summary.spec.ts` |

## Steps and expected results

### FLOW-LPC-EDIT-015 - Updating eligibility refreshes the summary and banner
*Preconditions:* Logged in as QA maker; EDIT_PRODUCT_ID points to a QA-owned product with Steps 1-7 valid (not product 563).  
*Test data:* Age 21-60; credit score 650.

1. Change ages to 21-60 and credit score to 650. -> **Expected:** Summary 'Age: 21 - 60 years', 'Minimum Credit Score: 650'.
2. Save & Continue. -> **Expected:** Associated Workflow opens; banner includes 'Eligibility Criteria'.

## Additional automation paths

- `tests/ui/loan-product-configuration/04-Eligibility-Criteria/edit/FLOW-LPC-EDIT-S04-001-age-fields-are-required-and-accept-whole-numbers-only.spec.ts`
- `tests/ui/loan-product-configuration/04-Eligibility-Criteria/edit/FLOW-LPC-EDIT-S04-002-minimum-monthly-income-toggle-reveals-a-required-field.spec.ts`
- `tests/ui/loan-product-configuration/04-Eligibility-Criteria/edit/FLOW-LPC-EDIT-S04-003-credit-score-0-keeps-save-continue-disabled-turning-the-togg.spec.ts`
- `tests/ui/loan-product-configuration/04-Eligibility-Criteria/edit/FLOW-LPC-EDIT-S04-004-geographic-cascade-city-and-area-disabled-without-a-governor.spec.ts`
