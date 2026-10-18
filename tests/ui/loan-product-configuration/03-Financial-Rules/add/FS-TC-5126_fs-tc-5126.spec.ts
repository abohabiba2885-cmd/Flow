import { test } from '@playwright/test';
import { runFinancialRulesCase } from './financial-rules-suite.helpers';

test("FS-TC-5126: Keep Save & Continue disabled while any required Financial Rules field is empty", async ({ page }, testInfo) => {
  await runFinancialRulesCase(page, testInfo, 'FS-TC-5126');
});
