# Edit Loan Product Config - Step 06 - Decision Engine

Test cases for this step (source of truth: `test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx`, sheet `Edit Loan Product Config`).

| Test Case ID | Summary | Priority | Requirement | Automation | Playwright spec |
|---|---|---|---|---|---|
| FLOW-LPC-EDIT-017 | Selecting a different decision engine shows its field mapping without a connect step | Medium | LPC-REQ-021, LPC-REQ-022 | Automated | `tests/ui/loan-product-configuration/06-Decision-Engine/edit/FLOW-LPC-EDIT-017-change-decision-engine-shows-field-mapping.spec.ts` |

## Steps and expected results

### FLOW-LPC-EDIT-017 - Selecting a different decision engine shows its field mapping without a connect step
*Preconditions:* Logged in as QA maker; EDIT_PRODUCT_ID points to a QA-owned product with Steps 1-7 valid and an engine already selected.
*Test data:* The other engine of 'Credit Lending - Egyptian Banking Rules' / 'Risk Matrix'.

1. Open Step 6 and choose a different engine. -> **Expected:** The new engine is selected. No 'Connect Decision Engine' button.
2. Review mappings. -> **Expected:** 'Field Mapping Configuration' for the new engine with 'Save Mappings (0)'; the financial tab lists mapping fields.

*Design change:* the connect step was removed; PO confirmed on 16-Oct-2026 (G-26). The test does not save, so the product keeps its engine.

## Additional automation paths

- `tests/ui/loan-product-configuration/06-Decision-Engine/edit/FLOW-LPC-EDIT-S06-001-field-mapping-lists-engine-fields-defaults-to-no-mapping-and.spec.ts`
- `tests/ui/loan-product-configuration/06-Decision-Engine/edit/FLOW-LPC-EDIT-S06-002-mapping-fields-updates-the-tab-count-and-enables-save-mappin.spec.ts`
