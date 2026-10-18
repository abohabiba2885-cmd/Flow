import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-210: Keep Step 2 usable at common desktop and tablet widths", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-210");
});
