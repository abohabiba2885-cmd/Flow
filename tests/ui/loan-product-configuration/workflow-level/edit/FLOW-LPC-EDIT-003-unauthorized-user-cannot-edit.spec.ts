/**
 * FLOW-LPC-EDIT-003 | User without edit permission cannot modify a product
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Edit Loan Product Config'
 * Workflow step: Step 00 - Open Existing Product (Product list)
 * Requirement: LPC-REQ-029 | Priority: High | Technique: Equivalence partitioning | Automation: Blocked
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';

test.describe('FLOW-LPC-EDIT-003', () => {
  test('FLOW-LPC-EDIT-003 User without edit permission cannot modify a product @edit @step-00 @high', async ({ restrictedPage, editProductId }) => {
    // Restricted user from FLOWSKY_RESTRICTED_EMAIL; the exact denial UI is not documented (G-16).
    await restrictedPage.goto(`/loan-product-config/edit/${editProductId}`, { waitUntil: 'domcontentloaded' });
    await expect(restrictedPage.getByRole('button', { name: /Update Product|Save & Continue/ })).toHaveCount(0);
  });
});
