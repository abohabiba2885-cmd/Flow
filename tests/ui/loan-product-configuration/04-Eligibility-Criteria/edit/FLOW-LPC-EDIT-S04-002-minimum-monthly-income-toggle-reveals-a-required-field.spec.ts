/**
 * FLOW-LPC-EDIT-S04-002 | Minimum Monthly Income toggle reveals a required field
 * Excel: docs/.../FlowSky_Loan_Product_Configuration_Improved_Test_Cases.xlsx -> sheet EDIT_S04_Eligibility (NEW, 17-Oct-2026)
 * Workflow step: LPC-EDIT-STEP-04 - Step 4 - Eligibility Criteria
 * Coverage items: CI-31.1, CI-31.2
 * Evidence: Video 02:30-02:33
 * Steps / expected results:
 *   1. Turn Minimum Monthly Income on.
 *      -> 'Minimum Monthly Income (EGP)*' appears with placeholder 'e.g., 5000' and helper 'Customers must have at least this monthly income to be eligible'.
 *   2. Leave the field empty.
 *      -> Save & Continue is disabled (02:33).
 *   3. Enter 5000.
 *      -> Save & Continue is enabled.
 *   4. Turn Minimum Monthly Income off.
 *      -> The field is hidden and Save & Continue stays enabled.
 * Not executed yet - verify locators on the first run.
 */
import { test, expect } from '../../../../../fixtures';
import { advanceEdit } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-EDIT-S04-002', () => {
  test('FLOW-LPC-EDIT-S04-002 Minimum Monthly Income toggle reveals a required field @edit @step-04 @high @new', async ({ page, wizard, steps, editProductId }) => {
    await advanceEdit(page, editProductId, 'Eligibility Criteria');
    await steps.eligibility.fill('Minimum Age', 18);
    await steps.eligibility.fill('Maximum Age', 65);
    await steps.eligibility.setToggle('Credit Score Requirement', false);
    await steps.eligibility.setToggle('Minimum Monthly Income', true);
    await expect(page.getByPlaceholder('e.g., 5000')).toBeVisible();
    await expect(page.getByText('Customers must have at least this monthly income to be eligible')).toBeVisible();
    await steps.eligibility.clear('Minimum Monthly Income (EGP)');
    await expect(wizard.saveAndContinueButton).toBeDisabled();
    await steps.eligibility.fill('Minimum Monthly Income (EGP)', 5000);
    await expect(wizard.saveAndContinueButton).toBeEnabled();
    await steps.eligibility.setToggle('Minimum Monthly Income', false);
    await expect(page.getByPlaceholder('e.g., 5000')).toBeHidden();
    await expect(wizard.saveAndContinueButton).toBeEnabled();
  });
});
