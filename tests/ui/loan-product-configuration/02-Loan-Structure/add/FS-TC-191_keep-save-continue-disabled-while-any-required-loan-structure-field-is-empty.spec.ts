import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-191: Keep Save & Continue disabled while any required Loan Structure field is empty", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-191");
});
