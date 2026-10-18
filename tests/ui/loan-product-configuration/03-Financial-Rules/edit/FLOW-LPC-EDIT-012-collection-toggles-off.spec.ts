/**
 * FLOW-LPC-EDIT-012 | Turning off all collection toggles saves in Edit
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Edit Loan Product Config'
 * Workflow step: Step 03 - Financial Rules
 * Requirement: LPC-REQ-013 | Priority: Medium | Technique: Pairwise | Automation: Automated
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import { advanceEdit } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-EDIT-012', () => {
  test('FLOW-LPC-EDIT-012 Turning off all collection toggles saves in Edit @edit @step-03 @medium', async ({ page, wizard, steps, editProductId }) => {
    await advanceEdit(page, editProductId, 'Financial Rules');
    await steps.financial.openTab('Collection Rules');
    for (const t of ['Late Fee', 'Late Installment Rule', 'Allow Partial Payment', 'Allow Early Settlement']) await steps.financial.setToggle(t, false);
    await wizard.saveAndContinue();
    await wizard.expectOnStep('Eligibility Criteria');
  });
});
