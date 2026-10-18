import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("LS-NEW-022: [LS-NEW-022] Prevent users without edit permission from changing Loan Structure", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "LS-NEW-022");
});
