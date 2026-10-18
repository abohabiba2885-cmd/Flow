import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-188: Reject negative and malformed values in Minimum and Maximum Amount", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-188");
});
