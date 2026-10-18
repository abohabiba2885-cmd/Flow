import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, test, type Locator, type Page, type TestInfo } from '@playwright/test';
import {
  chooseOption,
  createDraftProductAtLoanStructure,
  fillFlow001Values,
  financialRulesHeading,
  loanStructure,
  replaceValue,
  setSwitch,
  stepStatus,
} from '../../02-Loan-Structure/add/loan-structure-suite.helpers';
import { appUrl, baseUrl } from '../../../../../helpers/common/env';
import { settleEditReload } from '../../../../../helpers/navigation/flow';

export { chooseOption, replaceValue, setSwitch, stepStatus };

type SourceCase = {
  'Test Case ID': string;
  'Test Case Title': string;
  'Objective / Description': string | null;
  'Requirement ID': string | null;
  Preconditions: string | null;
  'Test Data': string | null;
  'Test Steps': string | null;
  'Expected Result': string | null;
  'Test Type': string | null;
  Priority: string | null;
  'Risk Level': string | null;
  'Automation Candidate': string | null;
  'Source Reference': string | null;
  Disposition: string | null;
  'Original Test Case ID': string | null;
  'Execution Readiness': string | null;
};

const parsedSourceCases: unknown = JSON.parse(
  readFileSync(resolve(__dirname, 'source-cases.json'), 'utf8'),
);
if (!Array.isArray(parsedSourceCases)) {
  throw new Error('Financial Rules source-cases.json has an invalid format.');
}
const sourceCases = parsedSourceCases as SourceCase[];
const caseById = new Map(sourceCases.map((sourceCase) => [sourceCase['Test Case ID'], sourceCase]));

const tabNames = ['Interest Rate', 'Fees', 'Disbursement Rules', 'Collection Rules', 'Rounding'] as const;
type TabName = (typeof tabNames)[number];

// Each toggle sits next to an h4 title ("Admin fee", "Late Fee", ...). The last match is the innermost container.
function toggleSection(page: Page, title: string) {
  return page
    .locator('div')
    .filter({ has: page.getByRole('heading', { name: title, exact: true }) })
    .filter({ has: page.getByRole('switch') })
    .last();
}

// Selectors verified against staging product 503 on 15-Oct-2026. Most inputs have stable ids; the rest are
// scoped to the active tab panel.
export function financialRules(page: Page) {
  const panel = page.locator('[role="tabpanel"][data-state="active"]');
  return {
    heading: financialRulesHeading(page),
    tab: (name: TabName) => page.getByRole('tab', { name, exact: true }),
    panel,
    saveAndContinue: page.getByRole('button', { name: 'Save & Continue' }),
    previous: page.getByRole('button', { name: 'Previous' }),
    interestRate: page.locator('#interest-rate'),
    interestType: panel.getByRole('combobox').first(),
    switchFor: (title: string) => toggleSection(page, title).getByRole('switch'),
    adminPercentage: panel.getByPlaceholder('Enter percentage').first(),
    collectionTiming: panel.getByRole('combobox').first(),
    addFee: page.getByRole('button', { name: 'Add New', exact: true }),
    removeFee: page.getByRole('button', { name: 'Remove', exact: true }),
    fixedFeeValue: page.getByPlaceholder('Enter fixed amount in EGP'),
    disbursementMethods: page.getByRole('combobox').filter({ hasText: 'Select method' }),
    disbursementRequired: page.getByText('At least one disbursement method is required', { exact: true }),
    processingDays: page.locator('#processing-days'),
    formula: page.getByPlaceholder('Add your formula'),
    lateCalc: {
      'One Time': page.locator('#late-calc-constant'),
      'Incrementally (Daily)': page.locator('#late-calc-daily'),
      'Incrementally (Monthly)': page.locator('#late-calc-monthly'),
      Formula: page.locator('#late-calc-formula'),
    },
    lateMaximumDays: page.locator('#max-late-days'),
    lateInstallmentMinimum: page.locator('#late-installment-min-percentage'),
    partialPaymentMinimum: page.locator(
      'input[placeholder="Enter Minimum Percentage"]:not(#late-installment-min-percentage)',
    ),
    balloonFirst: page.locator('#balloon-rounding-first'),
    balloonLast: page.locator('#balloon-rounding-last'),
  };
}

async function pickDisbursementMethod(page: Page, method = 'Bank Transfer') {
  const form = financialRules(page);
  await form.disbursementMethods.click();
  await page.getByRole('option', { name: method, exact: true }).click();
  await expect(form.disbursementRequired).toBeHidden();
}

async function expectSignedIn(page: Page) {
  if (/\/login\b/.test(page.url())) {
    throw new Error(
      'The staging session has expired (redirected to /login). Delete .auth/user.json and rerun with ' +
        'FLOWSKY_EMAIL/FLOWSKY_PASSWORD set, or refresh PLAYWRIGHT_STORAGE_STATE with: ' +
        'npx playwright codegen --save-storage=.auth/user.json ' +
        `${baseUrl()}/login`,
    );
  }
}

async function expectRejected(field: Locator, value: string, saveButton: Locator) {
  await replaceValue(field, value);
  await field.blur();
  const acceptedValue = await field.inputValue();
  const blocked = await saveButton.isDisabled();
  expect(
    acceptedValue !== value || blocked,
    `The input "${value}" must be rejected or keep Save & Continue disabled.`,
  ).toBe(true);
}

export async function createDraftProductAtFinancialRules(page: Page) {
  await page.goto(appUrl('/loan-product-config/add'));
  await expectSignedIn(page);
  const productCode = await createDraftProductAtLoanStructure(page);
  const structure = loanStructure(page);
  await fillFlow001Values(page, structure);
  await expect(structure.saveAndContinue).toBeEnabled();
  await structure.saveAndContinue.click();
  await expect(financialRules(page).heading).toBeVisible();
  return productCode;
}

