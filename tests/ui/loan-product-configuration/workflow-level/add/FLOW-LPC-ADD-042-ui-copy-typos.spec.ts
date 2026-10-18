/**
 * FLOW-LPC-ADD-042 | UI copy is free of the observed typos
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Add Loan Product Config'
 * Workflow step: Cross-step - Wizard, security and persistence
 * Requirement: LPC-REQ-011, LPC-REQ-020 | Priority: Low | Technique: Error guessing | Automation: Manual
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import { advanceAdd } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-ADD-042', () => {
  test('FLOW-LPC-ADD-042 UI copy is free of the observed typos @add @step-08 @low', async ({ page, steps }) => {
  test.fixme(true, 'MANUAL: Manual UI copy review (G-13).');
    await advanceAdd(page, 'Associated Workflow');
    await expect(page.getByText(/steps steps/)).toHaveCount(0);
  });
});
