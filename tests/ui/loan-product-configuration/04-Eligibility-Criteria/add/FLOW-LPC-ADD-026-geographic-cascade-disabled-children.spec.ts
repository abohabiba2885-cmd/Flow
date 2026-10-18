/**
 * FLOW-LPC-ADD-026 | City and Area stay disabled until their parent is selected
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Add Loan Product Config'
 * Workflow step: Step 04 - Eligibility Criteria
 * Requirement: LPC-REQ-018 | Priority: Medium | Technique: State transition | Automation: Automated
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import { advanceAdd } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-ADD-026', () => {
  test('FLOW-LPC-ADD-026 City and Area stay disabled until their parent is selected @add @step-04 @medium', async ({ page, steps }) => {
    await advanceAdd(page, 'Eligibility Criteria');
    await expect(steps.eligibility.dropdown('City')).toBeDisabled();
    await expect(steps.eligibility.dropdown('Area')).toBeDisabled();
  });
});
