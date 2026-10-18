/**
 * FLOW-LPC-EDIT-009 | Minimum amount above maximum is rejected in Edit
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Edit Loan Product Config'
 * Workflow step: Step 02 - Loan Structure
 * Requirement: LPC-REQ-010 | Priority: High | Technique: Boundary value analysis | Automation: Automated
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import { advanceEdit } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-EDIT-009', () => {
  test('FLOW-LPC-EDIT-009 Minimum amount above maximum is rejected in Edit @edit @step-02 @high', async ({ page, wizard, steps, editProductId }) => {
    await advanceEdit(page, editProductId, 'Loan Structure');
    await steps.structure.fill('Maximum Amount', 1000000);
    await steps.structure.fill('Minimum Amount', 2000000);
    await wizard.attemptContinue();
    await wizard.expectOnStep('Loan Structure');
  });
});
