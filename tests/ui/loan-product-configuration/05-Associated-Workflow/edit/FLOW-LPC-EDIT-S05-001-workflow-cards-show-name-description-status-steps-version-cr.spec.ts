/**
 * FLOW-LPC-EDIT-S05-001 | Workflow cards show name, description, status, steps, version, creator and 'Edit Workflow'
 * Excel: docs/.../FlowSky_Loan_Product_Configuration_Improved_Test_Cases.xlsx -> sheet EDIT_S05_Assoc_Workflow (NEW, 17-Oct-2026)
 * Workflow step: LPC-EDIT-STEP-05 - Step 5 - Associated Workflow
 * Coverage items: CI-37.1
 * Evidence: Video 02:45-02:48
 * Steps / expected results:
 *   1. Read the step heading.
 *      -> 'Select Workflow' with 'Associate this loan product with a specific workflow to define the application process steps.'
 *   2. Read the 'Default Workflow' card.
 *      -> Radio button, name 'Default Workflow', description 'Default workflow for credit accounts', badge 'active', a steps badge, version 'v1.0.0', 'Created by: System' and 'Edit Workflow' link.
 *   3. Read the steps badge text.
 *      -> Reads '<n> steps' (video shows '0 steps steps' - copy defect, OQ-17).
 * Not executed yet - verify locators on the first run.
 */
import { test, expect } from '../../../../../fixtures';
import * as data from '../../../../../test-data/loan-product-configuration/baseline';
import { advanceEdit } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-EDIT-S05-001', () => {
  test('FLOW-LPC-EDIT-S05-001 Workflow cards show name, description, status, steps, version, creator and \'Edit Workflow\' @edit @step-05 @medium @new', async ({ page, steps, editProductId }) => {
    await advanceEdit(page, editProductId, 'Associated Workflow');
    await expect(page.getByText('Select Workflow')).toBeVisible();
    await expect(page.getByText('Associate this loan product with a specific workflow to define the application process steps.')).toBeVisible();
    const card = steps.workflow.workflowCard(data.workflowName);
    await expect(card.getByRole('radio')).toHaveCount(1);
    await expect(card).toContainText('Default workflow for credit accounts');
    await expect(card).toContainText('active');
    await expect(card).toContainText('v1.0.0');
    await expect(card).toContainText('Created by: System');
    await expect(card).toContainText('Edit Workflow');
    await expect.soft(card, 'OQ-17: steps badge copy').not.toContainText('steps steps');
  });
});
