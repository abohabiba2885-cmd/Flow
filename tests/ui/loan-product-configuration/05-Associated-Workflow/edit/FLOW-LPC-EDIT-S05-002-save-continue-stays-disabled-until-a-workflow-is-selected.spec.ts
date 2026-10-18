/**
 * FLOW-LPC-EDIT-S05-002 | Save & Continue stays disabled until a workflow is selected
 * Excel: docs/.../FlowSky_Loan_Product_Configuration_Improved_Test_Cases.xlsx -> sheet EDIT_S05_Assoc_Workflow (NEW, 17-Oct-2026)
 * Workflow step: LPC-EDIT-STEP-05 - Step 5 - Associated Workflow
 * Coverage items: CI-38.1, CI-38.2, CI-38.3
 * Evidence: Video 02:48-02:54
 * Steps / expected results:
 *   1. Open Associated Workflow.
 *      -> No radio is selected; Save & Continue is disabled (02:48).
 *   2. Select 'Default Workflow'.
 *      -> Radio is selected; Save & Continue is enabled (02:51).
 *   3. Click Save & Continue.
 *      -> Decision Engine opens; Associated Workflow shows 'Completed'; header shows '71% Completed' (02:54).
 * Not executed yet - verify locators on the first run.
 */
import { test, expect } from '../../../../../fixtures';
import * as data from '../../../../../test-data/loan-product-configuration/baseline';
import { advanceEdit } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-EDIT-S05-002', () => {
  test('FLOW-LPC-EDIT-S05-002 Save & Continue stays disabled until a workflow is selected @edit @step-05 @high @new', async ({ page, wizard, steps, editProductIdNoWorkflow }) => {
    await advanceEdit(page, editProductIdNoWorkflow, 'Associated Workflow');
    await expect(page.getByRole('radio', { checked: true })).toHaveCount(0);
    await expect(wizard.saveAndContinueButton).toBeDisabled();
    await steps.workflow.selectWorkflow(data.workflowName);
    await expect(wizard.saveAndContinueButton).toBeEnabled();
    await wizard.saveAndContinue();
    await wizard.expectOnStep('Decision Engine');
    await wizard.expectStepStatus('Associated Workflow', 'Completed');
    await wizard.expectCompletion(71);
  });
});
