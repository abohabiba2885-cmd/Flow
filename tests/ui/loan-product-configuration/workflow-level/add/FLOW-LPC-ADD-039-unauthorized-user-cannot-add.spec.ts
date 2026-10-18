/**
 * FLOW-LPC-ADD-039 | User without create permission cannot open or submit Add
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Add Loan Product Config'
 * Workflow step: Cross-step - Wizard, security and persistence
 * Requirement: LPC-REQ-029 | Priority: High | Technique: Equivalence partitioning | Automation: Blocked
 * Locators derived from the 16-Oct-2026 staging recording - verify on first run.
 */
import { test, expect } from '../../../../../fixtures';

test.describe('FLOW-LPC-ADD-039', () => {
  test('FLOW-LPC-ADD-039 User without create permission cannot open or submit Add @add @step-08 @high', async ({ restrictedPage }) => {
    // Restricted user from FLOWSKY_RESTRICTED_EMAIL; the exact denial UI is not documented (G-16).
    await restrictedPage.goto('/loan-product-config/add', { waitUntil: 'domcontentloaded' });
    await expect(restrictedPage.getByText('Create New Loan Product')).toHaveCount(0);
  });
});
