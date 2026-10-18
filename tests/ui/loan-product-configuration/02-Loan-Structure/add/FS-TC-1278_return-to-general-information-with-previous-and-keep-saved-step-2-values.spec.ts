import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-1278: Return to General Information with Previous and keep saved Step 2 values", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-1278");
});
