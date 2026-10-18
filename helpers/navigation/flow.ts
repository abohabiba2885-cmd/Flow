import { Page, Request } from '@playwright/test';
import { LoanProductWizardPage, StepName, STEP_NAMES } from '../../pages/loan-product-configuration/LoanProductWizardPage';
import { stepPages } from '../../pages/loan-product-configuration/StepPages';
import * as d from '../../test-data/loan-product-configuration/baseline';
import { GeneralInfoData } from '../../test-data/loan-product-configuration/types';

/**
 * Starts a new product on /loan-product-config/add and completes every step before `target`
 * with baseline data, leaving the wizard on `target`.
 */
export async function advanceAdd(page: Page, target: StepName, general: GeneralInfoData = d.generalInfo()) {
  const wizard = new LoanProductWizardPage(page);
  const steps = stepPages(page);
  await wizard.gotoAdd();
  const fillers: Array<() => Promise<void>> = [
    () => steps.general.fillAll(general),
    () => steps.structure.fillAll(d.loanStructure),
    () => steps.financial.fillAll(d.financialRules),
    () => steps.eligibility.fillAll(d.eligibility),
    () => steps.workflow.selectWorkflow(d.workflowName),
    async () => {
      await steps.engine.chooseEngine(d.decisionEngineName);
      await steps.engine.expectMappingReady();
    },
  ];
  const idx = STEP_NAMES.indexOf(target);
  for (let i = 0; i < idx; i++) {
    await fillers[i]();
    await wizard.saveAndContinue();
    await wizard.expectOnStep(STEP_NAMES[i + 1]);
  }
  return { wizard, steps, general };
}

/**
 * Edit reloads the saved product with a POST to /loan-product-config/edit/{id} shortly after a step opens
 * (Save & Continue posts to the same URL), and that reload resets any value typed before it completes.
 * Waits until no such POST is in flight or started for `quietMs` (at most `maxMs`).
 */
export async function settleEditReload(page: Page, productId: string, quietMs = 1_500, maxMs = 10_000): Promise<void> {
  const path = `/loan-product-config/edit/${productId}`;
  const matches = (r: Request) => r.method() === 'POST' && new URL(r.url()).pathname === path;
  let pending = 0;
  let lastActivity = Date.now();
  const started = (r: Request) => {
    if (matches(r)) {
      pending++;
      lastActivity = Date.now();
    }
  };
  const ended = (r: Request) => {
    if (matches(r)) {
      pending = Math.max(0, pending - 1);
      lastActivity = Date.now();
    }
  };
  page.on('request', started);
  page.on('requestfinished', ended);
  page.on('requestfailed', ended);
  const deadline = Date.now() + maxMs;
  try {
    while (Date.now() < deadline && (pending > 0 || Date.now() - lastActivity < quietMs)) await page.waitForTimeout(100);
  } finally {
    page.off('request', started);
    page.off('requestfinished', ended);
    page.off('requestfailed', ended);
  }
}

/** Opens the controlled Edit record and moves forward with Save & Continue (existing data) to `target`. */
export async function advanceEdit(page: Page, productId: string, target: StepName) {
  const wizard = new LoanProductWizardPage(page);
  const steps = stepPages(page);
  await wizard.gotoEdit(productId);
  const idx = STEP_NAMES.indexOf(target);
  for (let i = 0; i < idx; i++) {
    await wizard.saveAndContinue();
    await wizard.expectOnStep(STEP_NAMES[i + 1]);
  }
  await settleEditReload(page, productId);
  return { wizard, steps };
}
