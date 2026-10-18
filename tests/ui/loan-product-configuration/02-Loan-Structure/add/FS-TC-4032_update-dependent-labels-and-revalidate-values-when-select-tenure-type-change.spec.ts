import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-4032: Update dependent labels and revalidate values when Select tenure type changes", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-4032");
});
