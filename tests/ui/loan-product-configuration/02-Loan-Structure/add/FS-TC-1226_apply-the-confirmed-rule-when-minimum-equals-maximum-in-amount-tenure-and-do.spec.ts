import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-1226: Apply the confirmed rule when minimum equals maximum in amount, tenure and down payment ranges", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-1226");
});
