/**
 * FLOW-LPC-ADD-010 | Valid Loan Structure saves and opens Financial Rules (29%)
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Add Loan Product Config'
 * Workflow step: Step 02 - Loan Structure
 * Requirement: LPC-REQ-010, LPC-REQ-008 | Priority: Critical | Technique: Use case | Automation: Automated
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import * as data from '../../../../../test-data/loan-product-configuration/baseline';
import { completionPercent } from '../../../../../helpers/data/calc';
import { advanceAdd } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-ADD-010', () => {
  test('FLOW-LPC-ADD-010 Valid Loan Structure saves and opens Financial Rules (29%) @add @step-02 @smoke @critical', async ({ page, wizard, steps }) => {
    await advanceAdd(page, 'Loan Structure');
    await steps.structure.fillAll(data.loanStructure);
    await wizard.saveAndContinue();
    await wizard.expectOnStep('Financial Rules');
    await wizard.expectStepStatus('Loan Structure', 'Completed');
    await wizard.expectCompletion(completionPercent(2));
  });
});
