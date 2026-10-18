import { test } from '@playwright/test';
import { runFinancialRulesCase } from './financial-rules-suite.helpers';

test("FR-NEW-016: Show correct labels and helper texts on Financial Rules", async ({ page }, testInfo) => {
  await runFinancialRulesCase(page, testInfo, 'FR-NEW-016');
});
