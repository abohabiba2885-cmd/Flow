/**
 * FLOW-LPC-ADD-008 | Cancel on Step 1 leaves the wizard without creating a product
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Add Loan Product Config'
 * Workflow step: Step 01 - General Information
 * Requirement: LPC-REQ-007 | Priority: High | Technique: State transition | Automation: Automated
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import * as data from '../../../../../test-data/loan-product-configuration/baseline';

test.describe('FLOW-LPC-ADD-008', () => {
  test('FLOW-LPC-ADD-008 Cancel on Step 1 leaves the wizard without creating a product @add @step-01 @high', async ({ page, wizard, steps }) => {
    const d = data.generalInfo();
    await wizard.gotoAdd();
    await steps.general.fillAll(d);
    await wizard.cancelButton.click();
    await expect(page).not.toHaveURL(/\/loan-product-config\/add/);
    await steps.list.goto();
    await steps.list.search(d.productCode!);
    await expect(page.getByText(d.productCode!, { exact: true })).toHaveCount(0);
  });
});
