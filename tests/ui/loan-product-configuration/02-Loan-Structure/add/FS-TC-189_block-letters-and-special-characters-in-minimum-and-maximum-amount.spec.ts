import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-189: Block letters and special characters in Minimum and Maximum Amount", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-189");
});
