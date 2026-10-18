import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("LS-NEW-017: [LS-NEW-017] Persist Loan Cancellation and Return money when canceled toggles", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "LS-NEW-017");
});
