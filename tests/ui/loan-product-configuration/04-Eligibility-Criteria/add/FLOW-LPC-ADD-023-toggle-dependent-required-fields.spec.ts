/**
 * FLOW-LPC-ADD-023 | Income and credit score fields are required only when their toggles are on
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Add Loan Product Config'
 * Workflow step: Step 04 - Eligibility Criteria
 * Requirement: LPC-REQ-015 | Priority: High | Technique: Decision table | Automation: Automated
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import { advanceAdd } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-ADD-023', () => {
  test('FLOW-LPC-ADD-023 Income and credit score fields are required only when their toggles are on @add @step-04 @high', async ({ page, wizard, steps }) => {
    await advanceAdd(page, 'Eligibility Criteria');
    await steps.eligibility.fillAll({ minAge: 18, maxAge: 65 });
    await steps.eligibility.setToggle('Minimum Monthly Income', true);
    await wizard.attemptContinue();
    await wizard.expectOnStep('Eligibility Criteria');
    await steps.eligibility.setToggle('Minimum Monthly Income', false);
    await steps.eligibility.setToggle('Credit Score Requirement', true);
    await wizard.attemptContinue();
    await wizard.expectOnStep('Eligibility Criteria');
    await steps.eligibility.setToggle('Credit Score Requirement', false);
    await wizard.saveAndContinue();
    await wizard.expectOnStep('Associated Workflow');
  });
});
