/**
 * FLOW-LPC-ADD-021 | Valid eligibility updates the summary and opens Associated Workflow
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Add Loan Product Config'
 * Workflow step: Step 04 - Eligibility Criteria
 * Requirement: LPC-REQ-014, LPC-REQ-019 | Priority: Critical | Technique: Use case | Automation: Automated
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import * as data from '../../../../../test-data/loan-product-configuration/baseline';
import { advanceAdd } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-ADD-021', () => {
  test('FLOW-LPC-ADD-021 Valid eligibility updates the summary and opens Associated Workflow @add @step-04 @smoke @critical', async ({ page, wizard, steps }) => {
    await advanceAdd(page, 'Eligibility Criteria');
    await steps.eligibility.fillAll(data.eligibility);
    await expect(steps.eligibility.summary).toContainText('Age: 18 - 65 years');
    await expect(steps.eligibility.summary).toContainText('Minimum Credit Score: 600');
    await wizard.saveAndContinue();
    await wizard.expectOnStep('Associated Workflow');
  });
});
