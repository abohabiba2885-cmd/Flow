import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-4049: Apply the confirmed rule when a per-user limit exceeds the overall transaction limit", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-4049");
});
