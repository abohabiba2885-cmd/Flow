import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-198: Accept a valid monthly tenure range", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-198");
});
