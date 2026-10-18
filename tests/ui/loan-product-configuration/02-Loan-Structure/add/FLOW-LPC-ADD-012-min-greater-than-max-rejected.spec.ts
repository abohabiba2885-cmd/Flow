/**
 * FLOW-LPC-ADD-012 | Minimum greater than maximum (amount, months) is rejected
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Add Loan Product Config'
 * Workflow step: Step 02 - Loan Structure
 * Requirement: LPC-REQ-010 | Priority: High | Technique: Decision table | Automation: Automated
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import * as data from '../../../../../test-data/loan-product-configuration/baseline';
import { advanceAdd } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-ADD-012', () => {
  test('FLOW-LPC-ADD-012 Minimum greater than maximum (amount, months) is rejected @add @step-02 @high', async ({ page, wizard, steps }) => {
    await advanceAdd(page, 'Loan Structure');
    await steps.structure.fillAll(data.loanStructure);
    await steps.structure.fill('Minimum Amount', data.loanStructure.maxAmount + 1);
    await wizard.attemptContinue();
    await wizard.expectOnStep('Loan Structure');
    await steps.structure.fill('Minimum Amount', data.loanStructure.minAmount);
    await steps.structure.fill('Min Months', data.loanStructure.maxMonths + 1);
    await wizard.attemptContinue();
    await wizard.expectOnStep('Loan Structure');
  });
});
