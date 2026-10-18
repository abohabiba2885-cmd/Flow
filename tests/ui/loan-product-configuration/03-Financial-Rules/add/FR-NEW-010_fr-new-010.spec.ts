import { test } from '@playwright/test';
import { runFinancialRulesCase } from './financial-rules-suite.helpers';

test("FR-NEW-010: Validate the Allow Partial Payment minimum percentage", async ({ page }, testInfo) => {
  await runFinancialRulesCase(page, testInfo, 'FR-NEW-010');
});
