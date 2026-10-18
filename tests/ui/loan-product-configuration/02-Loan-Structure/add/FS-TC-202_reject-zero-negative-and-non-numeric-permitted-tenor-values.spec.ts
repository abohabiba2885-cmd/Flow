import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-202: Reject zero, negative and non-numeric Permitted Tenor values", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-202");
});
