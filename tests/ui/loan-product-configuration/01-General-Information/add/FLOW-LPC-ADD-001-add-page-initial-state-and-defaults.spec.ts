/**
 * FLOW-LPC-ADD-001 | '+ Add Loan Product' opens the Add page on Step 1 with 0% and pending steps
 * Excel: docs/.../FlowSky_Loan_Product_Configuration_Improved_Test_Cases.xlsx -> sheet ADD_S00B_Open_Add_Page (IMPROVED, 17-Oct-2026)
 * Workflow step: LPC-ADD-STEP-00B - Open Add page
 * Coverage items: CI-02.1, CI-02.2
 * Evidence: Video 00:00-00:03
 * Steps / expected results:
 *   1. Open /loan-product-config.
 *      -> 'Loan Products' list loads with the '+ Add Loan Product' button (00:00).
 *   2. Click '+ Add Loan Product'.
 *      -> URL becomes /loan-product-config/add; header 'Create New Loan Product' and breadcrumb 'Loan Product Configuration / Add New Product' are shown (00:03).
 *   3. Read the header progress.
 *      -> '0% Completed' is shown (00:03).
 *   4. Read the stepper.
 *      -> General Information shows 'In Progress'; Loan Structure, Financial Rules, Eligibility Criteria, Associated Workflow, Decision Engine and Merchants show 'Pending' (00:03).
 * Not executed yet - verify locators on the first run.
 */
import { test, expect } from '../../../../../fixtures';
import { STEP_NAMES } from '../../../../../pages/loan-product-configuration/LoanProductWizardPage';

test.describe('FLOW-LPC-ADD-001', () => {
  test('FLOW-LPC-ADD-001 \'+ Add Loan Product\' opens the Add page on Step 1 with 0% and pending steps @add @step-00b @critical @improved', async ({ page, wizard, steps }) => {
    await steps.list.goto();
    await steps.list.addButton.click();
    await expect(page).toHaveURL(/\/loan-product-config\/add/);
    await expect(page.getByText('Create New Loan Product')).toBeVisible();
    await expect(page.getByText('Add New Product').first()).toBeVisible();
    await wizard.expectCompletion(0);
    await wizard.expectStepStatus('General Information', 'In Progress');
    for (const s of STEP_NAMES.slice(1)) await wizard.expectStepStatus(s, 'Pending');
  });
});
