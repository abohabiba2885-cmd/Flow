/**
 * FLOW-LPC-EDIT-001 | Edit page opens an existing product with saved values
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Edit Loan Product Config'
 * Workflow step: Step 00 - Open Existing Product (Product list)
 * Requirement: LPC-REQ-001, LPC-REQ-008 | Priority: Critical | Technique: Use case | Automation: Automated
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';

test.describe('FLOW-LPC-EDIT-001', () => {
  test('FLOW-LPC-EDIT-001 Edit page opens an existing product with saved values @edit @step-00 @smoke @critical', async ({ page, wizard, steps, editProductId }) => {
    await wizard.gotoEdit(editProductId);
    await expect(page.getByText('Edit Product').first()).toBeVisible();
    await expect(steps.general.input('Product Name')).not.toHaveValue('');
    await expect(steps.general.input('Product Code / ID')).not.toHaveValue('');
  });
});
