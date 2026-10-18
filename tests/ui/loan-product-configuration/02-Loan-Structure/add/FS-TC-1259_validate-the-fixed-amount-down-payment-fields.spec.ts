import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-1259: Validate the Fixed Amount down payment fields", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-1259");
});