export async function openFinancialRulesInEdit(page: Page, productCode: string) {
  test.slow();
  await page.goto(appUrl('/loan-product-config'), { waitUntil: 'domcontentloaded' });
  await expectSignedIn(page);
  await page.getByRole('textbox', { name: /Search products/ }).fill(productCode);
  const productRow = page.getByRole('row', { name: new RegExp(productCode) });
  await expect(async () => {
    await productRow.getByRole('cell').first().click();
    await expect(page).toHaveURL(/\/loan-product-config\/edit\/\d+/, { timeout: 5_000 });
  }).toPass({ timeout: 30_000 });
  await page.locator('p').filter({ hasText: /^Financial Rules$/ }).first().click();
  await expect(financialRules(page).heading).toBeVisible();
  // Edit reloads the saved product right after a step opens; typing before it finishes is lost.
  const productId = page.url().match(/\/loan-product-config\/edit\/(\d+)/)![1];
  await settleEditReload(page, productId);
}

// Minimum valid Step 3: optional sections are switched off so only the always-required fields remain.
export async function fillBaselineFinancialRules(page: Page) {
  const form = financialRules(page);
  await form.tab('Interest Rate').click();
  await replaceValue(form.interestRate, '25');
  await chooseOption(page, form.interestType, 'Flat');

  await form.tab('Fees').click();
  await setSwitch(form.switchFor('Admin fee'), false);
  while ((await form.removeFee.count()) > 0) await form.removeFee.first().click();

  await form.tab('Disbursement Rules').click();
  await pickDisbursementMethod(page);
  await replaceValue(form.processingDays, '2');

  await form.tab('Collection Rules').click();
  for (const title of ['Late Fee', 'Late Installment Rule', 'Allow Partial Payment', 'Allow Early Settlement']) {
    await setSwitch(form.switchFor(title), false);
  }
  await expect(form.saveAndContinue).toBeEnabled();
}

async function expectEligibilityCriteria(page: Page) {
  await expect(page.getByText(/Age Requirements|Eligibility Criteria/i).first()).toBeVisible();
}

// --- Fees list (Step 3 > Fees). Each "Fee #n" block has Fee type, Fee method (Fixed | Percentage) and Fee value.
function feeBlock(page: Page, index: number) {
  return financialRules(page)
    .panel.locator('div')
    .filter({ has: page.getByText(`Fee #${index}`, { exact: true }) })
    .filter({ has: page.getByRole('button', { name: 'Remove', exact: true }) })
    .filter({ has: page.getByRole('combobox') })
    .last();
}

function feeFields(page: Page, index: number) {
  const block = feeBlock(page, index);
  return {
    block,
    type: block.getByRole('combobox').first(),
    other: block.getByPlaceholder('Enter other'),
    fixed: block.getByRole('radio', { name: 'Fixed', exact: true }),
    percentage: block.getByRole('radio', { name: 'Percentage', exact: true }),
    value: block.getByRole('textbox').last(),
    remove: block.getByRole('button', { name: 'Remove', exact: true }),
  };
}

async function addFee(page: Page, type: string, value: string) {
  const form = financialRules(page);
  const index = (await form.removeFee.count()) + 1;
  await form.addFee.click();
  const fee = feeFields(page, index);
  await chooseOption(page, fee.type, type);
  await replaceValue(fee.value, value);
  return fee;
}

// --- Collection Rules. Stable ids observed on staging 16-Oct-2026.
function collection(page: Page) {
  const panel = financialRules(page).panel;
  const labelled = (text: string) =>
    panel.locator('label', { hasText: text }).first().locator('xpath=following::input[1]');
  return {
    delinquencyMode: page.locator('#delinquency-duration-mode'),
    bucket: page.locator('#delinquency-duration-bucket'),
    transferAfter: page.locator('#delinquency-duration-value'),
    firstStatus: page.locator('#first-installment-status'),
    firstDue: page.locator('#collection-cycle-type'),
    dueInterval: page.locator('#collection-cycle-interval'),
    collectionDays: page.locator('#collection-cycle-days'),
    dayChip: (day: number) => panel.getByRole('button', { name: `Remove day ${day}`, exact: true }),
    dayChips: panel.getByRole('button', { name: /^Remove day \d+$/ }),
    dayError: panel.getByText('Enter a day from 1 to 28', { exact: true }),
    lateFeeValue: page.locator('#late-fee-value'),
    earlyPercentage: labelled('Early Percentage'),
    earlyAvailable: page.locator('#early-settlement-available'),
    allocationItems: panel.getByText(/^(Fees|Interest|Loan Amount)$/),
  };
}

/** Opens a Radix select and returns its option texts without changing the value. */
async function optionTexts(page: Page, combobox: Locator) {
  await combobox.click();
  const texts = (await page.getByRole('option').allInnerTexts()).map((t) => t.trim());
  await page.keyboard.press('Escape');
  await expect(page.getByRole('listbox')).toHaveCount(0);
  return texts;
}

async function addCollectionDay(field: Locator, day: string) {
  await field.pressSequentially(day);
  await field.press('Enter');
}

/** Save & Continue from Step 3, then reopen Step 3 of the same product in Edit. */
async function saveAndReopenFinancialRules(page: Page, productCode: string) {
  const form = financialRules(page);
  await expect(form.saveAndContinue).toBeEnabled();
  await form.saveAndContinue.click();
  await expectEligibilityCriteria(page);
  await openFinancialRulesInEdit(page, productCode);
}

/** Cases whose steps run outside the Step 3 configuration screen; they stay skipped with a precise reason. */
const outsideStep3: Record<string, string> = {
  'FS-TC-7262': 'purchase repayment schedule',
  'FS-TC-7263': 'purchase repayment schedule',
  'FS-TC-7264': 'credit account and purchase loan details',
  'FS-TC-7265': 'purchase summary',
  'FS-TC-7266': 'purchase summary',
  'FS-TC-7347': 'purchase summary, schedule and disbursement',
  'FS-TC-7350': 'purchase summary, schedule and disbursement',
  'FS-TC-7355': 'purchase summary, schedule and disbursement',
  'FS-TC-7374': 'purchase summary, schedule and disbursement',
  'FS-TC-7389': 'purchase summary, schedule and disbursement',
  'FS-TC-7400': 'purchase summary, schedule and disbursement',
  'FS-TC-7405': 'purchase summary, schedule and disbursement',
  'FS-TC-3192': 'an overdue installment and the collection run',
  'FS-TC-3203': 'an overdue installment and the collection run',
  'FS-TC-3205': 'an overdue installment and the collection run',
  'FS-TC-3219': 'an overdue installment and a late payment',
  'FS-TC-3242': 'an active loan and a posted payment',
  'FS-TC-3252': 'an active loan and an early settlement request',
  'FS-TC-3258': 'an active loan and an early settlement request',
  'FR-NEW-013': 'a booked loan schedule',
  'FS-TC-3040': 'a Checker-approved product version and an existing loan',
  'FS-TC-3270': 'a Checker-approved product version and an existing loan',
  'FS-TC-3301': 'a Checker-approved product version and new loans',
};

