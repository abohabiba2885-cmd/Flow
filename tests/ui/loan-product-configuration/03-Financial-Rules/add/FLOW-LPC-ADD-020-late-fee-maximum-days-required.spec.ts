/**
 * FLOW-LPC-ADD-020 | With Late Fee on, empty LATE MAXIMUM DAYS blocks save
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Add Loan Product Config'
 * Workflow step: Step 03 - Financial Rules
 * Requirement: LPC-REQ-013 | Priority: Medium | Technique: Decision table | Automation: Automated
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import * as data from '../../../../../test-data/loan-product-configuration/baseline';
import { advanceAdd } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-ADD-020', () => {
  test('FLOW-LPC-ADD-020 With Late Fee on, empty LATE MAXIMUM DAYS blocks save @add @step-03 @medium', async ({ page, wizard, steps }) => {
    await advanceAdd(page, 'Financial Rules');
    await steps.financial.fillAll(data.financialRules);
    await steps.financial.openTab('Collection Rules');
    await steps.financial.setToggle('Late Fee', true);
    await steps.financial.clear('LATE MAXIMUM DAYS');
    await wizard.attemptContinue();
    await wizard.expectOnStep('Financial Rules');
  });
});
