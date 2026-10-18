import { test } from '@playwright/test';
import { runFinancialRulesCase } from './financial-rules-suite.helpers';

test("FS-TC-3053: Reject negative and non-numeric Admin fee percentages", async ({ page }, testInfo) => {
  await runFinancialRulesCase(page, testInfo, 'FS-TC-3053');
});
