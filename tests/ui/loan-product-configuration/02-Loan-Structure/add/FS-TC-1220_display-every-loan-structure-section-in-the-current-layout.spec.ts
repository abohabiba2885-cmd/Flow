import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-1220: Display every Loan Structure section in the current layout", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-1220");
});
