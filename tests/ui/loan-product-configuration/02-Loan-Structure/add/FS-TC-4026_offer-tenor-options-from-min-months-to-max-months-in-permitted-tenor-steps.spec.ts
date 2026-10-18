import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-4026: Offer tenor options from Min Months to Max Months in Permitted Tenor steps", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-4026");
});
