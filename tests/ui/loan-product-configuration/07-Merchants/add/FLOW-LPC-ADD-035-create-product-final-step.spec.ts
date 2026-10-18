/**
 * FLOW-LPC-ADD-035 | Final action on Step 7 creates the product and lists it
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Add Loan Product Config'
 * Workflow step: Step 07 - Merchants (final step)
 * Requirement: LPC-REQ-025 | Priority: Critical | Technique: Use case | Automation: Blocked
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import { advanceAdd } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-ADD-035', () => {
  test('FLOW-LPC-ADD-035 Final action on Step 7 creates the product and lists it @add @step-07 @smoke @critical', async ({ page, wizard, steps }) => {
    // G-03: final button observed on staging 16-Oct-2026 as "Save Product" (wizard.createProductButton matches it).
    const { general } = await advanceAdd(page, 'Merchants');
    await wizard.createProductButton.click();
    await wizard.expectCompletion(100);
    await steps.list.goto();
    await steps.list.search(general.productCode!);
    await expect(steps.list.row(general.productCode!)).toBeVisible();
  });
});
