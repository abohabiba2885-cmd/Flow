import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-1232: Preserve decimal precision for amount and down payment percentage values", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-1232");
});
