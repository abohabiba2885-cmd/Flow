import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-4043: Apply the confirmed rule when a fixed down payment exceeds the loan amount", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-4043");
});
