/**
 * FLOW-LPC-EDIT-017 | Selecting a different decision engine in Edit shows its field mapping without a connect step
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Edit Loan Product Config'
 * Workflow step: Step 06 - Decision Engine
 * Requirement: LPC-REQ-021, LPC-REQ-022 | Priority: Medium | Technique: Use case | Automation: Automated
 * Flow confirmed by the PO on 16-Oct-2026 (G-26): the engine is linked automatically when the product is saved.
 * Selects without saving, so EDIT_PRODUCT_ID keeps its engine.
 */
import { test, expect } from '../../../../../fixtures';
import { advanceEdit } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-EDIT-017', () => {
  test('FLOW-LPC-EDIT-017 Selecting a different decision engine shows its field mapping without a connect step @edit @step-06 @medium', async ({ page, steps, editProductId }) => {
    await advanceEdit(page, editProductId, 'Decision Engine');
    const engineSelect = page.locator('select').filter({ has: page.locator('option', { hasText: 'Risk Matrix' }) });
    const current = (await engineSelect.locator('option:checked').innerText()).trim();
    const other = ['Credit Lending - Egyptian Banking Rules', 'Risk Matrix'].find((name) => name !== current)!;
    await steps.engine.chooseEngine(other);
    await expect(engineSelect.locator('option:checked')).toHaveText(other);
    // The 'linked automatically when you save' notice is shown only before a product has an engine (Add).
    await expect(steps.engine.fieldMappingHeading).toBeVisible();
    await expect(steps.engine.saveMappingsButton).toContainText('(0)');
    await expect(steps.engine.connectButton).toHaveCount(0);
    await steps.engine.openMappingTab('financial');
    await expect(page.getByRole('tabpanel').getByRole('combobox').first()).toBeVisible();
  });
});
