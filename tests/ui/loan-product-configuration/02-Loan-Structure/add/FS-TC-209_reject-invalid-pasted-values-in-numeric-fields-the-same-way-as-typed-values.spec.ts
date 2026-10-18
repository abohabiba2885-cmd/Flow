import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-209: Reject invalid pasted values in numeric fields the same way as typed values", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-209");
});
