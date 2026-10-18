/**
 * FLOW-LPC-ADD-013 | Down payment min % above max % or above 100 is rejected
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Add Loan Product Config'
 * Workflow step: Step 02 - Loan Structure
 * Requirement: LPC-REQ-010 | Priority: Medium | Technique: Boundary value analysis | Automation: Automated
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import * as data from '../../../../../test-data/loan-product-configuration/baseline';
import { advanceAdd } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-ADD-013', () => {
  test('FLOW-LPC-ADD-013 Down payment min % above max % or above 100 is rejected @add @step-02 @medium', async ({ page, wizard, steps }) => {
    await advanceAdd(page, 'Loan Structure');
    await steps.structure.fillAll(data.loanStructure);
    await steps.structure.fill('Minimum Down Payment (%)', 60);
    await steps.structure.fill('Maximum Down Payment (%)', 50);
    await wizard.attemptContinue();
    await wizard.expectOnStep('Loan Structure');
    await steps.structure.fill('Minimum Down Payment (%)', 10);
    await steps.structure.fill('Maximum Down Payment (%)', 101);
    await wizard.attemptContinue();
    await wizard.expectOnStep('Loan Structure');
    await steps.structure.fill('Maximum Down Payment (%)', 100);
    await wizard.saveAndContinue();
    await wizard.expectOnStep('Financial Rules');
  });
});
