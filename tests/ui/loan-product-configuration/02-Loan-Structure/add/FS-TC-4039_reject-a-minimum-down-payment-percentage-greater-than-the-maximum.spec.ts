import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-4039: Reject a minimum down payment percentage greater than the maximum", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-4039");
});
