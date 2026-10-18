import { test } from '@playwright/test';
import { runFinancialRulesCase } from './financial-rules-suite.helpers';

// Source: Flowsky_Minimum_Coverage_Jira_TestCases.xlsx > Test Cases > FLOW-012
test("FR-MC-012: Late Fee method and calculation options", async ({ page }, testInfo) => {
  await runFinancialRulesCase(page, testInfo, 'FR-MC-012');
});
