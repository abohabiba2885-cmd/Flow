/**
 * FLOW-LPC-ADD-011 | Empty Minimum or Maximum Amount blocks Save & Continue
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Add Loan Product Config'
 * Workflow step: Step 02 - Loan Structure
 * Requirement: LPC-REQ-010, LPC-REQ-033 | Priority: High | Technique: Equivalence partitioning | Automation: Automated
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import * as data from '../../../../../test-data/loan-product-configuration/baseline';
import { advanceAdd } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-ADD-011', () => {
  test('FLOW-LPC-ADD-011 Empty Minimum or Maximum Amount blocks Save & Continue @add @step-02 @high', async ({ page, wizard, steps }) => {
    await advanceAdd(page, 'Loan Structure');
    await steps.structure.fillAll(data.loanStructure);
    for (const label of ['Minimum Amount', 'Maximum Amount']) {
      await steps.structure.clear(label);
      await wizard.attemptContinue();
      await wizard.expectOnStep('Loan Structure');
      await steps.structure.fill(label, label === 'Minimum Amount' ? data.loanStructure.minAmount : data.loanStructure.maxAmount);
    }
  });
});
