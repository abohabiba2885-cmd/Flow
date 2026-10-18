/**
 * FLOW-LPC-EDIT-S06-001 | Field mapping lists engine fields, defaults to 'No mapping' and disables used customer options
 * Excel: docs/.../FlowSky_Loan_Product_Configuration_Improved_Test_Cases.xlsx -> sheet EDIT_S06_Decision_Engine (NEW, 17-Oct-2026)
 * Workflow step: LPC-EDIT-STEP-06 - Step 6 - Decision Engine
 * Coverage items: CI-43.1, CI-43.2, CI-43.3, CI-43.4
 * Evidence: Video 03:06-03:15
 * Adapted to PO decision G-26 (16-Oct-2026): no 'Connect Decision Engine' step; mapping appears on engine selection.
 * Steps / expected results:
 *   1. Open Decision Engine and select 'Credit Lending - Egyptian Banking Rules'.
 *      -> Field Mapping Configuration appears without a Connect step (G-26); 'Save Mappings (0)'.
 *   2. Open the Financial tab.
 *      -> Rows Credit Score*, Defaults Count*, Payment History Score*, Total Debt*, Debt-to-Income Ratio*, each with its key (e.g. financial.credit_score) and type badge 'number' (03:06).
 *   3. Read the Workflow and Customer dropdowns of each row.
 *      -> Every dropdown shows 'No mapping'.
 *   4. Open the Personal tab.
 *      -> Rows Monthly Income* (personal.monthly_income, number) and National ID* (personal.national_id, string) (03:12).
 *   5. Open Customer for Monthly Income.
 *      -> Options: No mapping, Full Name (text), Email (email), Phone Number (text), National ID (text), Date of Birth (date), Age (number), Gender (text), Marital Status (text), Address (text), City (text), Country (text), Employer (text), Employment Type (text), Monthly Income (number), Credit Score (number) (03:12).
 *   6. Select 'Monthly Income (number)', then open Customer for National ID.
 *      -> 'Monthly Income (number)' is shown greyed out (not selectable) (03:15).
 * Not executed yet - verify locators on the first run.
 */
import { test, expect } from '../../../../../fixtures';
import * as data from '../../../../../test-data/loan-product-configuration/baseline';
import { advanceEdit } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-EDIT-S06-001', () => {
  test('FLOW-LPC-EDIT-S06-001 Field mapping lists engine fields, defaults to \'No mapping\' and disables used customer options @edit @step-06 @high @new', async ({ page, steps, editProductId }) => {
    await advanceEdit(page, editProductId, 'Decision Engine');

    await steps.engine.chooseEngine(data.decisionEngineName);
    await steps.engine.expectMappingReady(); // G-26: no Connect step - mapping appears on selection
    await expect(steps.engine.connectButton).toHaveCount(0);
    await expect(steps.engine.saveMappingsButton, 'Precondition: EDIT_PRODUCT_ID has no saved mappings for this engine').toContainText('(0)');

    await steps.engine.openMappingTab('financial');
    const panel = page.getByRole('tabpanel');
    for (const f of ['Credit Score', 'Defaults Count', 'Payment History Score', 'Total Debt', 'Debt-to-Income Ratio']) await expect(panel).toContainText(f);
    const credit = steps.engine.mappingRow('financial.credit_score');
    await expect(credit).toContainText('number');
    await expect(credit.getByRole('combobox')).toHaveCount(2);
    for (const cb of await credit.getByRole('combobox').all()) await expect(cb).toContainText('No mapping');
    await steps.engine.openMappingTab('personal');
    await expect(steps.engine.mappingRow('personal.monthly_income')).toContainText('number');
    await expect(steps.engine.mappingRow('personal.national_id')).toContainText('string');
    await steps.engine.mappingRow('personal.monthly_income').getByRole('combobox').nth(1).click();
    const expected = ['Full Name (text)', 'Email (email)', 'Phone Number (text)', 'National ID (text)', 'Date of Birth (date)', 'Age (number)', 'Gender (text)',
      'Marital Status (text)', 'Address (text)', 'City (text)', 'Country (text)', 'Employer (text)', 'Employment Type (text)', 'Monthly Income (number)', 'Credit Score (number)'];
    for (const o of expected) await expect(page.getByRole('option', { name: o, exact: true })).toBeVisible();
    await page.getByRole('option', { name: 'Monthly Income (number)', exact: true }).click();
    await steps.engine.mappingRow('personal.national_id').getByRole('combobox').nth(1).click();
    await expect(page.getByRole('option', { name: 'Monthly Income (number)', exact: true })).toBeDisabled();
    await page.keyboard.press('Escape');
    // Mappings are not saved: navigating away discards them, so EDIT_PRODUCT_ID is unchanged.
  });
});
