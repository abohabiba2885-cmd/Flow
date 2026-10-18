import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-539: Show or hide down payment options with the Down Payment Options toggle", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-539");
});
