/**
 * FLOW-LPC-EDIT-024 | Submit for Review from the banner sets PENDING REVIEW
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Edit Loan Product Config'
 * Workflow step: Cross-step - Change banner and review
 * Requirement: LPC-REQ-026 | Priority: High | Technique: State transition | Automation: Candidate
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';

test.describe('FLOW-LPC-EDIT-024', () => {
  test('FLOW-LPC-EDIT-024 Submit for Review from the banner sets PENDING REVIEW @edit @step-08 @high', async ({ wizard, steps, editProductId }) => {
  test.fixme(true, 'CANDIDATE: Submit for Review outcome not observed (G-23).');
    await wizard.gotoEdit(editProductId);
    const code = await steps.general.input('Product Code / ID').inputValue();
    await steps.general.fill('Product Description', `Submit ${Date.now()}`);
    await wizard.saveAndContinue();
    await wizard.submitForReviewButton.click();
    await steps.list.goto();
    await steps.list.search(code);
    await expect(steps.list.row(code)).toContainText(/PENDING REVIEW/i);
  });
});
