/**
 * FLOW-LPC-ADD-005 | Whitespace-only Product Name / Code are treated as empty
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Add Loan Product Config'
 * Workflow step: Step 01 - General Information
 * Requirement: LPC-REQ-003, LPC-REQ-006 | Priority: Medium | Technique: Error guessing | Automation: Candidate
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import * as data from '../../../../../test-data/loan-product-configuration/baseline';

test.describe('FLOW-LPC-ADD-005', () => {
  test('FLOW-LPC-ADD-005 Whitespace-only Product Name / Code are treated as empty @add @step-01 @medium', async ({ wizard, steps }) => {
  test.fixme(true, 'CANDIDATE: Expected trimming rule not documented (G-10, G-11).');
    for (const field of ['Product Name', 'Product Code / ID']) {
      await wizard.gotoAdd();
      await steps.general.fillAll(data.generalInfo());
      await steps.general.fill(field, '   ');
      await wizard.attemptContinue();
      await wizard.expectOnStep('General Information');
    }
  });
});
