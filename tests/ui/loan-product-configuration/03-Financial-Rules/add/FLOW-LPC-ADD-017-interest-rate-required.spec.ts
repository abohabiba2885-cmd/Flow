/**
 * FLOW-LPC-ADD-017 | Empty Interest Rate blocks Save & Continue
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Add Loan Product Config'
 * Workflow step: Step 03 - Financial Rules
 * Requirement: LPC-REQ-011, LPC-REQ-033 | Priority: High | Technique: Equivalence partitioning | Automation: Automated
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import * as data from '../../../../../test-data/loan-product-configuration/baseline';
import { advanceAdd } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-ADD-017', () => {
  test('FLOW-LPC-ADD-017 Empty Interest Rate blocks Save & Continue @add @step-03 @high', async ({ page, wizard, steps }) => {
    await advanceAdd(page, 'Financial Rules');
    await steps.financial.fillAll(data.financialRules);
    await steps.financial.openTab('Interest Rate');
    await steps.financial.clear('Interest Rate');
    await expect.soft(wizard.saveAndContinueButton).toBeDisabled();
    await wizard.attemptContinue();
    await wizard.expectOnStep('Financial Rules');
  });
});
