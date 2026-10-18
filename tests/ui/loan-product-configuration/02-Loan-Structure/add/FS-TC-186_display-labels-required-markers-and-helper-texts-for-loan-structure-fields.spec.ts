import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-186: Display labels, required markers and helper texts for Loan Structure fields", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-186");
});
