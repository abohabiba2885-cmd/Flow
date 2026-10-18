/**
 * FLOW-LPC-ADD-027 | Select a workflow and continue to Decision Engine
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Add Loan Product Config'
 * Workflow step: Step 05 - Associated Workflow
 * Requirement: LPC-REQ-020 | Priority: Critical | Technique: Use case | Automation: Automated
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import * as data from '../../../../../test-data/loan-product-configuration/baseline';
import { advanceAdd } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-ADD-027', () => {
  test('FLOW-LPC-ADD-027 Select a workflow and continue to Decision Engine @add @step-05 @smoke @critical', async ({ page, wizard, steps }) => {
    await advanceAdd(page, 'Associated Workflow');
    await expect(steps.workflow.workflowCard(data.workflowName)).toContainText('Edit Workflow');
    await steps.workflow.selectWorkflow(data.workflowName);
    await wizard.saveAndContinue();
    await wizard.expectOnStep('Decision Engine');
  });
});
