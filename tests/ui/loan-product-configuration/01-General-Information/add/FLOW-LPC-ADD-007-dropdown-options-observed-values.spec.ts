/**
 * FLOW-LPC-ADD-007 | Step 1 dropdowns list the observed Product Type options and reference values
 * Excel: docs/.../FlowSky_Loan_Product_Configuration_Improved_Test_Cases.xlsx -> sheet ADD_S01_General_Info (IMPROVED, 17-Oct-2026)
 * Workflow step: LPC-ADD-STEP-01 - Step 1 - General Information
 * Coverage items: CI-04.1
 * Evidence: Video 00:06-00:09
 * Steps / expected results:
 *   1. Click Product Type.
 *      -> Option list opens below the field (00:06).
 *   2. Read the first six options.
 *      -> Options appear in this order: Business Loan, Car Loan, Education Loan, Equipment Loan, Home Loan, Personal (00:06). Any further options are recorded (full list: OQ-12).
 *   3. Select 'Business Loan'.
 *      -> Field shows 'Business Loan' (00:09).
 *   4. Open Currency.
 *      -> 'EGP - Egyptian Pound' is listed.
 *   5. Open Status and Fiscal Year.
 *      -> Status lists 'Active'; Fiscal Year lists '360 days'.
 * Not executed yet - verify locators on the first run.
 */
import { test, expect } from '../../../../../fixtures';

test.describe('FLOW-LPC-ADD-007', () => {
  test('FLOW-LPC-ADD-007 Step 1 dropdowns list the observed Product Type options and reference values @add @step-01 @medium @improved', async ({ page, wizard, steps }) => {
    await wizard.gotoAdd();
    const types = await steps.general.options('Product Type');
    const observed = ['Business Loan', 'Car Loan', 'Education Loan', 'Equipment Loan', 'Home Loan', 'Personal'];
    for (const o of observed) expect(types.some((t) => t.startsWith(o)), `Product Type option '${o}'`).toBeTruthy();
    test.info().annotations.push({ type: 'OQ-12 Product Type options', description: types.join(', ') });
    await steps.general.select('Product Type', 'Business Loan');
    await expect(steps.general.dropdown('Product Type')).toContainText('Business Loan');
    expect(await steps.general.options('Currency')).toContain('EGP - Egyptian Pound');
    expect(await steps.general.options('Status')).toContain('Active');
    expect(await steps.general.options('Fiscal Year')).toContain('360 days');
    await expect(page.getByText('Day-count basis used in rate and late-fee calculations')).toBeVisible();
  });
});
