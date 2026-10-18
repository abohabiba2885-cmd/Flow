import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("LS-NEW-009: [LS-NEW-009] Persist the Revolving Product toggle state and show its helper text", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "LS-NEW-009");
});
