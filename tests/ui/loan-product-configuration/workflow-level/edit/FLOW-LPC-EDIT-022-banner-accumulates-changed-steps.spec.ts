/**
 * FLOW-LPC-EDIT-022 | Change banner count grows and lists every changed step
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Edit Loan Product Config'
 * Workflow step: Cross-step - Change banner and review
 * Requirement: LPC-REQ-026 | Priority: High | Technique: State transition | Automation: Automated
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import { advanceEdit } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-EDIT-022', () => {
  test('FLOW-LPC-EDIT-022 Change banner count grows and lists every changed step @edit @step-08 @high', async ({ page, wizard, steps, editProductId }) => {
    await wizard.gotoEdit(editProductId);
    await steps.general.fill('Product Description', `Banner ${Date.now()}`);
    await wizard.saveAndContinue();
    const n1 = await wizard.bannerCount();
    await advanceEdit(page, editProductId, 'Eligibility Criteria');
    await steps.eligibility.fill('Maximum Age', 64);
    await wizard.saveAndContinue();
    const n2 = await wizard.bannerCount();
    expect(n2).toBeGreaterThan(n1);
    await expect(wizard.changeBanner).toContainText('Eligibility Criteria');
    await expect(page.getByText(/not yet submitted for review/)).toBeVisible();
  });
});
