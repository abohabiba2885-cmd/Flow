/**
 * FLOW-LPC-ADD-S01-001 | Step 1 shows required markers, placeholders and defaults
 * Excel: docs/.../FlowSky_Loan_Product_Configuration_Improved_Test_Cases.xlsx -> sheet ADD_S01_General_Info (NEW, 17-Oct-2026)
 * Workflow step: LPC-ADD-STEP-01 - Step 1 - General Information
 * Coverage items: CI-03.1, CI-03.2, CI-03.3
 * Evidence: Video 00:03
 * Steps / expected results:
 *   1. Read the field labels in General Information.
 *      -> A red * follows Product Name, Product Code / ID, Product Type, Currency and Fiscal Year; Status and Product Description have no *.
 *   2. Read the empty-field placeholders.
 *      -> Product Name 'e.g., Micro Business Loan, Group Lending Product'; Product Code / ID 'e.g., MF-001, GL-001'; Product Type 'Select a product type'; Product Description 'Enter detailed product description'.
 *   3. Read the default values.
 *      -> Currency is empty; Status shows 'Active'; Fiscal Year shows '360 days' with helper 'Day-count basis used in rate and late-fee calculations'.
 *   4. Read the description counter.
 *      -> '0/1000 characters' is shown below Product Description.
 * Not executed yet - verify locators on the first run.
 */
import { test, expect } from '../../../../../fixtures';

test.describe('FLOW-LPC-ADD-S01-001', () => {
  test('FLOW-LPC-ADD-S01-001 Step 1 shows required markers, placeholders and defaults @add @step-01 @high @new', async ({ page, wizard, steps }) => {
    await wizard.gotoAdd();
    for (const label of ['Product Name', 'Product Code / ID', 'Product Type', 'Currency', 'Fiscal Year']) {
      await expect(steps.general.requiredMarker(label), `${label} should show *`).toBeVisible();
    }
    await expect(page.getByPlaceholder('e.g., Micro Business Loan, Group Lending Product')).toBeVisible();
    await expect(page.getByPlaceholder('e.g., MF-001, GL-001')).toBeVisible();
    await expect(page.getByText('Select a product type').first()).toBeVisible();
    await expect(page.getByPlaceholder('Enter detailed product description')).toBeVisible();
    await expect(steps.general.dropdown('Status')).toContainText('Active');
    await expect(steps.general.dropdown('Fiscal Year')).toContainText('360 days');
    await expect(page.getByText('Day-count basis used in rate and late-fee calculations')).toBeVisible();
    await expect(steps.general.dropdown('Currency')).not.toContainText('EGP');
    await expect(steps.general.descriptionCounter).toContainText('0/1000 characters');
  });
});
