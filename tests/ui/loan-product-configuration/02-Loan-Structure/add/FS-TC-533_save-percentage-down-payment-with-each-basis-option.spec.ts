import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-533: Save percentage down payment with each basis option", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-533");
});
