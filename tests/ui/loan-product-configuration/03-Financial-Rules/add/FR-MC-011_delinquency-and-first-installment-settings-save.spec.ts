import { test } from '@playwright/test';
import { runFinancialRulesCase } from './financial-rules-suite.helpers';

// Source: Flowsky_Minimum_Coverage_Jira_TestCases.xlsx > Test Cases > FLOW-011
test("FR-MC-011: Delinquency, first installment and transfer-to-collection settings save", async ({ page }, testInfo) => {
  await runFinancialRulesCase(page, testInfo, 'FR-MC-011');
});
