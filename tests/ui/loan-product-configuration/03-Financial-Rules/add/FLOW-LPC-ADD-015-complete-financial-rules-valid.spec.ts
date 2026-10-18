/**
 * FLOW-LPC-ADD-015 | Valid Financial Rules saves and opens Eligibility Criteria (43%)
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Add Loan Product Config'
 * Workflow step: Step 03 - Financial Rules
 * Requirement: LPC-REQ-011, LPC-REQ-008 | Priority: Critical | Technique: Use case | Automation: Automated
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import * as data from '../../../../../test-data/loan-product-configuration/baseline';
import { completionPercent } from '../../../../../helpers/data/calc';
import { advanceAdd } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-ADD-015', () => {
  test('FLOW-LPC-ADD-015 Valid Financial Rules saves and opens Eligibility Criteria (43%) @add @step-03 @smoke @critical', async ({ page, wizard, steps }) => {
    await advanceAdd(page, 'Financial Rules');
    await steps.financial.fillAll(data.financialRules);
    await wizard.saveAndContinue();
    await wizard.expectOnStep('Eligibility Criteria');
    await wizard.expectCompletion(completionPercent(3));
  });
});
