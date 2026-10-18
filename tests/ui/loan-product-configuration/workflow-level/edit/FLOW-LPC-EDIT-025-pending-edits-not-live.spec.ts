/**
 * FLOW-LPC-EDIT-025 | Pending edits do not change the active version until approved
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Edit Loan Product Config'
 * Workflow step: Cross-step - Change banner and review
 * Requirement: LPC-REQ-028 | Priority: High | Technique: State transition | Automation: Blocked
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';

test.describe('FLOW-LPC-EDIT-025', () => {
  test('FLOW-LPC-EDIT-025 Pending edits do not change the active version until approved @edit @step-08 @high', async ({ page, steps }) => {
  test.fixme(true, 'BLOCKED: Maker-checker rules and checker account missing (G-15).');
    await steps.list.goto();
    await expect(page.getByText('ACTIVE VERSION')).toBeVisible();
  });
});
