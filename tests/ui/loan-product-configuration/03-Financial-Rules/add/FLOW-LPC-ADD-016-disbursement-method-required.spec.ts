/**
 * FLOW-LPC-ADD-016 | Financial Rules cannot be saved without a disbursement method
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Add Loan Product Config'
 * Workflow step: Step 03 - Financial Rules
 * Requirement: LPC-REQ-012 | Priority: High | Technique: Equivalence partitioning | Automation: Automated
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import * as data from '../../../../../test-data/loan-product-configuration/baseline';
import { advanceAdd } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-ADD-016', () => {
  test('FLOW-LPC-ADD-016 Financial Rules cannot be saved without a disbursement method @add @step-03 @high', async ({ page, wizard, steps }) => {
    await advanceAdd(page, 'Financial Rules');
    await steps.financial.openTab('Interest Rate');
    await steps.financial.fill('Interest Rate', data.financialRules.interestRate);
    await steps.financial.openTab('Disbursement Rules');
    await expect(steps.financial.disbursementRequiredMessage).toBeVisible();
    await wizard.attemptContinue();
    await wizard.expectOnStep('Financial Rules');
    await steps.financial.selectDisbursementMethod('Mobile Wallet');
    await expect(steps.financial.disbursementRequiredMessage).toBeHidden();
  });
});
