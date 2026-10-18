import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("LS-NEW-021: [LS-NEW-021] Keep the effective product unchanged while Loan Structure edits are pending", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "LS-NEW-021");
});
