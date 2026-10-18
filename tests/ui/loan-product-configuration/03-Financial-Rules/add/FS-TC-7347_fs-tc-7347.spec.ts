import { test } from '@playwright/test';
import { runFinancialRulesCase } from './financial-rules-suite.helpers';

test("FS-TC-7347: Collect a principal-based Admin fee upfront in cash with flat interest", async ({ page }, testInfo) => {
  await runFinancialRulesCase(page, testInfo, 'FS-TC-7347');
});
