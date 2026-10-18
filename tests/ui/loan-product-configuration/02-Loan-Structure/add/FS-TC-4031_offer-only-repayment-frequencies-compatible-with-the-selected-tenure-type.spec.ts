import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-4031: Offer only Repayment Frequencies compatible with the selected tenure type", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-4031");
});
