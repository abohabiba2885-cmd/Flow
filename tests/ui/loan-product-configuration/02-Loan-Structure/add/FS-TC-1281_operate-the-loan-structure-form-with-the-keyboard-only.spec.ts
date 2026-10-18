import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-1281: Operate the Loan Structure form with the keyboard only", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-1281");
});
