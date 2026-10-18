/**
 * FLOW-LPC-EDIT-005 | Changing name and description saves and appears in the change banner
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Edit Loan Product Config'
 * Workflow step: Step 01 - General Information
 * Requirement: LPC-REQ-008, LPC-REQ-026 | Priority: High | Technique: Use case | Automation: Automated
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';

test.describe('FLOW-LPC-EDIT-005', () => {
  test('FLOW-LPC-EDIT-005 Changing name and description saves and appears in the change banner @edit @step-01 @high', async ({ wizard, steps, editProductId }) => {
    await wizard.gotoEdit(editProductId);
    await steps.general.fill('Product Name', `QA Loan Product Edited ${Date.now()}`);
    await steps.general.fill('Product Description', 'Edited by automation');
    await wizard.saveAndContinue();
    await wizard.expectOnStep('Loan Structure');
    await expect(wizard.changeBanner).toContainText('General Information');
  });
});
