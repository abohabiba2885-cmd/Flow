import { test } from '@playwright/test';
import { runFinancialRulesCase } from './financial-rules-suite.helpers';

test("FR-NEW-012: Save rounding settings", async ({ page }, testInfo) => {
  await runFinancialRulesCase(page, testInfo, 'FR-NEW-012');
});
