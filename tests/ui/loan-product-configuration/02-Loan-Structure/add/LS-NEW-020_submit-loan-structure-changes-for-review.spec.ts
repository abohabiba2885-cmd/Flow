import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("LS-NEW-020: [LS-NEW-020] Submit Loan Structure changes for review", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "LS-NEW-020");
});
