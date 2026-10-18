/**
 * FLOW-LPC-ADD-031 | Continuing without a decision engine follows the optional/mandatory rule
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Add Loan Product Config'
 * Workflow step: Step 06 - Decision Engine
 * Requirement: LPC-REQ-034 | Priority: Medium | Technique: Error guessing | Automation: Candidate
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import { advanceAdd } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-ADD-031', () => {
  test('FLOW-LPC-ADD-031 Continuing without a decision engine follows the optional/mandatory rule @add @step-06 @medium', async ({ page, wizard }) => {
  test.fixme(true, 'CANDIDATE: Engine optional/mandatory rule unknown (G-08).');
    await advanceAdd(page, 'Decision Engine');
    await wizard.attemptContinue();
    await wizard.expectOnStep('Decision Engine');
  });
});
