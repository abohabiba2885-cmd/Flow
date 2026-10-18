/**
 * FLOW-LPC-ADD-022 | Minimum Age greater than Maximum Age is rejected
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Add Loan Product Config'
 * Workflow step: Step 04 - Eligibility Criteria
 * Requirement: LPC-REQ-014 | Priority: High | Technique: Boundary value analysis | Automation: Automated
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import * as data from '../../../../../test-data/loan-product-configuration/baseline';
import { advanceAdd } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-ADD-022', () => {
  test('FLOW-LPC-ADD-022 Minimum Age greater than Maximum Age is rejected @add @step-04 @high', async ({ page, wizard, steps }) => {
    await advanceAdd(page, 'Eligibility Criteria');
    await steps.eligibility.fillAll({ ...data.eligibility, minAge: 66, maxAge: 65 });
    await wizard.attemptContinue();
    await wizard.expectOnStep('Eligibility Criteria');
  });
});
