/**
 * FLOW-LPC-EDIT-S04-004 | Geographic cascade: City and Area disabled without a governorate; unmatched search shows 'No matches found'
 * Excel: docs/.../FlowSky_Loan_Product_Configuration_Improved_Test_Cases.xlsx -> sheet EDIT_S04_Eligibility (NEW, 17-Oct-2026)
 * Workflow step: LPC-EDIT-STEP-04 - Step 4 - Eligibility Criteria
 * Coverage items: CI-34.1, CI-34.2
 * Evidence: Video 02:36
 * Steps / expected results:
 *   1. Read the Geographic section with 'Allowed' selected.
 *      -> Governorate shows 'Select governorate'; City 'Select city' and Area 'Select area' are disabled.
 *   2. Open Governorate and type 'zzzz'.
 *      -> 'No matches found' is shown.
 *   3. Select a governorate (requires seeded data).
 *      -> CLARIFY: City is expected to become enabled; not shown in the video (OQ-19 data).
 * Not executed yet - verify locators on the first run.
 */
import { test, expect } from '../../../../../fixtures';
import { advanceEdit } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-EDIT-S04-004', () => {
  test('FLOW-LPC-EDIT-S04-004 Geographic cascade: City and Area disabled without a governorate; unmatched search shows \'No matches found\' @edit @step-04 @medium @new', async ({ page, steps, editProductId }) => {
    await advanceEdit(page, editProductId, 'Eligibility Criteria');
    await page.getByText('Geographic', { exact: true }).scrollIntoViewIfNeeded();
    await expect(steps.eligibility.dropdown('City')).toBeDisabled();
    await expect(steps.eligibility.dropdown('Area')).toBeDisabled();
    await page.getByText('Select governorate').first().click();
    await page.keyboard.type('zzzz');
    await expect(page.getByText('No matches found')).toBeVisible();
    await page.keyboard.press('Escape');
    // Step 3 (City enabled after a governorate is chosen) needs seeded reference data - OQ-19.
  });
});
