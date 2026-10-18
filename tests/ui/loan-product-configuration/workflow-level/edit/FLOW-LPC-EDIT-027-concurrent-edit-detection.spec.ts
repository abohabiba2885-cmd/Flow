/**
 * FLOW-LPC-EDIT-027 | Two sessions editing the same product do not silently overwrite each other
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Edit Loan Product Config'
 * Workflow step: Cross-step - Change banner and review
 * Requirement: LPC-REQ-031 | Priority: Medium | Technique: Error guessing | Automation: Blocked
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';

test.describe('FLOW-LPC-EDIT-027', () => {
  test('FLOW-LPC-EDIT-027 Two sessions editing the same product do not silently overwrite each other @edit @step-08 @medium', async ({ page, wizard, editProductId }) => {
  test.fixme(true, 'BLOCKED: Concurrency design unknown (G-20).');
    const second = await page.context().newPage();
    await wizard.gotoEdit(editProductId);
    await second.goto(`/loan-product-config/edit/${editProductId}`);
    await second.close();
  });
});
