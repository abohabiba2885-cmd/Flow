/**
 * FLOW-LPC-EDIT-021 | Merchants list is read-only in Edit
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Edit Loan Product Config'
 * Workflow step: Step 07 - Merchants & Update Product
 * Requirement: LPC-REQ-023 | Priority: Medium | Technique: State transition | Automation: Automated
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import { advanceEdit } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-EDIT-021', () => {
  test('FLOW-LPC-EDIT-021 Merchants list is read-only in Edit @edit @step-07 @medium', async ({ page, steps, editProductId }) => {
    await advanceEdit(page, editProductId, 'Merchants');
    await expect(steps.merchants.readOnlyNote).toBeVisible();
    await expect(page.getByRole('button', { name: /Add Merchant|Enable/i })).toHaveCount(0);
  });
});
