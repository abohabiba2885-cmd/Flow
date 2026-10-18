/**
 * FLOW-LPC-EDIT-019 | Values submitted with Update Product are shown on reopening
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Edit Loan Product Config'
 * Workflow step: Step 07 - Merchants & Update Product
 * Requirement: LPC-REQ-024 | Priority: Critical | Technique: Use case | Automation: Automated
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import { advanceEdit } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-EDIT-019', () => {
  test('FLOW-LPC-EDIT-019 Values submitted with Update Product are shown on reopening @edit @step-07 @critical', async ({ page, wizard, steps, editProductId }) => {
    const text = `Persist ${Date.now()}`;
    await wizard.gotoEdit(editProductId);
    await steps.general.fill('Product Description', text);
    await wizard.saveAndContinue();
    await advanceEdit(page, editProductId, 'Merchants');
    await wizard.updateProductButton.click();
    await expect(page.getByText('Product updated successfully!')).toBeVisible();
    await wizard.gotoEdit(editProductId);
    await expect(steps.general.input('Product Description')).toHaveValue(text);
  });
});
