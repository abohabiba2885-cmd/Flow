/**
 * FLOW-LPC-EDIT-018 | Update Product succeeds and sets Review Status to PENDING REVIEW
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Edit Loan Product Config'
 * Workflow step: Step 07 - Merchants & Update Product
 * Requirement: LPC-REQ-024 | Priority: Critical | Technique: Use case | Automation: Automated
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import { advanceEdit } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-EDIT-018', () => {
  test('FLOW-LPC-EDIT-018 Update Product succeeds and sets Review Status to PENDING REVIEW @edit @step-07 @smoke @critical', async ({ page, wizard, steps, editProductId }) => {
    await wizard.gotoEdit(editProductId);
    const code = await steps.general.input('Product Code / ID').inputValue();
    await steps.general.fill('Product Description', `Updated ${Date.now()}`);
    await wizard.saveAndContinue();
    await advanceEdit(page, editProductId, 'Merchants');
    await wizard.updateProductButton.click();
    await expect(page.getByText('Product updated successfully!')).toBeVisible();
    await wizard.expectCompletion(100);
    await expect(wizard.changeBanner).toBeHidden();
    await steps.list.goto();
    await steps.list.search(code);
    await expect(steps.list.row(code)).toContainText(/PENDING REVIEW/i);
  });
});
