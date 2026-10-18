import { test } from '@playwright/test';
import { runFinancialRulesCase } from './financial-rules-suite.helpers';

test("FS-TC-3332: Reject unsafe late fee formulas", async ({ page }, testInfo) => {
  await runFinancialRulesCase(page, testInfo, 'FS-TC-3332');
});
