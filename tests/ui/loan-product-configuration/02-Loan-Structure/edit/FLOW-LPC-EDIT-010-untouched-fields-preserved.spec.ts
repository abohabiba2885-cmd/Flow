/**
 * FLOW-LPC-EDIT-010 | Saving one step leaves other steps' values unchanged
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Edit Loan Product Config'
 * Workflow step: Step 02 - Loan Structure
 * Requirement: LPC-REQ-008 | Priority: Medium | Technique: Error guessing | Automation: Automated
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import { advanceEdit } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-EDIT-010', () => {
  test('FLOW-LPC-EDIT-010 Saving one step leaves other steps\' values unchanged @edit @step-02 @medium', async ({ page, wizard, steps, editProductId }) => {
    await advanceEdit(page, editProductId, 'Loan Structure');
    const before = [await steps.structure.input('Minimum Amount').inputValue(), await steps.structure.input('Maximum Amount').inputValue()];
    await wizard.gotoEdit(editProductId);
    await steps.general.fill('Product Description', `Edited ${Date.now()}`);
    await wizard.saveAndContinue();
    await wizard.expectOnStep('Loan Structure');
    expect([await steps.structure.input('Minimum Amount').inputValue(), await steps.structure.input('Maximum Amount').inputValue()]).toEqual(before);
  });
});
