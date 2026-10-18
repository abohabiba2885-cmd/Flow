import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("LS-NEW-015: [LS-NEW-015] Save a Loan Guarantor configuration with a valid range", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "LS-NEW-015");
});
