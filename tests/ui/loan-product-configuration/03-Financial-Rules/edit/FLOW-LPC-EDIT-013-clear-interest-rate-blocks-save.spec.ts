/**
 * FLOW-LPC-EDIT-013 | Clearing Interest Rate blocks Save & Continue in Edit
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Edit Loan Product Config'
 * Workflow step: Step 03 - Financial Rules
 * Requirement: LPC-REQ-011, LPC-REQ-033 | Priority: High | Technique: Equivalence partitioning | Automation: Automated
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import { advanceEdit } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-EDIT-013', () => {
  test('FLOW-LPC-EDIT-013 Clearing Interest Rate blocks Save & Continue in Edit @edit @step-03 @high', async ({ page, wizard, steps, editProductId }) => {
    await advanceEdit(page, editProductId, 'Financial Rules');
    await steps.financial.openTab('Interest Rate');
    await steps.financial.clear('Interest Rate');
    await expect.soft(wizard.saveAndContinueButton).toBeDisabled();
    await wizard.attemptContinue();
    await wizard.expectOnStep('Financial Rules');
  });
});
