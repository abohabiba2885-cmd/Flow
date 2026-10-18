import { test } from '@playwright/test';
import { runFinancialRulesCase } from './financial-rules-suite.helpers';

test("FS-TC-5121: Match the Financial Rules tabs to the approved Figma design", async ({ page }, testInfo) => {
  await runFinancialRulesCase(page, testInfo, 'FS-TC-5121');
});
