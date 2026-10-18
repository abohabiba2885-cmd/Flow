/**
 * FLOW-LPC-ADD-002 | Save & Continue with valid General Information opens Loan Structure
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Add Loan Product Config'
 * Workflow step: Step 01 - General Information
 * Requirement: LPC-REQ-003, LPC-REQ-008 | Priority: Critical | Technique: Use case | Automation: Automated
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import * as data from '../../../../../test-data/loan-product-configuration/baseline';
import { completionPercent } from '../../../../../helpers/data/calc';

test.describe('FLOW-LPC-ADD-002', () => {
  test('FLOW-LPC-ADD-002 Save & Continue with valid General Information opens Loan Structure @add @step-01 @smoke @critical', async ({ wizard, steps }) => {
    await wizard.gotoAdd();
    await steps.general.fillAll(data.generalInfo());
    await wizard.saveAndContinue();
    await wizard.expectOnStep('Loan Structure');
    await wizard.expectStepStatus('General Information', 'Completed');
    await wizard.expectCompletion(completionPercent(1));
  });
});
