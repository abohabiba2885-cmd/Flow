/**
 * FLOW-LPC-EDIT-023 | Discard changes reverts pending edits to the last submitted version
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Edit Loan Product Config'
 * Workflow step: Cross-step - Change banner and review
 * Requirement: LPC-REQ-026 | Priority: High | Technique: State transition | Automation: Candidate
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';

test.describe('FLOW-LPC-EDIT-023', () => {
  test('FLOW-LPC-EDIT-023 Discard changes reverts pending edits to the last submitted version @edit @step-08 @high', async ({ wizard, steps, editProductId }) => {
  test.fixme(true, 'CANDIDATE: Discard semantics undocumented (G-23).');
    await wizard.gotoEdit(editProductId);
    const original = await steps.general.input('Product Description').inputValue();
    await steps.general.fill('Product Description', `Discard ${Date.now()}`);
    await wizard.saveAndContinue();
    await wizard.discardChangesButton.click();
    await wizard.gotoEdit(editProductId);
    await expect(steps.general.input('Product Description')).toHaveValue(original);
  });
});
