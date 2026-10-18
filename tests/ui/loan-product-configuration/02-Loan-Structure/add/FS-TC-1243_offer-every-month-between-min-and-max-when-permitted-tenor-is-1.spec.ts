import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-1243: Offer every month between Min and Max when Permitted Tenor is 1", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-1243");
});
