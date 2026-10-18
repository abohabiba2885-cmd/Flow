import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-4045: Discard percentage values when switching the down payment method to Fixed Amount", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-4045");
});
