import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-4047: Accept only positive whole numbers in limit fields", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-4047");
});
