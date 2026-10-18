import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-199: Save a complete valid Loan Structure and continue to Step 3 Financial Rules", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-199");
});
