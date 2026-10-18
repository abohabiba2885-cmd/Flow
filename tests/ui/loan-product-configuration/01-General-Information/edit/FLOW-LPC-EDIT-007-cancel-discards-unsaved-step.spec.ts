/**
 * FLOW-LPC-EDIT-007 | Cancel in Edit does not save the current step
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Edit Loan Product Config'
 * Workflow step: Step 01 - General Information
 * Requirement: LPC-REQ-007 | Priority: Medium | Technique: State transition | Automation: Automated
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';

test.describe('FLOW-LPC-EDIT-007', () => {
  test('FLOW-LPC-EDIT-007 Cancel in Edit does not save the current step @edit @step-01 @medium', async ({ wizard, steps, editProductId }) => {
    await wizard.gotoEdit(editProductId);
    const original = await steps.general.input('Product Name').inputValue();
    await steps.general.fill('Product Name', `TEMP ${Date.now()}`);
    await wizard.cancelButton.click();
    await wizard.gotoEdit(editProductId);
    await expect(steps.general.input('Product Name')).toHaveValue(original);
  });
});