export async function runFinancialRulesCase(page: Page, testInfo: TestInfo, caseId: string) {
  const record = caseById.get(caseId);
  const readiness = record?.['Execution Readiness'] ?? 'Unspecified';

  // Base URL and session come from playwright.config.ts and fixtures/global-setup.ts.
  test.slow();
  const form = financialRules(page);

  switch (caseId) {
    case 'FR-NEW-001':
      await createDraftProductAtFinancialRules(page);
      await fillBaselineFinancialRules(page);
      await form.saveAndContinue.click();
      await expectEligibilityCriteria(page);
      await expect(stepStatus(page, 'Financial Rules')).toHaveText('Completed');
      break;

    case 'FS-TC-3035': {
      const productCode = await createDraftProductAtFinancialRules(page);
      await fillBaselineFinancialRules(page);
      await form.saveAndContinue.click();
      await expectEligibilityCriteria(page);
      await openFinancialRulesInEdit(page, productCode);
      await form.tab('Interest Rate').click();
      await expect(form.interestRate).toHaveValue('25');
      await expect(form.interestType).toContainText('Flat');
      await form.tab('Disbursement Rules').click();
      await expect(form.processingDays).toHaveValue('2');
      await expect(form.disbursementRequired).toBeHidden();
      break;
    }

    case 'FS-TC-5126':
      await createDraftProductAtFinancialRules(page);
      await fillBaselineFinancialRules(page);
      await form.tab('Interest Rate').click();
      await replaceValue(form.interestRate, '');
      await expect(form.saveAndContinue).toBeDisabled();
      await replaceValue(form.interestRate, '25');
      await expect(form.saveAndContinue).toBeEnabled();
      await form.tab('Disbursement Rules').click();
      await replaceValue(form.processingDays, '');
      await expect(form.saveAndContinue).toBeDisabled();
      await replaceValue(form.processingDays, '2');
      await expect(form.saveAndContinue).toBeEnabled();
      break;

    case 'FS-TC-3348':
      await createDraftProductAtFinancialRules(page);
      await fillBaselineFinancialRules(page);
      for (let round = 0; round < 2; round++) {
        for (const name of tabNames) await form.tab(name).click();
        await form.tab('Interest Rate').click();
        await expect(form.interestRate).toHaveValue('25');
        await form.tab('Disbursement Rules').click();
        await expect(form.processingDays).toHaveValue('2');
      }
      break;

    case 'FR-NEW-002':
      test.skip(true, 'Needs a product already submitted for review (edit mode with the change banner); a new draft has no banner or Discard changes.');
      break;

    case 'FS-TC-3308':
      await createDraftProductAtFinancialRules(page);
      await fillBaselineFinancialRules(page);
      await form.saveAndContinue.dblclick();
      await expectEligibilityCriteria(page);
      await expect(page.getByRole('alert').filter({ hasText: /error|failed/i })).toHaveCount(0);
      break;

    case 'FR-NEW-003':
      await createDraftProductAtFinancialRules(page);
      await form.tab('Interest Rate').click();
      for (const option of ['Flat', 'Decreasing']) {
        await chooseOption(page, form.interestType, option);
      }
      break;

    case 'FR-NEW-004':
      await createDraftProductAtFinancialRules(page);
      await fillBaselineFinancialRules(page);
      await form.tab('Interest Rate').click();
      for (const value of ['-1', 'abc', '1.2.3']) {
        await expectRejected(form.interestRate, value, form.saveAndContinue);
      }
      break;

    case 'FS-TC-3049': {
      await createDraftProductAtFinancialRules(page);
      await fillBaselineFinancialRules(page);
      await form.tab('Fees').click();
      await expect(form.adminPercentage).toBeHidden();
      await expect(form.saveAndContinue).toBeEnabled();
      await setSwitch(form.switchFor('Admin fee'), true);
      await expect(form.adminPercentage).toBeVisible();
      await expect(form.saveAndContinue).toBeDisabled();
      break;
    }

    case 'FS-TC-3053': {
      await createDraftProductAtFinancialRules(page);
      await fillBaselineFinancialRules(page);
      await form.tab('Fees').click();
      await setSwitch(form.switchFor('Admin fee'), true);
      for (const value of ['-1', 'abc']) await expectRejected(form.adminPercentage, value, form.saveAndContinue);
      break;
    }

    case 'FS-TC-3061': {
      await createDraftProductAtFinancialRules(page);
      await form.tab('Fees').click();
      await setSwitch(form.switchFor('Admin fee'), true);
      await expect(form.collectionTiming).toContainText('Upfront cash');
      await form.collectionTiming.click();
      await expect(page.getByRole('option')).toHaveText(['Upfront cash', 'Up front deduct from disbursement', 'Financed']);
      for (const option of ['Up front deduct from disbursement', 'Financed', 'Upfront cash']) {
        if (!(await page.getByRole('listbox').isVisible())) await form.collectionTiming.click();
        await page.getByRole('option', { name: option, exact: true }).click();
        await expect(form.collectionTiming).toContainText(option);
      }
      break;
    }

    case 'FS-TC-3073':
      await createDraftProductAtFinancialRules(page);
      await fillBaselineFinancialRules(page);
      await form.tab('Fees').click();
      await form.addFee.click();
      for (const value of ['-10', 'abc']) {
        await expectRejected(form.fixedFeeValue.last(), value, form.saveAndContinue);
      }
      break;

    case 'FS-TC-3087':
      await createDraftProductAtFinancialRules(page);
      await form.tab('Disbursement Rules').click();
      await expect(form.disbursementRequired).toBeVisible();
      await expect(form.saveAndContinue).toBeDisabled();
      await pickDisbursementMethod(page, 'Bank Transfer');
      await expect(page.getByText('Selected Methods:', { exact: true })).toBeVisible();
      break;

    case 'FR-NEW-006':
      await createDraftProductAtFinancialRules(page);
      await fillBaselineFinancialRules(page);
      await form.tab('Disbursement Rules').click();
      for (const value of ['-1', '1.5', 'abc']) {
        await expectRejected(form.processingDays, value, form.saveAndContinue);
      }
      await replaceValue(form.processingDays, '2');
      await expect(form.saveAndContinue).toBeEnabled();
      break;

    case 'FS-TC-3328': {
      await createDraftProductAtFinancialRules(page);
      await form.tab('Collection Rules').click();
      await setSwitch(form.switchFor('Late Fee'), true);
      // Staging keeps the formula input on screen and disables it for the other options (source case said hidden).
      await form.lateCalc.Formula.click();
      await expect(form.formula).toBeEditable();
      for (const option of ['One Time', 'Incrementally (Daily)', 'Incrementally (Monthly)'] as const) {
        await form.lateCalc[option].click();
        await expect(form.formula).not.toBeEditable();
      }
      break;
    }

    case 'FR-NEW-008': {
      await createDraftProductAtFinancialRules(page);
      await fillBaselineFinancialRules(page);
      await form.tab('Collection Rules').click();
      await setSwitch(form.switchFor('Late Fee'), true);
      await expect(form.lateMaximumDays).toBeVisible();
      for (const value of ['-1', 'abc']) await expectRejected(form.lateMaximumDays, value, form.saveAndContinue);
      break;
    }

    case 'FR-NEW-009': {
      await createDraftProductAtFinancialRules(page);
      await fillBaselineFinancialRules(page);
      await form.tab('Collection Rules').click();
      await setSwitch(form.switchFor('Late Installment Rule'), true);
      await expect(page.getByText(/^payment allocation order$/i)).toBeVisible();
      for (const item of ['Fees', 'Interest', 'Loan Amount']) {
        await expect(form.panel.getByText(item, { exact: true }).first()).toBeVisible();
      }
      for (const value of ['101', '-1']) await expectRejected(form.lateInstallmentMinimum, value, form.saveAndContinue);
      break;
    }

    case 'FR-NEW-010': {
      await createDraftProductAtFinancialRules(page);
      await fillBaselineFinancialRules(page);
      await form.tab('Collection Rules').click();
      await setSwitch(form.switchFor('Allow Partial Payment'), true);
      for (const value of ['101', '-1']) await expectRejected(form.partialPaymentMinimum, value, form.saveAndContinue);
      await replaceValue(form.partialPaymentMinimum, '50');
      await expect(form.partialPaymentMinimum).toHaveValue('50');
      break;
    }

    case 'FR-NEW-012': {
      await createDraftProductAtFinancialRules(page);
      await form.tab('Rounding').click();
      await expect(page.getByText('Rounding Direction', { exact: true })).toBeVisible();
      await expect(page.getByText('Rounding Base', { exact: true })).toBeVisible();
      await expect(form.balloonLast).toBeChecked();
      await form.balloonFirst.click();
      await expect(form.balloonFirst).toBeChecked();
      await expect(form.balloonLast).not.toBeChecked();
      break;
    }

    case 'FR-NEW-016':
      test.fail(true, "Known copy defects on staging: 'Ballon payment rounding', 'Right Off', 'principle amount'. Remove this line once fixed.");
      await createDraftProductAtFinancialRules(page);
      await form.tab('Rounding').click();
      await expect(page.getByText('Balloon payment rounding', { exact: true })).toBeVisible();
      await form.tab('Collection Rules').click();
      await setSwitch(form.switchFor('Late Fee'), true);
      await expect(page.locator('label[for="late-action-right"]')).toHaveText('Write Off');
      await form.tab('Fees').click();
      await setSwitch(form.switchFor('Admin fee'), true);
      await expect(page.getByText(/principle/i)).toHaveCount(0);
      break;

    case 'FS-TC-3241': {
      // Precondition order "Loan Amount, Fees, Interest" needs drag-and-drop; the saved default order is used instead.
      const productCode = await createDraftProductAtFinancialRules(page);
      await fillBaselineFinancialRules(page);
      await form.tab('Collection Rules').click();
      await setSwitch(form.switchFor('Late Installment Rule'), true);
      await replaceValue(form.lateInstallmentMinimum, '50');
      await saveAndReopenFinancialRules(page, productCode);
      await form.tab('Collection Rules').click();
      const savedOrder = await collection(page).allocationItems.allInnerTexts();
      expect(savedOrder).toHaveLength(3);
      await replaceValue(form.lateInstallmentMinimum, '60');
      await saveAndReopenFinancialRules(page, productCode);
      await form.tab('Collection Rules').click();
      await expect(form.lateInstallmentMinimum).toHaveValue('60');
      expect(await collection(page).allocationItems.allInnerTexts()).toEqual(savedOrder);
      await page.locator('p').filter({ hasText: /^Loan Structure$/ }).first().click();
      const structure = loanStructure(page);
      await expect(structure.minimumAmount).toHaveValue('10,000');
      await expect(structure.maximumAmount).toHaveValue('1,000,000');
      await expect(structure.minTenure).toHaveValue('6');
      await expect(structure.maxTenure).toHaveValue('12');
      break;
    }

    case 'FS-TC-3084': {
      const productCode = await createDraftProductAtFinancialRules(page);
      await fillBaselineFinancialRules(page);
      await form.tab('Fees').click();
      const fees = [
        ['Application fees', '100'],
        ['Service fees', '50'],
        ['Insurance fees', '200'],
      ] as const;
      for (const [type, value] of fees) await addFee(page, type, value);
      for (let i = 1; i <= 3; i++) {
        const fee = feeFields(page, i);
        for (const label of ['Fee type', 'Fee method', 'Fee value']) await expect(fee.block.getByText(label)).toBeVisible();
        await expect(fee.value).toHaveAttribute('placeholder', 'Enter fixed amount in EGP');
      }
      await form.addFee.click();
      await expect(form.removeFee).toHaveCount(4);
      await expect(feeFields(page, 4).value).toHaveValue('');
      // The new block is empty and would block saving; remove it before the case's own Remove step.
      await feeFields(page, 4).remove.click();
      await feeFields(page, 2).remove.click();
      await expect(form.removeFee).toHaveCount(2);
      const remaining = async () => {
        for (const [i, [type, value]] of [[1, fees[0]], [2, fees[2]]] as const) {
          await expect(feeFields(page, i).type).toContainText(type);
          await expect(feeFields(page, i).value).toHaveValue(new RegExp(`^${value}(\\.0+)?$`));
        }
      };
      await remaining();
      await saveAndReopenFinancialRules(page, productCode);
      await form.tab('Fees').click();
      await expect(form.removeFee).toHaveCount(2);
      await remaining();
      break;
    }

    case 'FS-TC-5136': {
      await createDraftProductAtFinancialRules(page);
      await form.tab('Fees').click();
      await form.addFee.click();
      expect(await optionTexts(page, feeFields(page, 1).type)).toEqual([
        'Application fees',
        'Service fees',
        'Insurance fees',
        'Other',
      ]);
      break;
    }

    case 'FS-TC-3065': {
      const productCode = await createDraftProductAtFinancialRules(page);
      await fillBaselineFinancialRules(page);
      await form.tab('Fees').click();
      const fee = await addFee(page, 'Other', '75');
      await expect(fee.other).toBeVisible();
      await expect(fee.block.getByText(/^Other\s*\*$/)).toBeVisible();
      await expect(form.saveAndContinue).toBeDisabled();
      await replaceValue(fee.other, '   ');
      await expect(form.saveAndContinue).toBeDisabled();
      await replaceValue(fee.other, 'Courier fee');
      await saveAndReopenFinancialRules(page, productCode);
      await form.tab('Fees').click();
      const saved = feeFields(page, 1);
      await expect(saved.other).toHaveValue('Courier fee');
      // Step 4: the maximum length is not confirmed (G-08); record what the field keeps.
      await saved.other.fill('X'.repeat(256));
      testInfo.annotations.push({ type: 'G-08', description: `OTHER kept ${(await saved.other.inputValue()).length} of 256 characters.` });
      await chooseOption(page, saved.type, 'Service fees');
      await expect(saved.other).toBeHidden();
      break;
    }

    case 'FS-TC-5163': {
      const productCode = await createDraftProductAtFinancialRules(page);
      await fillBaselineFinancialRules(page);
      await form.tab('Fees').click();
      const fee = await addFee(page, 'Service fees', '120');
      await fee.percentage.click();
      await expect(fee.value).toHaveValue('');
      await expect(fee.value).toHaveAttribute('placeholder', /percentage/i);
      await replaceValue(fee.value, '100');
      await saveAndReopenFinancialRules(page, productCode);
      await form.tab('Fees').click();
      const saved = feeFields(page, 1);
      await expect(saved.value).toHaveValue(/^100(\.0+)?$/);
      await expectRejected(saved.value, '100.01', form.saveAndContinue);
      break;
    }

    case 'FS-TC-7276': {
      await createDraftProductAtFinancialRules(page);
      await form.tab('Collection Rules').click();
      const c = collection(page);
      expect(await optionTexts(page, c.delinquencyMode)).toEqual(['Exact Days', 'Starting Bucket']);
      await chooseOption(page, c.delinquencyMode, 'Starting Bucket');
      expect(await optionTexts(page, c.bucket)).toEqual(['0-30 Days', '31-60 Days', '61-90 Days', '90+ Days']);
      await chooseOption(page, c.bucket, '31-60 Days');
      await chooseOption(page, c.delinquencyMode, 'Exact Days');
      await expect(c.bucket).toBeHidden();
      await expect(c.transferAfter).toBeVisible();
      await chooseOption(page, c.delinquencyMode, 'Starting Bucket');
      await expect(c.bucket).toBeVisible();
      break;
    }

    case 'FS-TC-7294': {
      // The API/DB check for stale bucket and collection days is out of scope (no verified API contract).
      const productCode = await createDraftProductAtFinancialRules(page);
      await fillBaselineFinancialRules(page);
      await form.tab('Collection Rules').click();
      const c = collection(page);
      await chooseOption(page, c.delinquencyMode, 'Starting Bucket');
      await chooseOption(page, c.bucket, '31-60 Days');
      await chooseOption(page, c.delinquencyMode, 'Exact Days');
      await replaceValue(c.transferAfter, '30');
      await chooseOption(page, c.firstDue, 'Fixed Days of Month');
      for (const day of ['1', '15', '28']) await addCollectionDay(c.collectionDays, day);
      await expect(c.dayChips).toHaveCount(3);
      await chooseOption(page, c.firstDue, 'Days After Purchase');
      await replaceValue(c.dueInterval, '30');
      await saveAndReopenFinancialRules(page, productCode);
      await form.tab('Collection Rules').click();
      await expect(c.delinquencyMode).toContainText('Exact Days');
      await expect(c.transferAfter).toHaveValue('30');
      await expect(c.bucket).toBeHidden();
      await expect(c.firstDue).toContainText('Days After Purchase');
      await expect(c.dueInterval).toHaveValue('30');
      await expect(c.collectionDays).toBeHidden();
      break;
    }

    case 'FS-TC-7278': {
      const productCode = await createDraftProductAtFinancialRules(page);
      await fillBaselineFinancialRules(page);
      await form.tab('Collection Rules').click();
      const c = collection(page);
      expect(await optionTexts(page, c.firstStatus)).toEqual(['Pending', 'Waived']);
      for (const status of ['Waived', 'Pending']) {
        await chooseOption(page, c.firstStatus, status);
        await saveAndReopenFinancialRules(page, productCode);
        await form.tab('Collection Rules').click();
        await expect(c.firstStatus).toContainText(status);
      }
      break;
    }

    case 'FS-TC-7287': {
      const productCode = await createDraftProductAtFinancialRules(page);
      await fillBaselineFinancialRules(page);
      await form.tab('Collection Rules').click();
      const c = collection(page);
      const label = (text: string) => form.panel.locator('label', { hasText: text });
      expect(await optionTexts(page, c.firstDue)).toEqual([
        'On Disbursement Date',
        'Days After Purchase',
        'Every N Days',
        'Fixed Days of Month',
      ]);
      await chooseOption(page, c.firstDue, 'Days After Purchase');
      await expect(label('Days After Purchase')).toBeVisible();
      await replaceValue(c.dueInterval, '30');
      await expect(c.dueInterval).toHaveValue('30');
      await chooseOption(page, c.firstDue, 'Every N Days');
      await expect(label('Interval in Days')).toBeVisible();
      await expect(label('Days After Purchase')).toBeHidden();
      await replaceValue(c.dueInterval, '30');
      await chooseOption(page, c.firstDue, 'Fixed Days of Month');
      await expect(form.panel.locator('label', { hasText: /Collection days\s*\*/ })).toBeVisible();
      await chooseOption(page, c.firstDue, 'On Disbursement Date');
      await expect(c.dueInterval).toBeHidden();
      await expect(c.collectionDays).toBeHidden();
      await chooseOption(page, c.firstDue, 'Days After Purchase');
      await replaceValue(c.dueInterval, '30');
      await saveAndReopenFinancialRules(page, productCode);
      await form.tab('Collection Rules').click();
      await expect(c.firstDue).toContainText('Days After Purchase');
      await expect(c.dueInterval).toHaveValue('30');
      break;
    }

    case 'FS-TC-7284': {
      const productCode = await createDraftProductAtFinancialRules(page);
      await fillBaselineFinancialRules(page);
      await form.tab('Collection Rules').click();
      const c = collection(page);
      await chooseOption(page, c.firstDue, 'Fixed Days of Month');
      await expect(form.saveAndContinue, 'Collection days is required (red *)').toBeDisabled();
      for (const day of ['0', '29']) {
        await addCollectionDay(c.collectionDays, day);
        await expect(c.dayError).toBeVisible();
        await expect(c.dayChips).toHaveCount(0);
        await replaceValue(c.collectionDays, '');
      }
      for (const day of ['1', '28']) await addCollectionDay(c.collectionDays, day);
      await expect(c.dayChip(1)).toBeVisible();
      await expect(c.dayChip(28)).toBeVisible();
      await c.dayChip(28).click();
      for (const day of ['5', '13', '28']) await addCollectionDay(c.collectionDays, day);
      await saveAndReopenFinancialRules(page, productCode);
      await form.tab('Collection Rules').click();
      for (const day of [1, 5, 13, 28]) await expect(c.dayChip(day)).toBeVisible();
      await expect(c.dayChips).toHaveCount(4);
      break;
    }

    case 'FR-NEW-007': {
      await createDraftProductAtFinancialRules(page);
      await fillBaselineFinancialRules(page);
      await form.tab('Collection Rules').click();
      const c = collection(page);
      const toggles: [string, Locator, Locator | null][] = [
        ['Late Fee', form.lateMaximumDays, form.lateMaximumDays],
        ['Late Installment Rule', form.lateInstallmentMinimum, form.lateInstallmentMinimum],
        // Partial payment minimum has no red * on staging, so it is not expected to block saving.
        ['Allow Partial Payment', form.partialPaymentMinimum, null],
        ['Allow Early Settlement', c.earlyPercentage, c.earlyPercentage],
      ];
      for (const [title, field, required] of toggles) {
        await setSwitch(form.switchFor(title), false);
        await expect(field).toBeHidden();
        await expect(form.saveAndContinue).toBeEnabled();
        await setSwitch(form.switchFor(title), true);
        await expect(field).toBeVisible();
        if (required) {
          await replaceValue(required, '');
          await expect(form.saveAndContinue, `${title}: empty required field must block Save & Continue`).toBeDisabled();
        }
        await setSwitch(form.switchFor(title), false);
        await expect(form.saveAndContinue).toBeEnabled();
      }
      break;
    }

    case 'FS-TC-3332': {
      const productCode = await createDraftProductAtFinancialRules(page);
      await fillBaselineFinancialRules(page);
      await form.tab('Collection Rules').click();
      await setSwitch(form.switchFor('Late Fee'), true);
      await form.lateCalc.Formula.click();
      await replaceValue(collection(page).lateFeeValue, '5');
      await replaceValue(form.lateMaximumDays, '30');
      let dialogs = 0;
      page.on('dialog', async (dialog) => {
        dialogs++;
        await dialog.dismiss();
      });
      const serverErrors: string[] = [];
      page.on('response', (r) => {
        if (r.status() >= 500) serverErrors.push(`${r.status()} ${new URL(r.url()).pathname}`);
      });
      await replaceValue(form.formula, 'amount / 0');
      testInfo.annotations.push({ type: 'actual', description: `'amount / 0': Save & Continue ${(await form.saveAndContinue.isEnabled()) ? 'enabled' : 'disabled'}.` });
      await replaceValue(form.formula, 'amount **');
      testInfo.annotations.push({ type: 'G-11', description: `'amount **': Save & Continue ${(await form.saveAndContinue.isEnabled()) ? 'enabled' : 'disabled'} (syntax rule not confirmed).` });
      const script = '<script>alert(1)</script>';
      await replaceValue(form.formula, script);
      await saveAndReopenFinancialRules(page, productCode);
      await form.tab('Collection Rules').click();
      await expect(form.formula).toHaveValue(script);
      expect(dialogs, 'no script may run').toBe(0);
      expect(serverErrors, 'no server error').toEqual([]);
      break;
    }

    case 'FS-TC-3245': {
      const productCode = await createDraftProductAtFinancialRules(page);
      await fillBaselineFinancialRules(page);
      await form.tab('Collection Rules').click();
      await setSwitch(form.switchFor('Allow Early Settlement'), true);
      const early = collection(page).earlyPercentage;
      for (const value of ['5', '7']) {
        await replaceValue(early, value);
        await expect(early).toHaveValue(value);
        await expect(form.saveAndContinue).toBeEnabled();
      }
      for (const value of ['7.01', '7.1', '0', '-2', 'ABC']) await expectRejected(early, value, form.saveAndContinue);
      await replaceValue(early, '7');
      await saveAndReopenFinancialRules(page, productCode);
      await form.tab('Collection Rules').click();
      await expect(collection(page).earlyPercentage).toHaveValue('7');
      break;
    }

    case 'FR-NEW-011': {
      await createDraftProductAtFinancialRules(page);
      await fillBaselineFinancialRules(page);
      await form.tab('Collection Rules').click();
      await setSwitch(form.switchFor('Allow Early Settlement'), true);
      const c = collection(page);
      await replaceValue(c.earlyPercentage, '5');
      await replaceValue(c.earlyAvailable, '24');
      await expect(c.earlyAvailable).toHaveValue('24');
      await expect(form.saveAndContinue).toBeEnabled();
      for (const value of ['25', '1.5', '-1']) await expectRejected(c.earlyAvailable, value, form.saveAndContinue);
      // Step 3: the rule for 0 is not confirmed (G-14); record the behaviour.
      await replaceValue(c.earlyAvailable, '0');
      testInfo.annotations.push({ type: 'G-14', description: `Early Settlement available = 0: field shows "${await c.earlyAvailable.inputValue()}", Save & Continue ${(await form.saveAndContinue.isEnabled()) ? 'enabled' : 'disabled'}.` });
      break;
    }

    // --- FR-MC-*: Financial Rules cases from Flowsky_Minimum_Coverage_Jira_TestCases.xlsx (Original Test Case ID FLOW-0xx).
    case 'FR-MC-008': {
      await createDraftProductAtFinancialRules(page);
      await fillBaselineFinancialRules(page);
      await form.tab('Fees').click();
      const fee = await addFee(page, 'Service fees', '');
      await expect(fee.fixed).toBeChecked();
      await expect(fee.value).toHaveAttribute('placeholder', 'Enter fixed amount in EGP');
      // Decimal rule for fixed fees is not confirmed (GAP-34): record what the field keeps.
      await replaceValue(fee.value, '150.50');
      testInfo.annotations.push({ type: 'GAP-34', description: `Fixed fee 150.50 kept as "${await fee.value.inputValue()}".` });
      for (const value of ['-10', 'abc']) await expectRejected(fee.value, value, form.saveAndContinue);
      await fee.percentage.click();
      await expect(fee.value).toHaveAttribute('placeholder', /percentage/i);
      await expectRejected(fee.value, '101', form.saveAndContinue);
      await fee.fixed.click();
      await expect(fee.value, 'a value invalid for the new method must not be kept').not.toHaveValue('101');
      break;
    }

    case 'FR-MC-010': {
      const productCode = await createDraftProductAtFinancialRules(page);
      await fillBaselineFinancialRules(page);
      await form.tab('Disbursement Rules').click();
      await replaceValue(form.processingDays, '');
      await expect(form.saveAndContinue).toBeDisabled();
      for (const value of ['-1', '1.5', 'abc']) await expectRejected(form.processingDays, value, form.saveAndContinue);
      await replaceValue(form.processingDays, '0');
      testInfo.annotations.push({ type: 'GAP-35', description: `Processing Days 0: Save & Continue ${(await form.saveAndContinue.isEnabled()) ? 'enabled' : 'disabled'}.` });
      await replaceValue(form.processingDays, '2');
      await expect(form.saveAndContinue).toBeEnabled();
      const notes = form.panel.getByRole('textbox', { name: 'Notes' });
      await expect(notes).toHaveValue('');
      const longNote = ('ملاحظة ' + 'Disbursement note '.repeat(30)).slice(0, 500);
      await notes.fill(longNote);
      await saveAndReopenFinancialRules(page, productCode);
      await form.tab('Disbursement Rules').click();
      const stored = await form.panel.getByRole('textbox', { name: 'Notes' }).inputValue();
      expect(longNote.startsWith(stored) && stored.length > 0, 'the note reloads unchanged or as a prefix (length limit)').toBe(true);
      if (stored !== longNote) testInfo.annotations.push({ type: 'limit', description: `Notes kept ${stored.length} of 500 characters.` });
      await expect(form.processingDays).toHaveValue('2');
      break;
    }

    case 'FR-MC-011': {
      const productCode = await createDraftProductAtFinancialRules(page);
      await fillBaselineFinancialRules(page);
      await form.tab('Collection Rules').click();
      const c = collection(page);
      await expect(c.transferAfter).toHaveValue('0');
      testInfo.annotations.push({ type: 'GAP-36', description: 'Transfer to Collection After defaults to 0.' });
      for (const value of ['-1', '1.5', 'abc']) await expectRejected(c.transferAfter, value, form.saveAndContinue);
      await replaceValue(c.transferAfter, '30');
      await expect(form.panel.getByText('Calendar days overdue before the account moves to collection.')).toBeVisible();
      await chooseOption(page, c.firstStatus, 'Waived');
      await chooseOption(page, c.firstDue, 'Fixed Days of Month');
      await addCollectionDay(c.collectionDays, '5');
      await saveAndReopenFinancialRules(page, productCode);
      await form.tab('Collection Rules').click();
      await expect(c.delinquencyMode).toContainText('Exact Days');
      await expect(c.transferAfter).toHaveValue('30');
      await expect(page.locator('#delinquency-duration-unit')).toContainText('Calendar Days');
      await expect(c.firstStatus).toContainText('Waived');
      await expect(c.firstDue).toContainText('Fixed Days of Month');
      await expect(c.dayChip(5)).toBeVisible();
      await chooseOption(page, c.delinquencyMode, 'Starting Bucket');
      await chooseOption(page, c.bucket, '61-90 Days');
      await chooseOption(page, c.firstStatus, 'Pending');
      await chooseOption(page, c.firstDue, 'On Disbursement Date');
      await saveAndReopenFinancialRules(page, productCode);
      await form.tab('Collection Rules').click();
      await expect(c.delinquencyMode).toContainText('Starting Bucket');
      await expect(c.bucket).toContainText('61-90 Days');
      await expect(c.firstStatus).toContainText('Pending');
      await expect(c.firstDue).toContainText('On Disbursement Date');
      break;
    }

    case 'FR-MC-012': {
      const productCode = await createDraftProductAtFinancialRules(page);
      await fillBaselineFinancialRules(page);
      await form.tab('Collection Rules').click();
      const c = collection(page);
      await expect(c.lateFeeValue).toBeHidden();
      await expect(form.saveAndContinue).toBeEnabled();
      await setSwitch(form.switchFor('Late Fee'), true);
      const method = (name: 'Fixed' | 'Percentage') =>
        form.panel
          .locator('div')
          .filter({ has: page.getByText('Late Fee Method') })
          .filter({ has: page.getByRole('radio', { name, exact: true }) })
          .last()
          .getByRole('radio', { name, exact: true });
      await method('Percentage').click();
      await expect(c.lateFeeValue).toHaveAttribute('placeholder', /percentage/i);
      await method('Fixed').click();
      await expect(c.lateFeeValue).not.toHaveAttribute('placeholder', /percentage/i);
      await replaceValue(c.lateFeeValue, '50');
      for (const option of ['One Time', 'Incrementally (Daily)', 'Incrementally (Monthly)'] as const) {
        await form.lateCalc[option].click();
        await expect(form.lateCalc[option]).toBeChecked();
        // Staging disables (does not hide) the formula input for non-Formula options; see FS-TC-3328.
        await expect(form.formula).not.toBeEditable();
      }
      await form.lateCalc.Formula.click();
      await expect(form.formula).toBeEditable();
      await replaceValue(form.formula, '');
      testInfo.annotations.push({ type: 'GAP-37', description: `Empty formula: Save & Continue ${(await form.saveAndContinue.isEnabled()) ? 'enabled' : 'disabled'}.` });
      await form.lateCalc['One Time'].click();
      await replaceValue(form.lateMaximumDays, '30');
      await saveAndReopenFinancialRules(page, productCode);
      await form.tab('Collection Rules').click();
      await expect(form.switchFor('Late Fee')).toHaveAttribute('aria-checked', 'true');
      await expect(method('Fixed')).toBeChecked();
      await expect(form.lateCalc['One Time']).toBeChecked();
      await expect(c.lateFeeValue).toHaveValue(/^50(\.0+)?$/);
      await expect(form.lateMaximumDays).toHaveValue('30');
      break;
    }

    case 'FR-MC-019': {
      // Mutates the product and submits it for review, so it runs only on an approved product the owner agreed to.
      const productId = process.env.EDIT_PRODUCT_ID;
      test.skip(
        !productId || process.env.EDIT_PRODUCT_APPROVED !== 'true',
        'Needs EDIT_PRODUCT_ID to be an approved (previously submitted) QA-owned product and EDIT_PRODUCT_APPROVED=true. A draft has no change banner.',
      );
      await page.goto(appUrl(`/loan-product-config/edit/${productId}`));
      await expectSignedIn(page);
      await page.locator('p').filter({ hasText: /^Financial Rules$/ }).first().click();
      await expect(form.heading).toBeVisible();
      await settleEditReload(page, productId!);
      await form.tab('Interest Rate').click();
      const rate = await form.interestRate.inputValue();
      await form.tab('Disbursement Rules').click();
      const days = await form.processingDays.inputValue();
      await form.tab('Interest Rate').click();
      await replaceValue(form.interestRate, String(Number(rate) + 1));
      await form.tab('Disbursement Rules').click();
      await replaceValue(form.processingDays, String(Number(days) + 1));
      await form.saveAndContinue.click();
      await expectEligibilityCriteria(page);
      const banner = page.getByText(/fields? changed in/).first();
      await expect(banner).toContainText('2 fields changed in Financial Rules');
      await expect(banner, 'GAP-42: no stray ", -" separator').not.toContainText(', -');
      await page.getByRole('button', { name: 'Discard changes' }).click();
      await expect(banner).toBeHidden();
      await page.locator('p').filter({ hasText: /^Financial Rules$/ }).first().click();
      await settleEditReload(page, productId!);
      await form.tab('Interest Rate').click();
      await expect(form.interestRate).toHaveValue(rate);
      await form.tab('Disbursement Rules').click();
      await expect(form.processingDays).toHaveValue(days);
      await form.tab('Interest Rate').click();
      await replaceValue(form.interestRate, String(Number(rate) + 1));
      await form.saveAndContinue.click();
      await expectEligibilityCriteria(page);
      await page.getByRole('button', { name: 'Submit for Review' }).click();
      // Resulting status is not documented (GAP-03); the banner must clear once the change is submitted.
      await expect(banner).toBeHidden();
      break;
    }

    case 'FR-MC-021': {
      const productCode = await createDraftProductAtFinancialRules(page);
      await fillBaselineFinancialRules(page);
      await form.tab('Fees').click();
      await setSwitch(form.switchFor('Admin fee'), true);
      await replaceValue(form.adminPercentage, '2');
      // Step 3 saves through a Next.js server action: POST to the page URL with body [productId, {fields}].
      const saveRequest = page.waitForRequest(
        (r) => r.method() === 'POST' && /"current_step":"financial_rules"/.test(r.postData() ?? ''),
      );
      await form.saveAndContinue.click();
      const captured = await saveRequest;
      await expectEligibilityCriteria(page);
      const [productId, fields] = JSON.parse(captured.postData()!) as [number, Record<string, unknown>];
      const headers = Object.fromEntries(
        Object.entries(captured.headers()).filter(([k]) => ['next-action', 'next-router-state-tree', 'accept', 'content-type'].includes(k)),
      );
      const tampered: [string, Record<string, unknown>][] = [
        ['Admin fee percentage 101', { fee_amount_or_percentage: 101 }],
        ['Early Percentage 8 and Early Settlement available 25', { allow_early_settlement: true, early_settlement_fee_percentage: 8, early_settlement_available_after_installments: 25 }],
        ['No Disbursement Method', { disbursement_methods: [] }],
      ];
      for (const [label, change] of tampered) {
        const response = await page.request.post(captured.url(), { headers, data: JSON.stringify([productId, { ...fields, ...change }]) });
        const body = await response.text();
        testInfo.annotations.push({ type: 'response', description: `${label}: HTTP ${response.status()}; ${body.slice(0, 160).replace(/\s+/g, ' ')}` });
        expect(response.status(), `${label}: no server error`).toBeLessThan(500);
        expect(body, `${label}: no stack trace in the response`).not.toMatch(/\bat \S+ \(|Traceback|Exception:/);
      }
      await openFinancialRulesInEdit(page, productCode);
      await form.tab('Fees').click();
      await expect(form.adminPercentage, 'Admin fee 101 must not be stored').toHaveValue(/^2(\.0+)?$/);
      await form.tab('Collection Rules').click();
      await expect(form.switchFor('Allow Early Settlement'), 'early settlement values must not be stored').toHaveAttribute('aria-checked', 'false');
      await form.tab('Disbursement Rules').click();
      await expect(form.disbursementRequired, 'Disbursement Methods must not be stored empty').toBeHidden();
      break;
    }

    default:
      if (outsideStep3[caseId]) {
        test.skip(true, `Needs ${outsideStep3[caseId]}, which is outside the Step 3 configuration screen and not available in this suite (approved product, credit account, purchase/loan or Checker flow). Workbook readiness: ${readiness}.`);
      }
      test.skip(true, `Blocked: workbook readiness "${readiness}". Waiting on the open gap named there.`);
  }
}
