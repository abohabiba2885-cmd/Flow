import { test } from '@playwright/test';
import { runFinancialRulesCase } from './financial-rules-suite.helpers';

// Source: Flowsky_Minimum_Coverage_Jira_TestCases.xlsx > Test Cases > FLOW-021
test("FR-MC-021: Financial Rules limits enforced by the backend", async ({ page }, testInfo) => {
  await runFinancialRulesCase(page, testInfo, 'FR-MC-021');
});
