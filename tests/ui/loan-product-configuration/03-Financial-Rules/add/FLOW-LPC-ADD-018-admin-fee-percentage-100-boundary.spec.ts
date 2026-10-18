/**
 * FLOW-LPC-ADD-018 | Admin fee percentage accepts 100 and rejects values above 100
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Add Loan Product Config'
 * Workflow step: Step 03 - Financial Rules
 * Requirement: LPC-REQ-011 | Priority: High | Technique: Boundary value analysis | Automation: Automated
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import * as data from '../../../../../test-data/loan-product-configuration/baseline';
import { advanceAdd } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-ADD-018', () => {
  test('FLOW-LPC-ADD-018 Admin fee percentage accepts 100 and rejects values above 100 @add @step-03 @high', async ({ page, wizard, steps }) => {
    await advanceAdd(page, 'Financial Rules');
    await steps.financial.fillAll({ ...data.financialRules, removeAllFees: false });
    await steps.financial.openTab('Fees');
    for (const v of [100.01, 101]) {
      await steps.financial.fill('PERCENTAGE', v);
      await wizard.attemptContinue();
      await wizard.expectOnStep('Financial Rules');
    }
    await steps.financial.fill('PERCENTAGE', 100);
    await wizard.saveAndContinue();
    await wizard.expectOnStep('Eligibility Criteria');
  });
});
