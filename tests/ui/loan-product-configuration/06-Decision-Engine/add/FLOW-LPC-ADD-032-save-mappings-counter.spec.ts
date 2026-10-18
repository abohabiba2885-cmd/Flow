/**
 * FLOW-LPC-ADD-032 | Mapping a field enables 'Save Mappings' and increments its count
 * Excel: test-cases/loan-product-configuration/source/Flowsky_Loan_Product_Configuration_Jira_TestCases.xlsx -> sheet 'Add Loan Product Config'
 * Workflow step: Step 06 - Decision Engine
 * Requirement: LPC-REQ-022 | Priority: Medium | Technique: State transition | Automation: Automated
 * Flow confirmed by the PO on 16-Oct-2026 (G-26): no connect step before mapping.
 */
import { test, expect } from '../../../../../fixtures';
import * as data from '../../../../../test-data/loan-product-configuration/baseline';
import { advanceAdd } from '../../../../../helpers/navigation/flow';

test.describe('FLOW-LPC-ADD-032', () => {
  test('FLOW-LPC-ADD-032 Mapping a field enables \'Save Mappings\' and increments its count @add @step-06 @medium', async ({ page, steps }) => {
    await advanceAdd(page, 'Decision Engine');
    await steps.engine.chooseEngine(data.decisionEngineName);
    await steps.engine.expectMappingReady();
    await steps.engine.openMappingTab('financial');
    await steps.engine.mapToCustomer('financial.credit_score');
    await expect(steps.engine.saveMappingsButton).toContainText('(1)');
    await expect(steps.engine.saveMappingsButton).toBeEnabled();
    await expect(steps.engine.mappingTab('financial')).toContainText('(1)');
    await expect(steps.engine.mappingTab('personal')).toContainText('(0)');
    await steps.engine.saveMappingsButton.click();
    await expect(steps.engine.mappingsSavedMessage).toBeVisible();
  });
});
