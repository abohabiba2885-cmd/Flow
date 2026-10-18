import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-200: Reject negative and non-numeric values in Min Months and Max Months", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-200");
});
