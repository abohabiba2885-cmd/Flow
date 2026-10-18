import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-4038: Calculate the down payment from principal plus interest", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-4038");
});
