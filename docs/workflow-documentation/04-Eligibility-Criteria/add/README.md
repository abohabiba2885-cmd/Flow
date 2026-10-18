# Add Loan Product Config - Step 04 - Eligibility Criteria

Test cases for this step (source of truth: `test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx`, sheet `Add Loan Product Config`).

| Test Case ID | Summary | Priority | Requirement | Automation | Playwright spec |
|---|---|---|---|---|---|
| FLOW-LPC-ADD-021 | Valid eligibility updates the summary and opens Associated Workflow | Critical | LPC-REQ-014, LPC-REQ-019 | Automated | `tests/ui/loan-product-configuration/04-Eligibility-Criteria/add/FLOW-LPC-ADD-021-complete-eligibility-valid-summary.spec.ts` |
| FLOW-LPC-ADD-022 | Minimum Age greater than Maximum Age is rejected | High | LPC-REQ-014 | Automated | `tests/ui/loan-product-configuration/04-Eligibility-Criteria/add/FLOW-LPC-ADD-022-min-age-greater-than-max-age.spec.ts` |
| FLOW-LPC-ADD-023 | Income and credit score fields are required only when their toggles are on | High | LPC-REQ-015 | Automated | `tests/ui/loan-product-configuration/04-Eligibility-Criteria/add/FLOW-LPC-ADD-023-toggle-dependent-required-fields.spec.ts` |
| FLOW-LPC-ADD-024 | Minimum Credit Score enforces the 300-850 range | High | LPC-REQ-016 | Candidate | `tests/ui/loan-product-configuration/04-Eligibility-Criteria/add/FLOW-LPC-ADD-024-credit-score-bounds.spec.ts` |
| FLOW-LPC-ADD-025 | Occupation criteria can be set as Allowed or Disallowed | Medium | LPC-REQ-017 | Manual | `tests/ui/loan-product-configuration/04-Eligibility-Criteria/add/FLOW-LPC-ADD-025-occupation-allowed-disallowed.spec.ts` |
| FLOW-LPC-ADD-026 | City and Area stay disabled until their parent is selected | Medium | LPC-REQ-018 | Automated | `tests/ui/loan-product-configuration/04-Eligibility-Criteria/add/FLOW-LPC-ADD-026-geographic-cascade-disabled-children.spec.ts` |

## Steps and expected results

### FLOW-LPC-ADD-021 - Valid eligibility updates the summary and opens Associated Workflow
*Preconditions:* Logged in to staging as a QA maker with Loan Product Configuration access. Steps 1-3 completed.  
*Test data:* Age 18-65; income 5000; credit score 600.

1. Enter Minimum Age 18, Maximum Age 65. -> **Expected:** Eligibility Summary shows 'Age: 18 - 65 years'.
2. Enable income 5000 and credit score 600. -> **Expected:** Summary lists 'Minimum Credit Score: 600'.
3. Save & Continue. -> **Expected:** Associated Workflow opens.

### FLOW-LPC-ADD-022 - Minimum Age greater than Maximum Age is rejected
*Preconditions:* Logged in to staging as a QA maker with Loan Product Configuration access. On Step 4.  
*Test data:* Min 66, Max 65; then Min 65, Max 65.

1. Enter Min 66, Max 65; Save & Continue. -> **Expected:** Validation error; Step 4 remains.
2. Enter Min 65, Max 65. -> **Expected:** Accepted or rejected per rule (to confirm).

### FLOW-LPC-ADD-023 - Income and credit score fields are required only when their toggles are on
*Preconditions:* Logged in to staging as a QA maker with Loan Product Configuration access. On Step 4.  
*Test data:* Toggle on/off with empty value.

1. Turn Minimum Monthly Income on, leave value empty; Save & Continue. -> **Expected:** Blocked.
2. Turn it off; turn Credit Score Requirement on, value empty; Save & Continue. -> **Expected:** Blocked.
3. Turn both off. -> **Expected:** Fields hidden; Save & Continue proceeds.

### FLOW-LPC-ADD-024 - Minimum Credit Score enforces the 300-850 range
*Preconditions:* Logged in to staging as a QA maker with Loan Product Configuration access. On Step 4, Credit Score on.  
*Test data:* 0, 299, 300, 850, 851

1. Enter 0 and 299; Save & Continue. -> **Expected:** Rejected (to confirm - 0 was accepted on staging).
2. Enter 851. -> **Expected:** Rejected.
3. Enter 300 and 850. -> **Expected:** Accepted.

### FLOW-LPC-ADD-025 - Occupation criteria can be set as Allowed or Disallowed
*Preconditions:* Logged in to staging as a QA maker with Loan Product Configuration access. On Step 4.  
*Test data:* First available occupation.

1. Choose Allowed and select an occupation. -> **Expected:** Occupation added; summary updated.
2. Switch to Disallowed. -> **Expected:** Mode changes; selection kept or cleared per design.
3. Save & Continue. -> **Expected:** Associated Workflow opens.

### FLOW-LPC-ADD-026 - City and Area stay disabled until their parent is selected
*Preconditions:* Logged in to staging as a QA maker with Loan Product Configuration access. On Step 4.  
*Test data:* None (governorate data missing on staging, G-19).

1. Open Geographic criteria. -> **Expected:** Governorate enabled; City and Area disabled.
2. Search a governorate. -> **Expected:** Options listed (staging showed 'No matches found' - G-19).
