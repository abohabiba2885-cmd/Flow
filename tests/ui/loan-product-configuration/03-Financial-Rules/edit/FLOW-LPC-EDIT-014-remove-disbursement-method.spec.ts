/**
 * FLOW-LPC-EDIT-014 | Removing the only disbursement method shows the required message
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Edit Loan Product Config'
 * Workflow step: Step 03 - Financial Rules
 * Requirement: LPC-REQ-012 | Priority: High | Technique: Equivalence partitioning | Automation: Automated
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import { advanceEdit } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-EDIT-014', () => {
  test('FLOW-LPC-EDIT-014 Removing the only disbursement method shows the required message @edit @step-03 @high', async ({ page, wizard, steps, editProductId }) => {
    await advanceEdit(page, editProductId, 'Financial Rules');
    await steps.financial.openTab('Disbursement Rules');
    const chip = steps.financial.selectedMethodChip('Mobile Wallet');
    await chip.getByRole('button').first().click();
    await expect(steps.financial.disbursementRequiredMessage).toBeVisible();
    await wizard.attemptContinue();
    await wizard.expectOnStep('Financial Rules');
  });
});
