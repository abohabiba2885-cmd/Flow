/**
 * FLOW-LPC-EDIT-026 | Editing a product in PENDING REVIEW follows the documented rule
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Edit Loan Product Config'
 * Workflow step: Cross-step - Change banner and review
 * Requirement: LPC-REQ-028 | Priority: Medium | Technique: State transition | Automation: Candidate
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';

test.describe('FLOW-LPC-EDIT-026', () => {
  test('FLOW-LPC-EDIT-026 Editing a product in PENDING REVIEW follows the documented rule @edit @step-08 @medium', async ({ page, wizard, editProductId }) => {
  test.fixme(true, 'CANDIDATE: Rule for editing while pending review unknown (G-15).');
    await wizard.gotoEdit(editProductId);
    await expect(wizard.updateProductButton.or(page.getByText(/pending review/i)).first()).toBeVisible();
  });
});
