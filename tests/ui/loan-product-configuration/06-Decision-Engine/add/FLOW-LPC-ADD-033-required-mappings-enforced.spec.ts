/**
 * FLOW-LPC-ADD-033 | Required (*) engine fields must be mapped before continuing
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Add Loan Product Config'
 * Workflow step: Step 06 - Decision Engine
 * Requirement: LPC-REQ-034 | Priority: High | Technique: Error guessing | Automation: Candidate
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import * as data from '../../../../../test-data/loan-product-configuration/baseline';
import { advanceAdd } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-ADD-033', () => {
  test('FLOW-LPC-ADD-033 Required (*) engine fields must be mapped before continuing @add @step-06 @high', async ({ page, wizard, steps }) => {
  test.fixme(true, 'CANDIDATE: Required mapping enforcement rule unknown (G-08).');
    await advanceAdd(page, 'Decision Engine');
    await steps.engine.chooseEngine(data.decisionEngineName);
    await steps.engine.expectMappingReady();
    await wizard.attemptContinue();
    await wizard.expectOnStep('Decision Engine');
  });
});
