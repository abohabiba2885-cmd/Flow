import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-4046: Show or hide each limit field with its toggle", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-4046");
});
