import { test } from '@playwright/test';
import { runFinancialRulesCase } from './financial-rules-suite.helpers';

// Source: Flowsky_Minimum_Coverage_Jira_TestCases.xlsx > Test Cases > FLOW-010
test("FR-MC-010: Processing Days and Notes validation", async ({ page }, testInfo) => {
  await runFinancialRulesCase(page, testInfo, 'FR-MC-010');
});
