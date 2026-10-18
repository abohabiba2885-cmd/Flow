/**
 * FLOW-LPC-ADD-014 | Previous from Loan Structure returns to Step 1 with data retained
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Add Loan Product Config'
 * Workflow step: Step 02 - Loan Structure
 * Requirement: LPC-REQ-009 | Priority: Medium | Technique: State transition | Automation: Automated
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import { advanceAdd } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-ADD-014', () => {
  test('FLOW-LPC-ADD-014 Previous from Loan Structure returns to Step 1 with data retained @add @step-02 @medium', async ({ page, wizard, steps }) => {
    const { general } = await advanceAdd(page, 'Loan Structure');
    await wizard.previousButton.click();
    await wizard.expectOnStep('General Information');
    await expect(steps.general.input('Product Name')).toHaveValue(general.productName);
    await expect(steps.general.input('Product Code / ID')).toHaveValue(general.productCode!);
  });
});
