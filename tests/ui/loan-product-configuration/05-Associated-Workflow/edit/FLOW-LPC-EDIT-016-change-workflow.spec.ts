/**
 * FLOW-LPC-EDIT-016 | Changing the associated workflow persists
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Edit Loan Product Config'
 * Workflow step: Step 05 - Associated Workflow
 * Requirement: LPC-REQ-020 | Priority: High | Technique: Use case | Automation: Automated
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import * as data from '../../../../../test-data/loan-product-configuration/baseline';
import { advanceEdit } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-EDIT-016', () => {
  test('FLOW-LPC-EDIT-016 Changing the associated workflow persists @edit @step-05 @high', async ({ page, wizard, steps, editProductId }) => {
    await advanceEdit(page, editProductId, 'Associated Workflow');
    await steps.workflow.selectWorkflow(data.workflowName);
    await wizard.saveAndContinue();
    await wizard.expectOnStep('Decision Engine');
    await wizard.previousButton.click();
    await expect(steps.workflow.workflowCard(data.workflowName).getByRole('radio').first()).toBeChecked();
  });
});
