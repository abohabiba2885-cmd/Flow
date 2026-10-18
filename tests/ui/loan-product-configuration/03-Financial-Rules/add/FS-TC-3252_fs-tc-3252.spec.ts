import { test } from '@playwright/test';
import { runFinancialRulesCase } from './financial-rules-suite.helpers';

test("FS-TC-3252: Calculate the early settlement fee on principal only", async ({ page }, testInfo) => {
  await runFinancialRulesCase(page, testInfo, 'FS-TC-3252');
});
