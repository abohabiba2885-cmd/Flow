/**
 * FLOW-LPC-ADD-034 | Merchants step is read-only and shows the empty state for a new product
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Add Loan Product Config'
 * Workflow step: Step 07 - Merchants (final step)
 * Requirement: LPC-REQ-023 | Priority: High | Technique: State transition | Automation: Automated
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import { advanceAdd } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-ADD-034', () => {
  test('FLOW-LPC-ADD-034 Merchants step is read-only and shows the empty state for a new product @add @step-07 @high', async ({ page, steps }) => {
    await advanceAdd(page, 'Merchants');
    await expect(steps.merchants.readOnlyNote).toBeVisible();
    await expect(steps.merchants.emptyState).toBeVisible();
    await expect(page.getByRole('button', { name: /Add Merchant|Enable/i })).toHaveCount(0);
  });
});
