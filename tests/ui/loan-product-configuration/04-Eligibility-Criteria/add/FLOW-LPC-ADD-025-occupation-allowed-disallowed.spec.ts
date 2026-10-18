/**
 * FLOW-LPC-ADD-025 | Occupation criteria can be set as Allowed or Disallowed
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Add Loan Product Config'
 * Workflow step: Step 04 - Eligibility Criteria
 * Requirement: LPC-REQ-017 | Priority: Medium | Technique: Equivalence partitioning | Automation: Manual
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import * as data from '../../../../../test-data/loan-product-configuration/baseline';
import { advanceAdd } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-ADD-025', () => {
  test('FLOW-LPC-ADD-025 Occupation criteria can be set as Allowed or Disallowed @add @step-04 @medium', async ({ page, wizard, steps }) => {
  test.fixme(true, 'MANUAL: Occupation options unknown on staging; manual case.');
    await advanceAdd(page, 'Eligibility Criteria');
    await steps.eligibility.fillAll(data.eligibility);
    await steps.eligibility.choose('Allowed');
    await page.getByText('Select occupation').first().click();
    await page.getByRole('option').first().click();
    await wizard.saveAndContinue();
    await wizard.expectOnStep('Associated Workflow');
  });
});
