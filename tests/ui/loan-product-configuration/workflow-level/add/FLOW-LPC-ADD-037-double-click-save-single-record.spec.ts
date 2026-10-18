/**
 * FLOW-LPC-ADD-037 | Double-clicking Save & Continue on Step 1 creates one product
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Add Loan Product Config'
 * Workflow step: Cross-step - Wizard, security and persistence
 * Requirement: LPC-REQ-035 | Priority: High | Technique: Error guessing | Automation: Automated
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import * as data from '../../../../../test-data/loan-product-configuration/baseline';

test.describe('FLOW-LPC-ADD-037', () => {
  test('FLOW-LPC-ADD-037 Double-clicking Save & Continue on Step 1 creates one product @add @step-08 @high', async ({ page, wizard, steps }) => {
    const d = data.generalInfo();
    await wizard.gotoAdd();
    await steps.general.fillAll(d);
    await wizard.saveAndContinueButton.dblclick();
    await wizard.expectOnStep('Loan Structure');
    await steps.list.goto();
    await steps.list.search(d.productCode!);
    await expect(page.getByText(d.productCode!, { exact: true })).toHaveCount(1);
  });
});
