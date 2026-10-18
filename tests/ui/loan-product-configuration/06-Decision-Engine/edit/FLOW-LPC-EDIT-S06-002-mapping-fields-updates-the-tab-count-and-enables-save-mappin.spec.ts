/**
 * FLOW-LPC-EDIT-S06-002 | Mapping fields updates the tab count and enables 'Save Mappings (n)'
 * Excel: docs/.../FlowSky_Loan_Product_Configuration_Improved_Test_Cases.xlsx -> sheet EDIT_S06_Decision_Engine (NEW, 17-Oct-2026)
 * Workflow step: LPC-EDIT-STEP-06 - Step 6 - Decision Engine
 * Coverage items: CI-44.1, CI-44.2
 * Evidence: Video 03:18
 * Adapted to PO decision G-26 (16-Oct-2026): no 'Connect Decision Engine' step; mapping appears on engine selection.
 * Steps / expected results:
 *   1. Open Decision Engine and select 'Credit Lending - Egyptian Banking Rules'.
 *      -> Field Mapping Configuration appears without a Connect step (G-26); 'Save Mappings (0)'.
 *   2. Map Monthly Income (Customer) to 'Monthly Income (number)'.
 *      -> Tab reads 'Personal (1)'; 'Save Mappings (1)' is enabled.
 *   3. Map National ID (Customer) to 'National ID (text)'.
 *      -> Tab reads 'Personal (2)'; button reads 'Save Mappings (2)' (03:18).
 *   4. Look at both mapped rows.
 *      -> A red delete icon is shown next to each mapped Customer value (03:18).
 * Not executed yet - verify locators on the first run.
 */
import { test, expect } from '../../../../../fixtures';
import * as data from '../../../../../test-data/loan-product-configuration/baseline';
import { advanceEdit } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-EDIT-S06-002', () => {
  test('FLOW-LPC-EDIT-S06-002 Mapping fields updates the tab count and enables \'Save Mappings (n)\' @edit @step-06 @medium @new', async ({ page, steps, editProductId }) => {
    await advanceEdit(page, editProductId, 'Decision Engine');

    await steps.engine.chooseEngine(data.decisionEngineName);
    await steps.engine.expectMappingReady(); // G-26: no Connect step - mapping appears on selection
    await expect(steps.engine.connectButton).toHaveCount(0);
    await expect(steps.engine.saveMappingsButton, 'Precondition: EDIT_PRODUCT_ID has no saved mappings for this engine').toContainText('(0)');

    await steps.engine.openMappingTab('personal');
    await steps.engine.mapToCustomer('personal.monthly_income', 'Monthly Income (number)');
    await expect(steps.engine.mappingTab('personal')).toContainText('(1)');
    await expect(steps.engine.saveMappingsButton).toContainText('(1)');
    await expect(steps.engine.saveMappingsButton).toBeEnabled();
    await steps.engine.mapToCustomer('personal.national_id', 'National ID (text)');
    await expect(steps.engine.mappingTab('personal')).toContainText('(2)');
    await expect(steps.engine.saveMappingsButton).toContainText('(2)');
    for (const key of ['personal.monthly_income', 'personal.national_id']) {
      await expect(steps.engine.mappingRow(key).getByRole('button').last(), `${key} delete icon`).toBeVisible();
    }
    // Save Mappings is not clicked (its effect was not shown - clarify).
  });
});
