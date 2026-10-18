import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("LS-NEW-027: [LS-NEW-027] Record Loan Structure field changes in the audit history", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "LS-NEW-027");
});
