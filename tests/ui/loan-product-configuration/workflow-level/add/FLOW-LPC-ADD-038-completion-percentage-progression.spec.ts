/**
 * FLOW-LPC-ADD-038 | Header completion % and step statuses advance with each completed step
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Add Loan Product Config'
 * Workflow step: Cross-step - Wizard, security and persistence
 * Requirement: LPC-REQ-001 | Priority: Medium | Technique: State transition | Automation: Automated
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import { STEP_NAMES } from '../../../../../pages/loan-product-configuration/LoanProductWizardPage';
import { completionPercent } from '../../../../../helpers/data/calc';
import { advanceAdd } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-ADD-038', () => {
  test('FLOW-LPC-ADD-038 Header completion % and step statuses advance with each completed step @add @step-08 @medium', async ({ page, wizard }) => {
    await advanceAdd(page, 'Merchants');
    await wizard.expectCompletion(completionPercent(6));
    for (const s of STEP_NAMES.slice(0, 6)) await wizard.expectStepStatus(s, 'Completed');
    await wizard.expectStepStatus('Merchants', 'In Progress');
  });
});
