import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-1221: Update the progress indicator after Step 2 is completed", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-1221");
});
