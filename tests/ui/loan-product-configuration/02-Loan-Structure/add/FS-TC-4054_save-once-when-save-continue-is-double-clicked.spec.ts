import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-4054: Save once when Save & Continue is double-clicked", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-4054");
});
