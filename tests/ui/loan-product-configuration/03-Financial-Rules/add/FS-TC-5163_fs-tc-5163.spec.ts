import { test } from '@playwright/test';
import { runFinancialRulesCase } from './financial-rules-suite.helpers';

test("FS-TC-5163: Clear the fee value and apply the 100% limit when switching Fixed to Percentage", async ({ page }, testInfo) => {
  await runFinancialRulesCase(page, testInfo, 'FS-TC-5163');
});
