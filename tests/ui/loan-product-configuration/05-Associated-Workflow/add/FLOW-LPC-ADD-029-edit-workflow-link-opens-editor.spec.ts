/**
 * FLOW-LPC-ADD-029 | 'Edit Workflow' link opens the workflow editor without losing the draft
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Add Loan Product Config'
 * Workflow step: Step 05 - Associated Workflow
 * Requirement: LPC-REQ-020 | Priority: Low | Technique: Use case | Automation: Manual
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import * as data from '../../../../../test-data/loan-product-configuration/baseline';
import { advanceAdd } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-ADD-029', () => {
  test('FLOW-LPC-ADD-029 \'Edit Workflow\' link opens the workflow editor without losing the draft @add @step-05 @low', async ({ page, steps }) => {
  test.fixme(true, 'MANUAL: Edit Workflow target not observed.');
    await advanceAdd(page, 'Associated Workflow');
    await steps.workflow.workflowCard(data.workflowName).getByText('Edit Workflow').click();
    await expect(page).not.toHaveURL(/loan-product-config\/add$/);
  });
});
