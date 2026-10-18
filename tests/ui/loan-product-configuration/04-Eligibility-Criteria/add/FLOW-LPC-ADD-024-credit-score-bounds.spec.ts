/**
 * FLOW-LPC-ADD-024 | Minimum Credit Score 0 keeps Save & Continue disabled (Add path)
 * Excel: docs/.../FlowSky_Loan_Product_Configuration_Improved_Test_Cases.xlsx -> sheet ADD_S04_Eligibility (IMPROVED, 17-Oct-2026)
 * Workflow step: LPC-ADD-STEP-04 - Step 4 - Eligibility Criteria
 * Coverage items: Add path (Not Assessed against the video)
 * Evidence: Video 02:33-02:42 (Edit path)
 * Steps / expected results:
 *   1. Turn Credit Score Requirement on.
 *      -> 'Minimum Credit Score*' appears with helper 'Minimum credit score required (typically 300-850 range)'.
 *   2. Enter 0.
 *      -> Save & Continue stays disabled.
 *   3. Turn Credit Score Requirement off.
 *      -> Field is hidden and Save & Continue is enabled.
 * Not executed yet - verify locators on the first run.
 */
import { test, expect } from '../../../../../fixtures';
import { advanceAdd } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-ADD-024', () => {
  test('FLOW-LPC-ADD-024 Minimum Credit Score 0 keeps Save & Continue disabled (Add path) @add @step-04 @high @improved', async ({ page, wizard, steps }) => {
    await advanceAdd(page, 'Eligibility Criteria');
    await steps.eligibility.fill('Minimum Age', 18);
    await steps.eligibility.fill('Maximum Age', 65);
    await steps.eligibility.setToggle('Minimum Monthly Income', false);
    await steps.eligibility.setToggle('Credit Score Requirement', true);
    await expect(page.getByText('Minimum credit score required (typically 300-850 range)')).toBeVisible();
    await steps.eligibility.fill('Minimum Credit Score', 0);
    await expect(wizard.saveAndContinueButton).toBeDisabled();
    await steps.eligibility.setToggle('Credit Score Requirement', false);
    await expect(steps.eligibility.input('Minimum Credit Score')).toBeHidden();
    await expect(wizard.saveAndContinueButton).toBeEnabled();
  });
});
