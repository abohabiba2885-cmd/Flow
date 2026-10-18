/**
 * FLOW-LPC-ADD-006 | Product Code / ID already used by another product is rejected
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Add Loan Product Config'
 * Workflow step: Step 01 - General Information
 * Requirement: LPC-REQ-006 | Priority: High | Technique: Equivalence partitioning | Automation: Candidate
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import * as data from '../../../../../test-data/loan-product-configuration/baseline';

test.describe('FLOW-LPC-ADD-006', () => {
  test('FLOW-LPC-ADD-006 Product Code / ID already used by another product is rejected @add @step-01 @high', async ({ page, wizard, steps, createDraftProduct }) => {
  test.fixme(true, 'CANDIDATE: Uniqueness rule and draft creation point not confirmed (G-10, G-04).');
    const first = await createDraftProduct();
    await wizard.gotoAdd();
    await steps.general.fillAll(data.generalInfo({ productCode: first.code }));
    await wizard.attemptContinue();
    await expect(page.getByText(/already exists|duplicate|unique/i).first()).toBeVisible();
    await wizard.expectOnStep('General Information');
  });
});
