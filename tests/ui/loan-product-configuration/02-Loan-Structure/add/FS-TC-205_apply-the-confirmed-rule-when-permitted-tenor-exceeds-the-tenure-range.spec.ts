import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-205: Apply the confirmed rule when Permitted Tenor exceeds the tenure range", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-205");
});
