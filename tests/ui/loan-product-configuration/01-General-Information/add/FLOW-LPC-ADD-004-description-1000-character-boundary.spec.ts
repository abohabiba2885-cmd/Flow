/**
 * FLOW-LPC-ADD-004 | Product Description accepts 999 and 1000 characters and stops at 1001
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Add Loan Product Config'
 * Workflow step: Step 01 - General Information
 * Requirement: LPC-REQ-004 | Priority: Medium | Technique: Boundary value analysis | Automation: Automated
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import * as data from '../../../../../test-data/loan-product-configuration/baseline';

test.describe('FLOW-LPC-ADD-004', () => {
  test('FLOW-LPC-ADD-004 Product Description accepts 999 and 1000 characters and stops at 1001 @add @step-01 @medium', async ({ wizard, steps }) => {
    await wizard.gotoAdd();
    const field = steps.general.input('Product Description');
    await field.fill('a'.repeat(999));
    await expect(steps.general.descriptionCounter).toContainText('999/1000');
    await field.fill('a'.repeat(1000));
    await expect(steps.general.descriptionCounter).toContainText('1000/1000');
    await field.fill('a'.repeat(1001));
    const length = (await field.inputValue()).length;
    if (length > 1000) {
      await steps.general.fillAll({ ...data.generalInfo(), description: undefined });
      await expect(wizard.saveAndContinueButton).toBeDisabled();
    } else {
      expect(length).toBe(1000);
    }
  });
});
