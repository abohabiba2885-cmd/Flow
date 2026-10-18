/**
 * FLOW-LPC-ADD-003 | Each empty required Step 1 field blocks Save & Continue (incl. Currency anomaly)
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Add Loan Product Config'
 * Workflow step: Step 01 - General Information
 * Requirement: LPC-REQ-003, LPC-REQ-033 | Priority: High | Technique: Decision table | Automation: Automated
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import * as data from '../../../../../test-data/loan-product-configuration/baseline';

test.describe('FLOW-LPC-ADD-003', () => {
  test('FLOW-LPC-ADD-003 Each empty required Step 1 field blocks Save & Continue (incl. Currency anomaly) @add @step-01 @high', async ({ wizard, steps }) => {
    const required = ['Product Name', 'Product Code / ID', 'Product Type', 'Currency'] as const;
    for (const missing of required) {
      await wizard.gotoAdd();
      const d = data.generalInfo();
      if (missing !== 'Product Name') await steps.general.fill('Product Name', d.productName);
      if (missing !== 'Product Code / ID') await steps.general.fill('Product Code / ID', d.productCode!);
      if (missing !== 'Product Type') await steps.general.select('Product Type', d.productType);
      if (missing !== 'Currency') await steps.general.select('Currency', d.currency);
      await expect.soft(wizard.saveAndContinueButton, `${missing} empty -> Save & Continue should be disabled`).toBeDisabled();
      await wizard.attemptContinue();
      await wizard.expectOnStep('General Information');
    }
  });
});
