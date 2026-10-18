import { test } from '@playwright/test';
import { runFinancialRulesCase } from './financial-rules-suite.helpers';

test("FS-TC-7267: Confirm which version applies to a new purchase on an existing credit account", async ({ page }, testInfo) => {
  await runFinancialRulesCase(page, testInfo, 'FS-TC-7267');
});
