import { test } from '@playwright/test';
import { runFinancialRulesCase } from './financial-rules-suite.helpers';

// Source: Flowsky_Minimum_Coverage_Jira_TestCases.xlsx > Test Cases > FLOW-019
test("FR-MC-019: Change banner, Discard and Submit for Review include Financial Rules", async ({ page }, testInfo) => {
  await runFinancialRulesCase(page, testInfo, 'FR-MC-019');
});
