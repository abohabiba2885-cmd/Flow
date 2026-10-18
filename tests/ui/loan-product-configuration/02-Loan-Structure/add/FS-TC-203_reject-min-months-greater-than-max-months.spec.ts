import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-203: Reject Min Months greater than Max Months", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-203");
});
