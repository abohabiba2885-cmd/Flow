import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-4044: Switch down payment to Fixed Amount and persist its required fields", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-4044");
});
