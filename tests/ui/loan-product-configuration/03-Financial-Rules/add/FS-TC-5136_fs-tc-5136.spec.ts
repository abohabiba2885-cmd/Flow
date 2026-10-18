import { test } from '@playwright/test';
import { runFinancialRulesCase } from './financial-rules-suite.helpers';

test("FS-TC-5136: List all fee types in the Fee Type dropdown", async ({ page }, testInfo) => {
  await runFinancialRulesCase(page, testInfo, 'FS-TC-5136');
});
