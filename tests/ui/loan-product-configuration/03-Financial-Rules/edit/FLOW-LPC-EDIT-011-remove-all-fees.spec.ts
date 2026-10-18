/**
 * FLOW-LPC-EDIT-011 | Removing every fee leaves an empty fee list and saves
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Edit Loan Product Config'
 * Workflow step: Step 03 - Financial Rules
 * Requirement: LPC-REQ-011 | Priority: High | Technique: Use case | Automation: Automated
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import { advanceEdit } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-EDIT-011', () => {
  test('FLOW-LPC-EDIT-011 Removing every fee leaves an empty fee list and saves @edit @step-03 @high', async ({ page, wizard, steps, editProductId }) => {
    await advanceEdit(page, editProductId, 'Financial Rules');
    await steps.financial.openTab('Fees');
    await steps.financial.removeAllFees();
    await expect(steps.financial.addFeeButton).toBeVisible();
    await wizard.saveAndContinue();
    await wizard.expectOnStep('Eligibility Criteria');
    await expect(wizard.changeBanner).toContainText('Financial Rules');
  });
});
