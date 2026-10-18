/**
 * FLOW-LPC-ADD-S00A-001 | Loan Products list shows counters, search, filters, columns and pagination
 * Excel: docs/.../FlowSky_Loan_Product_Configuration_Improved_Test_Cases.xlsx -> sheet ADD_S00A_Product_List (NEW, 17-Oct-2026)
 * Workflow step: LPC-ADD-STEP-00A - Loan Products list (entry point)
 * Coverage items: CI-01.1, CI-01.2, CI-01.3, CI-01.4, CI-01.5
 * Evidence: Video 00:00; 03:30
 * Steps / expected results:
 *   1. Open /loan-product-config.
 *      -> Heading 'Loan Products', subtitle 'Manage and configure loan products for your operations' and button '+ Add Loan Product' are shown.
 *   2. Read the three counter cards.
 *      -> 'Loan Products', 'Active Products' and 'With Workflows' each show a whole number; 'Loan Products' equals N in the table caption 'Loan Products (N)' (observed 561 / 561).
 *   3. Read the filter bar.
 *      -> Search box placeholder 'Search products by name, ID, or description...'; filters show 'All Statuses', 'All Types', 'All Review Status' and 'Default'.
 *   4. Read the table header.
 *      -> Columns: PRODUCT NAME, TYPE, CREATED AT, ACTIVE VERSION, STATUS, LAST ACTIVITY, REVIEW STATUS, ACTIONS.
 *   5. Read the pagination text.
 *      -> 'Page 1 of M' is shown (observed 'Page 1 of 57' for 561 products).
 *   6. Type the QA product code in the search box and press Enter.
 *      -> The product's row is listed with its code under the name.
 * Not executed yet - verify locators on the first run.
 */
import { test, expect } from '../../../../../fixtures';

test.describe('FLOW-LPC-ADD-S00A-001', () => {
  test('FLOW-LPC-ADD-S00A-001 Loan Products list shows counters, search, filters, columns and pagination @add @step-00a @medium @new', async ({ page, wizard, steps, editProductId }) => {
    await wizard.gotoEdit(editProductId);
    const code = await steps.general.input('Product Code / ID').inputValue();
    await steps.list.goto();
    await expect(page.getByText('Manage and configure loan products for your operations')).toBeVisible();
    await expect(steps.list.addButton).toBeVisible();
    for (const c of ['Loan Products', 'Active Products', 'With Workflows']) await expect(page.getByText(c, { exact: true }).first()).toBeVisible();
    const caption = await page.getByText(/Loan Products \(\d+\)/).first().innerText();
    const total = caption.match(/\((\d+)\)/)![1];
    await expect(page.getByText('Loan Products', { exact: true }).first().locator('xpath=..')).toContainText(total);
    await expect(page.getByPlaceholder('Search products by name, ID, or description...')).toBeVisible();
    for (const f of ['All Statuses', 'All Types', 'All Review Status', 'Default']) await expect(page.getByText(f, { exact: true }).first()).toBeVisible();
    for (const col of ['PRODUCT NAME', 'TYPE', 'CREATED AT', 'ACTIVE VERSION', 'STATUS', 'LAST ACTIVITY', 'REVIEW STATUS', 'ACTIONS']) {
      await expect(page.getByText(col, { exact: true }).first()).toBeVisible();
    }
    await expect(page.getByText(/Page 1 of \d+/)).toBeVisible();
    await steps.list.search(code);
    await expect(steps.list.row(code)).toBeVisible();
  });
});
