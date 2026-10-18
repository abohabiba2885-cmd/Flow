/**
 * FLOW-LPC-EDIT-002 | Unknown or malformed product id does not open an editable form
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Edit Loan Product Config'
 * Workflow step: Step 00 - Open Existing Product (Product list)
 * Requirement: LPC-REQ-032 | Priority: Medium | Technique: Error guessing | Automation: Candidate
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';

test.describe('FLOW-LPC-EDIT-002', () => {
  test('FLOW-LPC-EDIT-002 Unknown or malformed product id does not open an editable form @edit @step-00 @medium', async ({ page, wizard }) => {
  test.fixme(true, 'CANDIDATE: Expected not-found behaviour not specified.');
    for (const id of ['abc', '0']) {
      await page.goto(`/loan-product-config/edit/${id}`);
      await expect(wizard.updateProductButton).toHaveCount(0);
    }
  });
});
