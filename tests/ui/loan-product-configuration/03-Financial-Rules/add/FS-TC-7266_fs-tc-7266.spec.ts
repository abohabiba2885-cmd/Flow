import { test } from '@playwright/test';
import { runFinancialRulesCase } from './financial-rules-suite.helpers';

test("FS-TC-7266: Use the purchase amount, not the credit limit, as the interest principal", async ({ page }, testInfo) => {
  await runFinancialRulesCase(page, testInfo, 'FS-TC-7266');
});
