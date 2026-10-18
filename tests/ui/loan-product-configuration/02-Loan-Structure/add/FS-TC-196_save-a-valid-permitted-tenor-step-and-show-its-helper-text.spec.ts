import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-196: Save a valid Permitted Tenor step and show its helper text", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-196");
});
