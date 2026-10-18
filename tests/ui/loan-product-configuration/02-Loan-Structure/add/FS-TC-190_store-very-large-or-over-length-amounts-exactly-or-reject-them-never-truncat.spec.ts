import { test } from '@playwright/test';
import { runLoanStructureCase } from './loan-structure-suite.helpers';

test("FS-TC-190: Store very large or over-length amounts exactly or reject them, never truncate", async ({ page }, testInfo) => {
  await runLoanStructureCase(page, testInfo, "FS-TC-190");
});
