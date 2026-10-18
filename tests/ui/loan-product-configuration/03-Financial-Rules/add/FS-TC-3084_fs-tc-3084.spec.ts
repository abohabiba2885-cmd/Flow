import { test } from '@playwright/test';
import { runFinancialRulesCase } from './financial-rules-suite.helpers';

test("FS-TC-3084: Add, configure and remove fees in the Fees List", async ({ page }, testInfo) => {
  await runFinancialRulesCase(page, testInfo, 'FS-TC-3084');
});
