/**
 * FLOW-LPC-EDIT-028 | Editing a product does not alter loans already issued under it
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Edit Loan Product Config'
 * Workflow step: Cross-step - Change banner and review
 * Requirement: LPC-REQ-028 | Priority: Medium | Technique: Use case | Automation: Blocked
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';

test.describe('FLOW-LPC-EDIT-028', () => {
  test('FLOW-LPC-EDIT-028 Editing a product does not alter loans already issued under it @edit @step-08 @medium', async ({ wizard, editProductId }) => {
  test.fixme(true, 'BLOCKED: No loan data / versioning rules (G-24).');
    await wizard.gotoEdit(editProductId);
  });
});
