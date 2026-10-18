/**
 * FLOW-LPC-EDIT-S04-003 | Credit score 0 keeps Save & Continue disabled; turning the toggle off restores it
 * Excel: docs/.../FlowSky_Loan_Product_Configuration_Improved_Test_Cases.xlsx -> sheet EDIT_S04_Eligibility (NEW, 17-Oct-2026)
 * Workflow step: LPC-EDIT-STEP-04 - Step 4 - Eligibility Criteria
 * Coverage items: CI-32.1, CI-32.2, CI-32.3
 * Evidence: Video 02:33-02:42
 * Steps / expected results:
 *   1. Turn Credit Score Requirement on.
 *      -> 'Minimum Credit Score*' appears with helper 'Minimum credit score required (typically 300-850 range)'.
 *   2. Enter 0.
 *      -> Save & Continue stays disabled; Eligibility Summary lists 'Minimum Credit Score: 0' (02:36-02:41).
 *   3. Turn Credit Score Requirement off.
 *      -> Field is hidden and Save & Continue becomes enabled (02:42).
 * Not executed yet - verify locators on the first run.
 */
import { test, expect } from '../../../../../fixtures';
import { advanceEdit } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-EDIT-S04-003', () => {
  test('FLOW-LPC-EDIT-S04-003 Credit score 0 keeps Save & Continue disabled; turning the toggle off restores it @edit @step-04 @high @new', async ({ page, wizard, steps, editProductId }) => {
    await advanceEdit(page, editProductId, 'Eligibility Criteria');
    await steps.eligibility.fill('Minimum Age', 18);
    await steps.eligibility.fill('Maximum Age', 65);
    await steps.eligibility.setToggle('Minimum Monthly Income', false);
    await steps.eligibility.setToggle('Credit Score Requirement', true);
    await expect(page.getByText('Minimum credit score required (typically 300-850 range)')).toBeVisible();
    await steps.eligibility.fill('Minimum Credit Score', 0);
    await expect(wizard.saveAndContinueButton).toBeDisabled();
    await expect(steps.eligibility.summary).toContainText('Minimum Credit Score: 0');
    await steps.eligibility.setToggle('Credit Score Requirement', false);
    await expect(steps.eligibility.input('Minimum Credit Score')).toBeHidden();
    await expect(wizard.saveAndContinueButton).toBeEnabled();
  });
});
