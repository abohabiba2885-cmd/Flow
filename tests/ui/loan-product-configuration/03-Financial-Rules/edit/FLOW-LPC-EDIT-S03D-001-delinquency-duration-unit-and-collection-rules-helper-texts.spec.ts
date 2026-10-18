/**
 * FLOW-LPC-EDIT-S03D-001 | Delinquency Duration Unit and Collection Rules helper texts are shown and retained
 * Excel: docs/.../FlowSky_Loan_Product_Configuration_Improved_Test_Cases.xlsx -> sheet EDIT_S03D_FR_Collection (NEW, 17-Oct-2026)
 * Workflow step: LPC-EDIT-STEP-03D - Step 3 - Financial Rules: Collection Rules tab
 * Coverage items: CI-23.4, CI-23.5
 * Evidence: Video 00:57; 01:30
 * Steps / expected results:
 *   1. Read the 'Delinquency & First Installment' section.
 *      -> DELINQUENCY DURATION MODE 'Exact Days', DELINQUENCY DURATION UNIT 'Calendar Days', FIRST INSTALLMENT STATUS 'Pending', TRANSFER TO COLLECTION AFTER '0'.
 *   2. Read the helper under Transfer to Collection After.
 *      -> 'Calendar days overdue before the account moves to collection.'
 *   3. Read 'Installment Collection Schedule'.
 *      -> FIRST INSTALLMENT DUE 'On Disbursement Date' with helper 'The first installment is due on the loan disbursement date.'
 *   4. Open Delinquency Duration Unit.
 *      -> Dropdown opens with 'Calendar Days' selected; record the other options (OQ-15).
 *   5. Close it, click Save & Continue, then Previous back to Collection Rules.
 *      -> Eligibility Criteria opens after saving; on return the unit is still 'Calendar Days' and Transfer to Collection After is still 0.
 * Not executed yet - verify locators on the first run.
 */
import { test, expect } from '../../../../../fixtures';
import { advanceEdit, settleEditReload } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-EDIT-S03D-001', () => {
  test('FLOW-LPC-EDIT-S03D-001 Delinquency Duration Unit and Collection Rules helper texts are shown and retained @edit @step-03d @medium @new', async ({ page, wizard, steps, editProductId }) => {
    await advanceEdit(page, editProductId, 'Financial Rules');
    await steps.financial.openTab('Collection Rules');
    await expect(page.getByText('Delinquency & First Installment')).toBeVisible();
    for (const l of ['DELINQUENCY DURATION MODE', 'DELINQUENCY DURATION UNIT', 'FIRST INSTALLMENT STATUS', 'TRANSFER TO COLLECTION AFTER']) {
      await expect(page.getByText(l, { exact: true }).first()).toBeVisible();
    }
    await expect(steps.financial.dropdown('DELINQUENCY DURATION UNIT')).toContainText('Calendar Days');
    await expect(page.getByText('Calendar days overdue before the account moves to collection.')).toBeVisible();
    await expect(steps.financial.dropdown('FIRST INSTALLMENT DUE')).toContainText('On Disbursement Date');
    await expect(page.getByText('The first installment is due on the loan disbursement date.')).toBeVisible();
    const unitOptions = await steps.financial.options('DELINQUENCY DURATION UNIT');
    test.info().annotations.push({ type: 'OQ-15 Delinquency Duration Unit options', description: unitOptions.join(', ') });
    await wizard.saveAndContinue();
    await wizard.expectOnStep('Eligibility Criteria');
    await wizard.previousButton.click();
    await settleEditReload(page, editProductId);
    await steps.financial.openTab('Collection Rules');
    await expect(steps.financial.dropdown('DELINQUENCY DURATION UNIT')).toContainText('Calendar Days');
    await expect(steps.financial.input('TRANSFER TO COLLECTION AFTER')).toHaveValue('0');
  });
});
