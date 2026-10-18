import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-4052: Do not apply disabled optional Loan Structure rules to new loans", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-4052");
});
