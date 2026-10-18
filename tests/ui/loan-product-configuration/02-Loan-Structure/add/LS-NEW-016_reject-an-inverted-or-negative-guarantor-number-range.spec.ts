import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("LS-NEW-016: [LS-NEW-016] Reject an inverted or negative guarantor number range", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "LS-NEW-016");
});
