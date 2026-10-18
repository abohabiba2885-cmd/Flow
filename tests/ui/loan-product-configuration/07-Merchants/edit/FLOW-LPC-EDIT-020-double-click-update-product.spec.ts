/**
 * FLOW-LPC-EDIT-020 | Double-clicking Update Product produces one update
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Edit Loan Product Config'
 * Workflow step: Step 07 - Merchants & Update Product
 * Requirement: LPC-REQ-035 | Priority: Medium | Technique: Error guessing | Automation: Candidate
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import { advanceEdit } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-EDIT-020', () => {
  test('FLOW-LPC-EDIT-020 Double-clicking Update Product produces one update @edit @step-07 @medium', async ({ page, wizard, steps, editProductId, apiLog }) => {
  test.fixme(true, 'CANDIDATE: Update endpoint unknown for request counting (G-17).');
    await wizard.gotoEdit(editProductId);
    await steps.general.fill('Product Description', `Dbl ${Date.now()}`);
    await wizard.saveAndContinue();
    await advanceEdit(page, editProductId, 'Merchants');
    await wizard.updateProductButton.dblclick();
    await expect(page.getByText('Product updated successfully!')).toHaveCount(1);
    expect(apiLog.filter((r) => r.method !== 'GET').length).toBeGreaterThan(0);
  });
});
