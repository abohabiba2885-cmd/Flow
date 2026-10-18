/**
 * FLOW-LPC-ADD-041 | Reloading during Add keeps completed steps
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Add Loan Product Config'
 * Workflow step: Cross-step - Wizard, security and persistence
 * Requirement: LPC-REQ-008 | Priority: Medium | Technique: State transition | Automation: Candidate
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import { advanceAdd } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-ADD-041', () => {
  test('FLOW-LPC-ADD-041 Reloading during Add keeps completed steps @add @step-08 @medium', async ({ page, wizard }) => {
  test.fixme(true, 'CANDIDATE: Draft/URL behaviour after Step 1 unknown (G-04).');
    const { general } = await advanceAdd(page, 'Financial Rules');
    await page.reload();
    await wizard.expectStepStatus('Loan Structure', 'Completed');
    await expect(page.getByText(general.productName).first()).toBeVisible();
  });
});
