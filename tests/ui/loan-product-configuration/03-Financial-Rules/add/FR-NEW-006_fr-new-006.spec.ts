import { test } from '@playwright/test';
import { runFinancialRulesCase } from './financial-rules-suite.helpers';

test("FR-NEW-006: Validate Processing Days and save disbursement notes", async ({ page }, testInfo) => {
  await runFinancialRulesCase(page, testInfo, 'FR-NEW-006');
});
