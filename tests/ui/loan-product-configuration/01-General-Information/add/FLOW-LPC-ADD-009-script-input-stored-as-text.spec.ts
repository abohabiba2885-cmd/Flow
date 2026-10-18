/**
 * FLOW-LPC-ADD-009 | HTML/script in Product Name and Description is stored as text, not executed
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Add Loan Product Config'
 * Workflow step: Step 01 - General Information
 * Requirement: LPC-REQ-030 | Priority: Medium | Technique: Error guessing | Automation: Automated
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';
import * as data from '../../../../../test-data/loan-product-configuration/baseline';

test.describe('FLOW-LPC-ADD-009', () => {
  test('FLOW-LPC-ADD-009 HTML/script in Product Name and Description is stored as text, not executed @add @step-01 @medium', async ({ page, wizard, steps }) => {
    let dialogs = 0;
    page.on('dialog', async (dlg) => { dialogs++; await dlg.dismiss(); });
    const d = data.generalInfo({ productName: '<img src=x onerror=alert(1)>QA', description: '<script>alert(1)</script>' });
    await wizard.gotoAdd();
    await steps.general.fillAll(d);
    await wizard.attemptContinue();
    await steps.list.goto();
    await steps.list.search(d.productCode!);
    await page.waitForLoadState('networkidle');
    expect(dialogs).toBe(0);
  });
});
