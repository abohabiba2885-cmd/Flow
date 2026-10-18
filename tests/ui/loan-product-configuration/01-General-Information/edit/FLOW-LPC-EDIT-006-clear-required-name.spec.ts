/**
 * FLOW-LPC-EDIT-006 | Clearing Product Name blocks Save & Continue
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Edit Loan Product Config'
 * Workflow step: Step 01 - General Information
 * Requirement: LPC-REQ-003, LPC-REQ-033 | Priority: High | Technique: Equivalence partitioning | Automation: Automated
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';

test.describe('FLOW-LPC-EDIT-006', () => {
  test('FLOW-LPC-EDIT-006 Clearing Product Name blocks Save & Continue @edit @step-01 @high', async ({ wizard, steps, editProductId }) => {
    await wizard.gotoEdit(editProductId);
    await steps.general.clear('Product Name');
    await wizard.attemptContinue();
    await wizard.expectOnStep('General Information');
  });
});
