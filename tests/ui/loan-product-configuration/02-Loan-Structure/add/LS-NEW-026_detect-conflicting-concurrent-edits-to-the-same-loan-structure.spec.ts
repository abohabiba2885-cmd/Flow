import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("LS-NEW-026: [LS-NEW-026] Detect conflicting concurrent edits to the same Loan Structure", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "LS-NEW-026");
});
