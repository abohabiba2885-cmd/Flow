import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-184: Accept a valid loan amount range and display it with thousand separators", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-184");
});
