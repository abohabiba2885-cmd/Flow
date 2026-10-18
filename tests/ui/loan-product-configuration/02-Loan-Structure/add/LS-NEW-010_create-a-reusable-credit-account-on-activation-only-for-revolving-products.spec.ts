import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("LS-NEW-010: [LS-NEW-010] Create a reusable credit account on activation only for revolving products", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "LS-NEW-010");
});
