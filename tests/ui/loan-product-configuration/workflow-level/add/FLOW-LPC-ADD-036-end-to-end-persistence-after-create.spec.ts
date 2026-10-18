/**
 * FLOW-LPC-ADD-036 | All values entered during Add are persisted when the product is reopened
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Add Loan Product Config'
 * Workflow step: Cross-step - Wizard, security and persistence
 * Requirement: LPC-REQ-008, LPC-REQ-025 | Priority: Critical | Technique: Use case | Automation: Blocked
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import { advanceAdd } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-ADD-036', () => {
  test('FLOW-LPC-ADD-036 All values entered during Add are persisted when the product is reopened @add @step-08 @critical', async ({ page, wizard, steps }) => {
  test.fixme(true, 'BLOCKED: Final create and id assignment not confirmed (G-03, G-04).');
    const { general } = await advanceAdd(page, 'Merchants');
    await wizard.createProductButton.click();
    const id = wizard.currentProductId();
    expect(id).not.toBeNull();
    await wizard.gotoEdit(id!);
    await expect(steps.general.input('Product Name')).toHaveValue(general.productName);
  });
});
