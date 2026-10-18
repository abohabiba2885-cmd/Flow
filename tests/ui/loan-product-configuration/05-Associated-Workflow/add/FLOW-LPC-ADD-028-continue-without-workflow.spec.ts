/**
 * FLOW-LPC-ADD-028 | Save & Continue stays disabled until a workflow is selected (Add path)
 * Excel: docs/.../FlowSky_Loan_Product_Configuration_Improved_Test_Cases.xlsx -> sheet ADD_S05_Assoc_Workflow (IMPROVED, 17-Oct-2026)
 * Workflow step: LPC-ADD-STEP-05 - Step 5 - Associated Workflow
 * Coverage items: Add path (Not Assessed against the video)
 * Evidence: Video 02:48-02:54 (Edit path)
 * Steps / expected results:
 *   1. Open Associated Workflow without selecting a workflow.
 *      -> No radio is selected and Save & Continue is disabled.
 *   2. Select 'Default Workflow'.
 *      -> Save & Continue becomes enabled.
 *   3. Click Save & Continue.
 *      -> Decision Engine opens.
 * Not executed yet - verify locators on the first run.
 */
import { test, expect } from '../../../../../fixtures';
import * as data from '../../../../../test-data/loan-product-configuration/baseline';
import { advanceAdd } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-ADD-028', () => {
  test('FLOW-LPC-ADD-028 Save & Continue stays disabled until a workflow is selected (Add path) @add @step-05 @high @improved', async ({ page, wizard, steps }) => {
    await advanceAdd(page, 'Associated Workflow');
    await expect(page.getByRole('radio', { checked: true })).toHaveCount(0);
    await expect(wizard.saveAndContinueButton).toBeDisabled();
    await steps.workflow.selectWorkflow(data.workflowName);
    await expect(wizard.saveAndContinueButton).toBeEnabled();
    await wizard.saveAndContinue();
    await wizard.expectOnStep('Decision Engine');
  });
});
