import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-535: Apply the confirmed rule for 0% and 100% down payment boundaries", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-535");
});
