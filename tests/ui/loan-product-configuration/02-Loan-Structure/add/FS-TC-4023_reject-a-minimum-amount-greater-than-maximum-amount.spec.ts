import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-4023: Reject a Minimum Amount greater than Maximum Amount", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-4023");
});
