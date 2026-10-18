/**
 * FLOW-LPC-EDIT-S10-001 | List shows the update: 'With Workflows' counter, PENDING REVIEW and Last Activity
 * Excel: docs/.../FlowSky_Loan_Product_Configuration_Improved_Test_Cases.xlsx -> sheet EDIT_S10_List_After_Update (NEW, 17-Oct-2026)
 * Workflow step: LPC-EDIT-STEP-10 - Product list after update
 * Coverage items: CI-51.2, CI-51.3
 * Evidence: Video 00:00; 03:24-03:30
 * Steps / expected results:
 *   1. Open /loan-product-config and note the 'With Workflows' count W.
 *      -> Counter shows a whole number (observed 44).
 *   2. Edit the QA product: select 'Default Workflow' on Step 5, continue to Merchants and click 'Update Product'.
 *      -> 'Product updated successfully!' and '100% Completed' (03:24).
 *   3. Return to /loan-product-config.
 *      -> 'With Workflows' shows W + 1 (observed 44 -> 45) (03:30).
 *   4. Find the product row.
 *      -> Review Status 'PENDING REVIEW'; Last Activity shows the acting user's name and '0m ago' (03:30).
 *   5. Read the role badge in Last Activity.
 *      -> CLARIFY: the video shows 'Checker' for the maker's update (OQ-14); record actual.
 * Not executed yet - verify locators on the first run.
 */
import { test, expect } from '../../../../../fixtures';
import * as data from '../../../../../test-data/loan-product-configuration/baseline';
import { advanceEdit } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-EDIT-S10-001', () => {
  test('FLOW-LPC-EDIT-S10-001 List shows the update: \'With Workflows\' counter, PENDING REVIEW and Last Activity @edit @step-10 @medium @new', async ({ page, wizard, steps, editProductIdNoWorkflow }) => {
    await wizard.gotoEdit(editProductIdNoWorkflow);
    const code = await steps.general.input('Product Code / ID').inputValue();
    await steps.list.goto();
    const withWorkflows = async () => Number((await page.getByText('With Workflows', { exact: true }).first().locator('xpath=..').innerText()).match(/\d+/)![0]);
    const before = await withWorkflows();
    await advanceEdit(page, editProductIdNoWorkflow, 'Associated Workflow');
    await steps.workflow.selectWorkflow(data.workflowName);
    await wizard.saveAndContinue();
    await wizard.expectOnStep('Decision Engine');
    await wizard.saveAndContinue();
    await wizard.expectOnStep('Merchants');
    await wizard.updateProductButton.click();
    await expect(page.getByText('Product updated successfully!')).toBeVisible();
    await wizard.expectCompletion(100);
    await steps.list.goto();
    expect(await withWorkflows()).toBe(before + 1);
    await steps.list.search(code);
    const row = steps.list.row(code);
    await expect(row).toContainText(/PENDING REVIEW/i);
    await expect(row).toContainText('0m ago');
    test.info().annotations.push({ type: 'OQ-14 Last Activity role (CLARIFY)', description: await row.innerText() });
  });
});
