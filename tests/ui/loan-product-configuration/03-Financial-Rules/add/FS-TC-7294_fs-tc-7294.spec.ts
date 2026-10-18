import { test } from '@playwright/test';
import { runFinancialRulesCase } from './financial-rules-suite.helpers';

test("FS-TC-7294: Ignore stale settings after changing the delinquency mode or first-installment option", async ({ page }, testInfo) => {
  await runFinancialRulesCase(page, testInfo, 'FS-TC-7294');
});
