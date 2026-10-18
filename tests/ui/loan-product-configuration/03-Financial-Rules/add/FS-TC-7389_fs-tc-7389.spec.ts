import { test } from '@playwright/test';
import { runFinancialRulesCase } from './financial-rules-suite.helpers';

test("FS-TC-7389: Deduct a total-amount-based Admin fee from disbursement with flat interest", async ({ page }, testInfo) => {
  await runFinancialRulesCase(page, testInfo, 'FS-TC-7389');
});
