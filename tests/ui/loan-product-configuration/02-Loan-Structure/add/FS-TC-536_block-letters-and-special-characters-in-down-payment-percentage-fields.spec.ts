import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-536: Block letters and special characters in down payment percentage fields", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-536");
});
