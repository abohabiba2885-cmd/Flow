import { test } from '@playwright/test';
import { runFinancialRulesCase } from './financial-rules-suite.helpers';

// Source: Flowsky_Minimum_Coverage_Jira_TestCases.xlsx > Test Cases > FLOW-008
test("FR-MC-008: Fee method switches between fixed EGP amount and percentage", async ({ page }, testInfo) => {
  await runFinancialRulesCase(page, testInfo, 'FR-MC-008');
});
