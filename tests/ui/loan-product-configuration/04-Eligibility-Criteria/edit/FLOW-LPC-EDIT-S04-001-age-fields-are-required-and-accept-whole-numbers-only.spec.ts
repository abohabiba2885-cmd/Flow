/**
 * FLOW-LPC-EDIT-S04-001 | Age fields are required and accept whole numbers only
 * Excel: docs/.../FlowSky_Loan_Product_Configuration_Improved_Test_Cases.xlsx -> sheet EDIT_S04_Eligibility (NEW, 17-Oct-2026)
 * Workflow step: LPC-EDIT-STEP-04 - Step 4 - Eligibility Criteria
 * Coverage items: CI-30.1, CI-30.2, CI-30.3, CI-30.4
 * Evidence: Video 02:15-02:27
 * Steps / expected results:
 *   1. Clear Minimum Age and Maximum Age.
 *      -> Save & Continue is disabled.
 *   2. Paste 'abc' into Minimum Age.
 *      -> Field is outlined red with 'Minimum age accepts whole numbers only.'; Save & Continue stays disabled (02:21).
 *   3. Paste 'abc' into Maximum Age.
 *      -> Field is outlined red with 'Maximum age accepts whole numbers only.' (02:21-02:24).
 *   4. Enter 18.5 in Minimum Age.
 *      -> CLARIFY: the message wording implies decimals are rejected with the same message; record actual.
 *   5. Enter 18 in Minimum Age and 65 in Maximum Age.
 *      -> Both messages disappear; Save & Continue is enabled; summary shows 'Age: 18 - 65 years' (02:27; 02:36).
 * Not executed yet - verify locators on the first run.
 */
import { test, expect } from '../../../../../fixtures';
import { advanceEdit } from '../../../../../helpers/navigation/flow';
import { pasteText } from '../../../../../helpers/common/input';

test.describe('FLOW-LPC-EDIT-S04-001', () => {
  test('FLOW-LPC-EDIT-S04-001 Age fields are required and accept whole numbers only @edit @step-04 @high @new', async ({ page, wizard, steps, editProductId }) => {
    await advanceEdit(page, editProductId, 'Eligibility Criteria');
    await steps.eligibility.setToggle('Minimum Monthly Income', false);
    await steps.eligibility.setToggle('Credit Score Requirement', false);
    const min = steps.eligibility.input('Minimum Age');
    const max = steps.eligibility.input('Maximum Age');
    await steps.eligibility.clear('Minimum Age');
    await steps.eligibility.clear('Maximum Age');
    await expect(wizard.saveAndContinueButton).toBeDisabled();
    await pasteText(min, 'abc');
    await expect(page.getByText('Minimum age accepts whole numbers only.')).toBeVisible();
    await expect(wizard.saveAndContinueButton).toBeDisabled();
    await pasteText(max, 'abc');
    await expect(page.getByText('Maximum age accepts whole numbers only.')).toBeVisible();
    // CLARIFY (step 4): decimals are expected to give the same message - inferred from the wording.
    await steps.eligibility.clear('Minimum Age');
    await pasteText(min, '18.5');
    await expect.soft(page.getByText('Minimum age accepts whole numbers only.')).toBeVisible();
    await steps.eligibility.fill('Minimum Age', 18);
    await steps.eligibility.fill('Maximum Age', 65);
    await expect(page.getByText(/age accepts whole numbers only/)).toHaveCount(0);
    await expect(wizard.saveAndContinueButton).toBeEnabled();
    await expect(steps.eligibility.summary).toContainText('Age: 18 - 65 years');
  });
});
