import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-4037: Calculate the down payment from the principal amount", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-4037");
});
