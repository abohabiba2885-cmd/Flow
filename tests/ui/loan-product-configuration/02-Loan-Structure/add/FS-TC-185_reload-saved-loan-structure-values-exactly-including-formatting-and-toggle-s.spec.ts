import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-185: Reload saved Loan Structure values exactly, including formatting and toggle states", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-185");
});
