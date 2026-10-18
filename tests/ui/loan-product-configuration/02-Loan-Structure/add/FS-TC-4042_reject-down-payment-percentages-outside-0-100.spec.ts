import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-4042: Reject down payment percentages outside 0-100", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-4042");
});
