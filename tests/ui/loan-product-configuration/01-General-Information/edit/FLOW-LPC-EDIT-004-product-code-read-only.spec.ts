/**
 * FLOW-LPC-EDIT-004 | Product Code / ID cannot be changed in Edit
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Edit Loan Product Config'
 * Workflow step: Step 01 - General Information
 * Requirement: LPC-REQ-005 | Priority: Critical | Technique: Equivalence partitioning | Automation: Automated
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';

test.describe('FLOW-LPC-EDIT-004', () => {
  test('FLOW-LPC-EDIT-004 Product Code / ID cannot be changed in Edit @edit @step-01 @smoke @critical', async ({ wizard, steps, editProductId }) => {
    await wizard.gotoEdit(editProductId);
    await expect(steps.general.input('Product Code / ID')).not.toBeEditable();
  });
});
