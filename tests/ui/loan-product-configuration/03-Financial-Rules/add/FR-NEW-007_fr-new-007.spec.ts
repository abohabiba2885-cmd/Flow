import { test } from '@playwright/test';
import { runFinancialRulesCase } from './financial-rules-suite.helpers';

test("FR-NEW-007: Show or hide Collection Rules fields with their toggles", async ({ page }, testInfo) => {
  await runFinancialRulesCase(page, testInfo, 'FR-NEW-007');
});
