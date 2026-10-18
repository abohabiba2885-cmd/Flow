import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-197: Display the Permitted Tenor helper text and placeholder", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-197");
});
