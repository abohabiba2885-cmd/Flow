import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-4030: Handle a tenure range that the Permitted Tenor does not divide evenly", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-4030");
});
