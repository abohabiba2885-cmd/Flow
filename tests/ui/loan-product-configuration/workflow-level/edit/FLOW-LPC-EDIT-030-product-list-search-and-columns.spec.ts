/**
 * FLOW-LPC-EDIT-030 | Product list search finds the product and shows the documented columns
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Edit Loan Product Config'
 * Workflow step: Step 00 - Open Existing Product (Product list)
 * Requirement: LPC-REQ-027 | Priority: Medium | Technique: Equivalence partitioning | Automation: Automated
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';

test.describe('FLOW-LPC-EDIT-030', () => {
  test('FLOW-LPC-EDIT-030 Product list search finds the product and shows the documented columns @edit @step-00 @medium', async ({ page, wizard, steps, editProductId }) => {
    await wizard.gotoEdit(editProductId);
    const code = await steps.general.input('Product Code / ID').inputValue();
    await steps.list.goto();
    for (const col of ['PRODUCT NAME', 'TYPE', 'CREATED AT', 'ACTIVE VERSION', 'STATUS', 'LAST ACTIVITY', 'REVIEW STATUS', 'ACTIONS']) {
      // Headers are title case in the DOM ("Product Name"); the upper case seen on screen is CSS.
      await expect(page.getByRole('columnheader', { name: new RegExp(`^${col}$`, 'i') })).toBeVisible();
    }
    await steps.list.search(code);
    await expect(steps.list.row(code)).toBeVisible();
  });
});
