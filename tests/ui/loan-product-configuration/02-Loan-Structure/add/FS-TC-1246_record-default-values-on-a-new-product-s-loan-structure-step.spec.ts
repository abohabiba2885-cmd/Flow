import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-1246: Record default values on a new product's Loan Structure step", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-1246");
});
