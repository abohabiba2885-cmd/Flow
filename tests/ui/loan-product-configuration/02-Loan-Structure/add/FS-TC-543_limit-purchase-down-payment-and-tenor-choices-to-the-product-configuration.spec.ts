import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-543: Limit purchase down payment and tenor choices to the product configuration", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-543");
});
