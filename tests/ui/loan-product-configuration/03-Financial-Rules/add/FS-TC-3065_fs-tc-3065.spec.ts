import { test } from '@playwright/test';
import { runFinancialRulesCase } from './financial-rules-suite.helpers';

test("FS-TC-3065: Require and validate the name for fee type Other", async ({ page }, testInfo) => {
  await runFinancialRulesCase(page, testInfo, 'FS-TC-3065');
});
