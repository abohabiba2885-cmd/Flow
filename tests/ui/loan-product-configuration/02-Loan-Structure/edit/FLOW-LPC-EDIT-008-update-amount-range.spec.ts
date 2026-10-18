/**
 * FLOW-LPC-EDIT-008 | Updating the amount range saves and lists Loan Structure in the banner
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Edit Loan Product Config'
 * Workflow step: Step 02 - Loan Structure
 * Requirement: LPC-REQ-010, LPC-REQ-026 | Priority: High | Technique: Use case | Automation: Automated
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import { advanceEdit } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-EDIT-008', () => {
  test('FLOW-LPC-EDIT-008 Updating the amount range saves and lists Loan Structure in the banner @edit @step-02 @high', async ({ page, wizard, steps, editProductId }) => {
    await advanceEdit(page, editProductId, 'Loan Structure');
    await steps.structure.fill('Minimum Amount', 10000);
    await steps.structure.fill('Maximum Amount', 900000);
    await wizard.saveAndContinue();
    await wizard.expectOnStep('Financial Rules');
    await expect(wizard.changeBanner).toContainText('Loan Structure');
  });
});
