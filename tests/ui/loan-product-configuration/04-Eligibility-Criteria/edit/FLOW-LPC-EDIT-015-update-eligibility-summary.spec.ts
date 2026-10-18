/**
 * FLOW-LPC-EDIT-015 | Updating eligibility refreshes the summary and banner
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Edit Loan Product Config'
 * Workflow step: Step 04 - Eligibility Criteria
 * Requirement: LPC-REQ-014, LPC-REQ-019, LPC-REQ-026 | Priority: High | Technique: Use case | Automation: Automated
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import { advanceEdit } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-EDIT-015', () => {
  test('FLOW-LPC-EDIT-015 Updating eligibility refreshes the summary and banner @edit @step-04 @high', async ({ page, wizard, steps, editProductId }) => {
    await advanceEdit(page, editProductId, 'Eligibility Criteria');
    await steps.eligibility.fillAll({ minAge: 21, maxAge: 60, minCreditScore: 650 });
    await expect(steps.eligibility.summary).toContainText('Age: 21 - 60 years');
    await expect(steps.eligibility.summary).toContainText('Minimum Credit Score: 650');
    await wizard.saveAndContinue();
    await wizard.expectOnStep('Associated Workflow');
    await expect(wizard.changeBanner).toContainText('Eligibility Criteria');
  });
});
