/**
 * FLOW-LPC-ADD-030 | Selecting a decision engine shows field mapping without a connect step
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Add Loan Product Config'
 * Workflow step: Step 06 - Decision Engine
 * Requirement: LPC-REQ-021, LPC-REQ-022 | Priority: Critical | Technique: Use case | Automation: Automated
 * Flow confirmed by the PO on 16-Oct-2026 (G-26): the engine is linked automatically when the product is saved.
 */
import { test, expect } from '../../../../../fixtures';
import * as data from '../../../../../test-data/loan-product-configuration/baseline';
import { advanceAdd } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-ADD-030', () => {
  test('FLOW-LPC-ADD-030 Selecting a decision engine shows field mapping without a connect step @add @step-06 @smoke @critical', async ({ page, steps }) => {
    await advanceAdd(page, 'Decision Engine');
    await steps.engine.chooseEngine(data.decisionEngineName);
    await steps.engine.expectMappingReady();
    await expect(steps.engine.connectButton).toHaveCount(0);
    await expect(steps.engine.saveMappingsButton).toBeDisabled();
    await expect(steps.engine.saveMappingsButton).toContainText('(0)');
    await expect(steps.engine.mappingTab('financial')).toContainText('(0)');
    await expect(steps.engine.mappingTab('personal')).toContainText('(0)');
    await steps.engine.openMappingTab('financial');
    await expect(steps.engine.mappingRow('financial.credit_score')).toBeVisible();
    await steps.engine.openMappingTab('personal');
    for (const key of ['personal.monthly_income', 'personal.national_id']) {
      await expect(steps.engine.mappingRow(key)).toBeVisible();
    }
  });
});
