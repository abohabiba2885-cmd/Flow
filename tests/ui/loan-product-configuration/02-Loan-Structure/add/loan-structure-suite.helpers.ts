import { randomUUID } from 'node:crypto';
import { appUrl, baseUrl } from '../../../../../helpers/common/env';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, test, type Locator, type Page, type TestInfo } from '@playwright/test';

type CaseStatus = 'Automated' | 'Partially Automated' | 'Blocked';

interface SourceCase {
  id: string;
  sourceKey: string | null;
  title: string;
  description: string;
  preconditions: string;
  steps: string;
  data: string;
  expectedResults: string;
  priority: string | null;
  status: CaseStatus;
  notes: string;
  automationFile: string;
}

function isSourceCase(value: unknown): value is SourceCase {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === 'string' &&
    (typeof candidate.sourceKey === 'string' || candidate.sourceKey === null) &&
    typeof candidate.title === 'string' &&
    typeof candidate.description === 'string' &&
    typeof candidate.preconditions === 'string' &&
    typeof candidate.steps === 'string' &&
    typeof candidate.data === 'string' &&
    typeof candidate.expectedResults === 'string' &&
    (candidate.priority === null || typeof candidate.priority === 'string') &&
    ['Automated', 'Partially Automated', 'Blocked'].includes(String(candidate.status)) &&
    typeof candidate.notes === 'string' &&
    typeof candidate.automationFile === 'string'
  );
}

const parsedSourceCases: unknown = JSON.parse(
  readFileSync(resolve(__dirname, 'source-cases.json'), 'utf8'),
);
if (!Array.isArray(parsedSourceCases) || !parsedSourceCases.every(isSourceCase)) {
  throw new Error('Loan Structure source-cases.json has an invalid format.');
}
const sourceCases = parsedSourceCases;
const caseById = new Map(sourceCases.map((sourceCase) => [sourceCase.id, sourceCase]));


const productTypes = {
  loanAmountRange: 'Loan Amount Range',
  tenureOptions: 'Tenure Options',
  repaymentFrequency: 'Repayment Frequency',
  revolving: 'Revolving Product',
  downPayment: 'Down Payment Options',
  transactions: 'Transactions number',
  applications: 'Applications number per user',
  sharing: 'Enable sharing limit with others',
  guarantor: 'Loan Guarantor',
  cancellation: 'Loan Cancellation',
  returnMoney: 'Return money when canceled',
} as const;

export const flow001Values = {
  minimumAmount: '10000',
  maximumAmount: '1000000',
  tenureType: 'Monthly',
  minTenure: '6',
  maxTenure: '12',
  permittedTenor: '3',
  repaymentFrequency: 'Monthly',
  minimumDownPaymentPercent: '10',
  maximumDownPaymentPercent: '50',
  minimumDownPaymentAmount: '10000',
  maximumDownPaymentAmount: '200000',
  maxTransactions: '5',
  maxApplications: '2',
  maxSharing: '2',
  minimumGuarantors: '1',
  maximumGuarantors: '2',
  guarantorType: 'First Degree',
} as const;

export function loanStructure(page: Page) {
  const textbox = (name: string) => page.getByRole('textbox', { name, exact: true });
  const section = (heading: string) =>
    page
      .locator('div')
      .filter({ has: page.getByRole('heading', { name: heading, exact: true }) })
      .filter({ has: page.getByRole('switch') })
      .last();
  const radio = (name: string) => page.getByRole('radio', { name, exact: true }).first();

  return {
    heading: page.getByRole('heading', { name: 'Loan Amount Range', exact: true }),
    cardHeading: page.getByRole('heading', { name: 'Loan Structure Configuration', exact: true }),
    minimumAmount: textbox('Minimum Amount *'),
    maximumAmount: textbox('Maximum Amount *'),
    tenureType: page.getByRole('combobox', { name: 'Select tenure type *' }),
    minTenure: page.locator('#min-months'),
    maxTenure: page.locator('#max-months'),
    permittedTenor: page.locator('#tenure-step'),
    repaymentFrequency: page.getByRole('combobox', { name: 'Repayment Frequency *' }),
    section,
    switchFor: (heading: string) => section(heading).getByRole('switch'),
    revolvingHelpText: page.getByText(
      'When enabled, activation creates a credit account with a reusable limit.',
      { exact: true },
    ),
    percentageOption: radio('Percentage'),
    fixedAmountOption: radio('Fixed Amount'),
    fromPrincipal: radio('From principle amount'),
    fromTotalLoan: radio('From total loan amount (Principal + Interest)'),
    minimumDownPaymentPercent: textbox('Minimum Down Payment (%) *'),
    maximumDownPaymentPercent: textbox('Maximum Down Payment (%) *'),
    minimumDownPaymentAmount: textbox('Minimum Down Payment Amount (EGP) *'),
    maximumDownPaymentAmount: textbox('Maximum Down Payment Amount (EGP) *'),
    maxTransactions: textbox('Max Transactions number *'),
    maxApplications: textbox('Max Applications number *'),
    maxSharing: textbox('Max Number of sharing *'),
    minimumGuarantors: textbox('Minimum Number *'),
    maximumGuarantors: textbox('Maximum Number *'),
    guarantorType: page.getByRole('combobox', { name: 'Guarantor type *' }),
    saveAndContinue: page.getByRole('button', { name: 'Save & Continue' }),
    previous: page.getByRole('button', { name: 'Previous' }),
  };
}

export type LoanStructureForm = ReturnType<typeof loanStructure>;

export async function replaceValue(field: Locator, value: string) {
  await field.click();
  await field.press('ControlOrMeta+A');
  await field.press('Backspace');
  if (value) await field.pressSequentially(value);
}

export async function chooseOption(page: Page, combobox: Locator, option: string) {
  await combobox.click();
  await page.getByRole('option', { name: option, exact: true }).click();
  await expect(combobox).toContainText(option);
}

export async function setSwitch(toggle: Locator, on: boolean) {
  if ((await toggle.getAttribute('aria-checked')) !== String(on)) await toggle.click();
  await expect(toggle).toHaveAttribute('aria-checked', String(on));
}

export function stepStatus(page: Page, stepName: string) {
  return page
    .locator('p')
    .filter({ hasText: new RegExp(`^${stepName}$`) })
    .first()
    .locator('xpath=following-sibling::p[1]');
}

export function completionPercent(page: Page) {
  return page.locator('span').filter({ hasText: /^\d+%\s*Completed$/ }).first();
}

export function financialRulesHeading(page: Page) {
  return page.getByRole('heading', { name: 'Financial Rules & Fees Configuration' });
}

export async function createDraftProductAtLoanStructure(page: Page) {
  const productCode = `LS${randomUUID().replaceAll('-', '').slice(0, 12).toUpperCase()}`;
  await page.goto(appUrl('/loan-product-config/add'));
  await page
    .getByPlaceholder('e.g., Micro Business Loan, Group Lending Product')
    .fill(`QA Loan Structure ${productCode}`);
  await page.getByPlaceholder('e.g., MF-001, GL-001').fill(productCode);
  const generalCombos = page.locator('[data-slot="select-trigger"]');
  await chooseOption(page, generalCombos.nth(0), 'Business Loan');
  await chooseOption(page, generalCombos.nth(1), 'EGP - Egyptian Pound');
  await page.getByRole('button', { name: 'Save & Continue' }).click();
  await expect(loanStructure(page).heading).toBeVisible();
  return productCode;
}

export async function openLoanStructureInEdit(page: Page, productCode: string) {
  test.slow();
  await page.goto(appUrl('/loan-product-config'), { waitUntil: 'domcontentloaded' });
  await page.getByRole('textbox', { name: /Search products/ }).fill(productCode);
  const productRow = page.getByRole('row', { name: new RegExp(productCode) });
  await expect(async () => {
    await productRow.getByRole('cell').first().click();
    await expect(page).toHaveURL(/\/loan-product-config\/edit\/\d+/, { timeout: 5_000 });
  }).toPass({ timeout: 30_000 });
  await page.locator('p').filter({ hasText: /^Loan Structure$/ }).first().click();
  await expect(loanStructure(page).heading).toBeVisible();
}

export async function fillFlow001Values(page: Page, form: LoanStructureForm) {
  const values = flow001Values;
  await replaceValue(form.minimumAmount, values.minimumAmount);
  await replaceValue(form.maximumAmount, values.maximumAmount);
  await chooseOption(page, form.tenureType, values.tenureType);
  await replaceValue(form.minTenure, values.minTenure);
  await replaceValue(form.maxTenure, values.maxTenure);
  await replaceValue(form.permittedTenor, values.permittedTenor);
  await chooseOption(page, form.repaymentFrequency, values.repaymentFrequency);
  await setSwitch(form.switchFor(productTypes.downPayment), true);
  await form.percentageOption.check();
  await form.fromPrincipal.check();
  await replaceValue(form.minimumDownPaymentPercent, values.minimumDownPaymentPercent);
  await replaceValue(form.maximumDownPaymentPercent, values.maximumDownPaymentPercent);
  await setSwitch(form.switchFor(productTypes.transactions), true);
  await replaceValue(form.maxTransactions, values.maxTransactions);
  await setSwitch(form.switchFor(productTypes.applications), true);
  await replaceValue(form.maxApplications, values.maxApplications);
  await setSwitch(form.switchFor(productTypes.sharing), true);
  await replaceValue(form.maxSharing, values.maxSharing);
  await setSwitch(form.switchFor(productTypes.guarantor), true);
  await replaceValue(form.minimumGuarantors, values.minimumGuarantors);
  await replaceValue(form.maximumGuarantors, values.maximumGuarantors);
  await chooseOption(page, form.guarantorType, values.guarantorType);
}

async function saveAndReopen(page: Page, form: LoanStructureForm, productCode: string) {
  await expect(form.saveAndContinue).toBeEnabled();
  await form.saveAndContinue.click();
  await expect(financialRulesHeading(page)).toBeVisible();
  await openLoanStructureInEdit(page, productCode);
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

async function expectIntegerValidation(page: Page, field: string) {
  const validation = page.getByRole('alert').filter({ hasText: 'A valid integer is required.' });
  await expect(validation).toContainText(`${field}: A valid integer is required.`);
}

async function assertBaselineValues(page: Page) {
  const form = loanStructure(page);
  for (const [field, value] of [
    [form.minimumAmount, '10,000'],
    [form.maximumAmount, '1,000,000'],
    [form.minTenure, '6'],
    [form.maxTenure, '12'],
    [form.permittedTenor, '3'],
    [form.minimumDownPaymentPercent, '10'],
    [form.maximumDownPaymentPercent, '50'],
    [form.maxTransactions, '5'],
    [form.maxApplications, '2'],
    [form.maxSharing, '2'],
    [form.minimumGuarantors, '1'],
    [form.maximumGuarantors, '2'],
  ] as const) {
    await expect(field).toHaveValue(value);
  }
  await expect(form.tenureType).toContainText('Monthly');
  await expect(form.repaymentFrequency).toContainText('Monthly');
  await expect(form.percentageOption).toBeChecked();
  await expect(form.fromPrincipal).toBeChecked();
  await expect(form.switchFor(productTypes.downPayment)).toHaveAttribute('aria-checked', 'true');
  await expect(form.switchFor(productTypes.transactions)).toHaveAttribute('aria-checked', 'true');
  await expect(form.switchFor(productTypes.applications)).toHaveAttribute('aria-checked', 'true');
  await expect(form.switchFor(productTypes.sharing)).toHaveAttribute('aria-checked', 'true');
  await expect(form.switchFor(productTypes.guarantor)).toHaveAttribute('aria-checked', 'true');
  await expect(form.guarantorType).toContainText('First Degree');
}

export async function runLoanStructureCase(page: Page, testInfo: TestInfo, caseId: string) {
  const sourceCase = caseById.get(caseId);
  if (!sourceCase) throw new Error(`No source workbook record exists for ${caseId}.`);

  test.skip(
    sourceCase.status === 'Blocked',
    sourceCase.notes || 'The source case is blocked pending requirements or environment access.',
  );
  // Base URL and session come from playwright.config.ts and fixtures/global-setup.ts.
  test.skip(
    testInfo.project.name !== 'chromium' && caseId === 'FS-TC-209',
    'Clipboard paste validation is restricted to Chromium.',
  );

  if (caseId === 'FS-TC-4026' || caseId === 'FS-TC-1243') {
    test.skip(true, 'Blocked: tenor choices require a customer purchase flow and data not available in this suite.');
  }
  if (caseId === 'FS-TC-543' || caseId === 'FS-TC-4037' || caseId === 'FS-TC-4038' || caseId === 'FS-TC-4052') {
    test.skip(true, 'Blocked: the case requires purchase, customer or loan-activation workflows outside Step 2.');
  }

  const productCode = await createDraftProductAtLoanStructure(page);
  const form = loanStructure(page);

  switch (caseId) {
    case 'FS-TC-199':
      await fillFlow001Values(page, form);
      await expect(form.saveAndContinue).toBeEnabled();
      await expect(page.getByRole('alert')).toBeEmpty();
      await form.saveAndContinue.click();
      await expect(financialRulesHeading(page)).toBeVisible();
      await expect(page.getByRole('alert')).toBeEmpty();
      await expect(stepStatus(page, 'Loan Structure')).toHaveText('Completed');
      break;

    case 'FS-TC-1220': {
      await expect(form.cardHeading).toBeVisible();
      const headings = [
        'Loan Amount Range',
        'Tenure Options',
        'Revolving Product',
        'Down Payment Options',
        'Transactions number',
        'Applications number per user',
        'Enable sharing limit with others',
        'Loan Guarantor',
        'Loan Cancellation',
        'Return money when canceled',
      ];
      const orderedSections: Locator[] = [
        page.getByRole('heading', { name: 'Loan Amount Range', exact: true }),
        page.getByRole('heading', { name: 'Tenure Options', exact: true }),
        form.repaymentFrequency,
        ...headings.slice(2).map((heading) =>
          page.getByRole('heading', { name: heading, exact: true }),
        ),
      ];
      const positions = await Promise.all(
        orderedSections.map((section) =>
          section.evaluate((element) => element.getBoundingClientRect().top + window.scrollY),
        ),
      );
      expect(positions).toEqual([...positions].sort((left, right) => left - right));
      for (const heading of headings) {
        await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
      }
      await expect(page.getByText('Closed Loop Card Configuration', { exact: true })).toHaveCount(0);
      break;
    }

    case 'FS-TC-1278':
    case 'FS-TC-4053':
    case 'FS-TC-185': {
      await fillFlow001Values(page, form);
      await expect(form.saveAndContinue).toBeEnabled();
      await form.saveAndContinue.click();
      await expect(financialRulesHeading(page)).toBeVisible();
      if (caseId === 'FS-TC-1278') {
        await openLoanStructureInEdit(page, productCode);
        await expect(form.previous).toBeEnabled();
        await page.getByRole('button', { name: 'Previous' }).click();
        await expect(
          page.getByPlaceholder('e.g., Micro Business Loan, Group Lending Product'),
        ).toBeVisible();
        await page.getByRole('button', { name: 'Save & Continue' }).click();
      }
      if (caseId === 'FS-TC-4053') {
        await page.getByRole('button', { name: 'Previous' }).click();
      }
      if (caseId === 'FS-TC-185') {
        await page.reload();
        await openLoanStructureInEdit(page, productCode);
      }
      await assertBaselineValues(page);
      break;
    }

    case 'FS-TC-1221':
      await fillFlow001Values(page, form);
      await form.saveAndContinue.click();
      await expect(stepStatus(page, 'Loan Structure')).toHaveText('Completed');
      await expect(page.getByText('Saved as draft', { exact: false })).toBeVisible();
      await expect(completionPercent(page)).toBeVisible();
      break;

    case 'FS-TC-1284':
      await fillFlow001Values(page, form);
      await form.saveAndContinue.click();
      await expect(financialRulesHeading(page)).toBeVisible();
      await openLoanStructureInEdit(page, productCode);
      await replaceValue(form.minimumAmount, '20000');
      await page.reload();
      await openLoanStructureInEdit(page, productCode);
      await expect(form.minimumAmount).toHaveValue('10,000');
      break;

    case 'FS-TC-191': {
      await fillFlow001Values(page, form);
      const requiredTextFields = [
        form.minimumAmount,
        form.maximumAmount,
        form.minTenure,
        form.maxTenure,
        form.minimumDownPaymentPercent,
        form.maximumDownPaymentPercent,
        form.maxTransactions,
        form.maxApplications,
        form.maxSharing,
        form.minimumGuarantors,
        form.maximumGuarantors,
      ];
      for (const field of requiredTextFields) {
        const validValue = await field.inputValue();
        await replaceValue(field, '');
        await field.blur();
        await expect(form.saveAndContinue).toBeDisabled();
        await field.press('Enter');
        await expect(form.heading).toBeVisible();
        await replaceValue(field, validValue.replaceAll(',', ''));
        await expect(form.saveAndContinue).toBeEnabled();
      }
      break;
    }

    case 'FS-TC-1277':
      await fillFlow001Values(page, form);
      await replaceValue(form.minimumAmount, '1000000');
      await replaceValue(form.maximumAmount, '10000');
      await replaceValue(form.minTenure, '12');
      await replaceValue(form.maxTenure, '6');
      await replaceValue(form.minimumDownPaymentPercent, '60');
      await replaceValue(form.maximumDownPaymentPercent, '50');
      await form.maximumDownPaymentPercent.blur();
      await expect(form.saveAndContinue).toBeDisabled();
      await replaceValue(form.maximumAmount, '1000000');
      await form.maximumAmount.blur();
      await expect(form.saveAndContinue).toBeDisabled();
      await replaceValue(form.minTenure, '6');
      await form.minTenure.blur();
      await expect(form.saveAndContinue).toBeDisabled();
      await replaceValue(form.minimumDownPaymentPercent, '40');
      await form.minimumDownPaymentPercent.blur();
      await expect(form.saveAndContinue).toBeEnabled();
      break;

    case 'FS-TC-184':
      await fillFlow001Values(page, form);
      await expect(form.minimumAmount).toHaveValue('10,000');
      await expect(form.maximumAmount).toHaveValue('1,000,000');
      await form.saveAndContinue.click();
      await expect(financialRulesHeading(page)).toBeVisible();
      await openLoanStructureInEdit(page, productCode);
      await expect(form.minimumAmount).toHaveValue('10,000');
      await expect(form.maximumAmount).toHaveValue('1,000,000');
      break;

    case 'FS-TC-4023':
      await fillFlow001Values(page, form);
      await saveAndReopen(page, form, productCode);
      for (const [minimum, maximum] of [['1000000', '10000'], ['50000', '49999']] as const) {
        await replaceValue(form.minimumAmount, minimum);
        await replaceValue(form.maximumAmount, maximum);
        await form.maximumAmount.blur();
        const invalidMessage = page.getByText(
          'Maximum amount shall not be less than the minimum amount',
          { exact: true },
        );
        expect(
          (await form.saveAndContinue.isDisabled()) || (await invalidMessage.isVisible()),
        ).toBe(true);
        await expect(form.heading).toBeVisible();
        if (await form.saveAndContinue.isEnabled()) {
          await form.saveAndContinue.click();
          await expect(form.heading).toBeVisible();
        }
        await openLoanStructureInEdit(page, productCode);
        await expect(form.minimumAmount).toHaveValue('10,000');
        await expect(form.maximumAmount).toHaveValue('1,000,000');
      }
      await replaceValue(form.maximumAmount, '1000001');
      await replaceValue(form.minimumAmount, '1000000');
      await expect(form.saveAndContinue).toBeEnabled();
      await form.saveAndContinue.click();
      await expect(financialRulesHeading(page)).toBeVisible();
      break;

    case 'FS-TC-188':
    case 'FS-TC-189': {
      await fillFlow001Values(page, form);
      const values = caseId === 'FS-TC-188' ? ['-100', '-5000', '10.5.5'] : ['abc', '@%!', '1e5', '   '];
      for (const field of [form.minimumAmount, form.maximumAmount]) {
        for (const value of values) await expectRejected(field, value, form.saveAndContinue);
      }
      break;
    }

    case 'FS-TC-190': {
      test.fail(true, 'Known defect: Maximum Amount silently truncates 999999999999999 to 999999999.');
      await fillFlow001Values(page, form);
      const maxValue = '999999999999999';
      await replaceValue(form.maximumAmount, maxValue);
      const displayed = await form.maximumAmount.inputValue();
      expect(displayed.replaceAll(',', '')).toBe(maxValue);
      if (await form.saveAndContinue.isEnabled()) {
        await form.saveAndContinue.click();
        await expect(financialRulesHeading(page)).toBeVisible();
        await openLoanStructureInEdit(page, productCode);
        expect((await form.maximumAmount.inputValue()).replaceAll(',', '')).toBe(maxValue);
      } else {
        await expect(form.heading).toBeVisible();
      }
      break;
    }

    case 'FS-TC-1232': {
      await fillFlow001Values(page, form);
      await replaceValue(form.minimumAmount, '5000.50');
      await replaceValue(form.maximumAmount, '100000.75');
      await replaceValue(form.minimumDownPaymentPercent, '10.5');
      await expect(form.minimumAmount).toHaveValue('5,000.5');
      await expect(form.maximumAmount).toHaveValue('100,000.75');
      await expect(form.minimumDownPaymentPercent).toHaveValue('10.5');
      await form.saveAndContinue.click();
      await expectIntegerValidation(page, 'min_amount');
      await expectIntegerValidation(page, 'max_amount');
      await expectIntegerValidation(page, 'min_down_payment_percentage');
      await expect(form.heading).toBeVisible();

      await fillFlow001Values(page, form);
      await replaceValue(form.minimumAmount, '10000.555');
      await expect(form.minimumAmount).toHaveValue('10000.55');
      await expect(form.minimumAmount).toHaveAttribute('aria-invalid', 'true');
      await form.saveAndContinue.click();
      await expectIntegerValidation(page, 'min_amount');
      await expect(form.heading).toBeVisible();

      await fillFlow001Values(page, form);
      await replaceValue(form.minimumDownPaymentPercent, '10.5');
      await form.saveAndContinue.click();
      await expectIntegerValidation(page, 'min_down_payment_percentage');
      await expect(form.heading).toBeVisible();
      break;
    }

    case 'FS-TC-209': {
      await fillFlow001Values(page, form);
      await page.context().grantPermissions(['clipboard-read', 'clipboard-write'], {
        origin: new URL(baseUrl()).origin,
      });
      for (const field of [
        form.minimumAmount,
        form.minTenure,
        form.permittedTenor,
        form.minimumDownPaymentPercent,
        form.maxTransactions,
      ]) {
        for (const value of ['abc', '-10']) {
          await page.evaluate(async (text) => navigator.clipboard.writeText(text), value);
          await field.focus();
          await field.press('ControlOrMeta+A');
          await field.press('ControlOrMeta+V');
          await field.blur();
          expect(
            (await field.inputValue()) !== value || (await form.saveAndContinue.isDisabled()),
          ).toBe(true);
        }
      }
      break;
    }

    case 'FS-TC-198':
      await fillFlow001Values(page, form);
      await expect(form.saveAndContinue).toBeEnabled();
      await form.saveAndContinue.click();
      await expect(financialRulesHeading(page)).toBeVisible();
      await openLoanStructureInEdit(page, productCode);
      await expect(form.tenureType).toContainText('Monthly');
      await expect(form.minTenure).toHaveValue('6');
      await expect(form.maxTenure).toHaveValue('12');
      await expect(form.permittedTenor).toHaveValue('3');
      break;

    case 'FS-TC-203':
      await fillFlow001Values(page, form);
      for (const [minimum, maximum] of [['12', '6'], ['60', '12']] as const) {
        await replaceValue(form.minTenure, minimum);
        await replaceValue(form.maxTenure, maximum);
        await form.maxTenure.blur();
        await expect(form.saveAndContinue).toBeDisabled();
        await expect(form.heading).toBeVisible();
      }
      await replaceValue(form.minTenure, '6');
      await replaceValue(form.maxTenure, '12');
      await expect(form.saveAndContinue).toBeEnabled();
      await form.saveAndContinue.click();
      await expect(financialRulesHeading(page)).toBeVisible();
      break;

    case 'FS-TC-200':
      await fillFlow001Values(page, form);
      for (const field of [form.minTenure, form.maxTenure]) {
        for (const value of ['-6', 'abc']) await expectRejected(field, value, form.saveAndContinue);
      }
      break;

    case 'FS-TC-196':
      await fillFlow001Values(page, form);
      await expect(
        page.getByText('Step size for tenure options (e.g., 3 for 3, 6, 9, 12 months)', {
          exact: true,
        }),
      ).toBeVisible();
      await expect(form.permittedTenor).toHaveValue('3');
      await form.saveAndContinue.click();
      await expect(financialRulesHeading(page)).toBeVisible();
      await openLoanStructureInEdit(page, productCode);
      await expect(form.permittedTenor).toHaveValue('3');
      break;

    case 'FS-TC-4030':
    case 'FS-TC-205':
    case 'FS-TC-4031':
    case 'FS-TC-4049':
    case 'LS-NEW-010':
    case 'LS-NEW-018':
    case 'LS-NEW-019':
    case 'LS-NEW-020':
    case 'LS-NEW-021':
    case 'LS-NEW-022':
    case 'LS-NEW-026':
    case 'LS-NEW-027':
      test.skip(true, sourceCase.notes || 'Blocked by a documented prerequisite or unresolved business rule.');
      break;

    case 'FS-TC-202':
      await fillFlow001Values(page, form);
      for (const value of ['0', '-3', '-24', 'abc']) {
        await expectRejected(form.permittedTenor, value, form.saveAndContinue);
      }
      break;

    case 'LS-NEW-006':
      await fillFlow001Values(page, form);
      await expect(form.minTenure).toHaveValue('6');
      await expect(form.permittedTenor).toHaveValue('3');
      await expect(form.saveAndContinue).toBeEnabled();
      await form.saveAndContinue.click();
      await expect(financialRulesHeading(page)).toBeVisible();
      break;

    case 'LS-NEW-007':
      await fillFlow001Values(page, form);
      await replaceValue(form.permittedTenor, '');
      await expect(form.saveAndContinue).toBeEnabled();
      await form.saveAndContinue.click();
      await expect(financialRulesHeading(page)).toBeVisible();
      await openLoanStructureInEdit(page, productCode);
      await expect(form.permittedTenor).toBeVisible();
      break;

    case 'FS-TC-197':
      await fillFlow001Values(page, form);
      await replaceValue(form.permittedTenor, '');
      await expect(
        page.getByText('Step size for tenure options (e.g., 3 for 3, 6, 9, 12 months)', {
          exact: true,
        }),
      ).toBeVisible();
      break;

    case 'FS-TC-208':
      test.fail(true, 'Known defect: Max Months silently truncates 1000 to 100.');
      await fillFlow001Values(page, form);
      for (const value of ['1000', '9999']) {
        await replaceValue(form.maxTenure, value);
        const accepted = await form.maxTenure.inputValue();
        expect(accepted).toBe(value);
      }
      break;

    case 'FS-TC-1245':
      await fillFlow001Values(page, form);
      await form.repaymentFrequency.click();
      await expect(page.getByRole('option', { name: 'Monthly', exact: true })).toBeVisible();
      await page.getByRole('option', { name: 'Weekly', exact: true }).click();
      await expect(form.repaymentFrequency).toContainText('Weekly');
      await form.saveAndContinue.click();
      await expect(financialRulesHeading(page)).toBeVisible();
      await openLoanStructureInEdit(page, productCode);
      await expect(form.repaymentFrequency).toContainText('Weekly');
      break;

    case 'FS-TC-4032':
      await fillFlow001Values(page, form);
      await chooseOption(page, form.tenureType, 'Weekly');
      await expect(page.getByText('Min Weeks', { exact: false })).toBeVisible();
      await expect(page.getByText('Max Weeks', { exact: false })).toBeVisible();
      await chooseOption(page, form.tenureType, 'Monthly');
      await expect(page.getByText('Min Months', { exact: false })).toBeVisible();
      await expect(page.getByText('Max Months', { exact: false })).toBeVisible();
      break;

    case 'FS-TC-1246':
      await expect(form.tenureType).toBeVisible();
      await expect(form.repaymentFrequency).toBeVisible();
      for (const heading of [
        productTypes.revolving,
        productTypes.downPayment,
        productTypes.transactions,
        productTypes.applications,
        productTypes.sharing,
        productTypes.guarantor,
        productTypes.cancellation,
        productTypes.returnMoney,
      ]) {
        await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
      }
      break;

    case 'LS-NEW-009': {
      await fillFlow001Values(page, form);
      const revolving = form.switchFor(productTypes.revolving);
      await setSwitch(revolving, false);
      await saveAndReopen(page, form, productCode);
      await expect(revolving).toHaveAttribute('aria-checked', 'false');
      await setSwitch(revolving, true);
      await saveAndReopen(page, form, productCode);
      await expect(revolving).toHaveAttribute('aria-checked', 'true');
      await expect(form.revolvingHelpText).toBeVisible();
      break;
    }

    case 'FS-TC-539':
      await fillFlow001Values(page, form);
      await setSwitch(form.switchFor(productTypes.downPayment), false);
      await expect(form.percentageOption).toBeHidden();
      await expect(form.fixedAmountOption).toBeHidden();
      await expect(form.saveAndContinue).toBeEnabled();
      await setSwitch(form.switchFor(productTypes.downPayment), true);
      await expect(form.percentageOption).toBeVisible();
      await expect(form.fixedAmountOption).toBeVisible();
      break;

    case 'FS-TC-533':
      await fillFlow001Values(page, form);
      await form.fromPrincipal.check();
      await expect(form.fromPrincipal).toBeChecked();
      await expect(form.fromTotalLoan).not.toBeChecked();
      await saveAndReopen(page, form, productCode);
      await form.fromTotalLoan.check();
      await expect(form.fromTotalLoan).toBeChecked();
      await expect(form.fromPrincipal).not.toBeChecked();
      await saveAndReopen(page, form, productCode);
      await expect(form.fromTotalLoan).toBeChecked();
      await expect(form.minimumDownPaymentPercent).toHaveValue('10');
      await expect(form.maximumDownPaymentPercent).toHaveValue('50');
      break;

    case 'FS-TC-4042':
      await fillFlow001Values(page, form);
      for (const field of [form.minimumDownPaymentPercent, form.maximumDownPaymentPercent]) {
        for (const value of ['-1', '-10', '100.01', '101', '120', '150', '999999999999']) {
          await expectRejected(field, value, form.saveAndContinue);
        }
      }
      await replaceValue(form.minimumDownPaymentPercent, '10');
      await replaceValue(form.maximumDownPaymentPercent, '50');
      await expect(form.saveAndContinue).toBeEnabled();
      break;

    case 'FS-TC-4039':
      await fillFlow001Values(page, form);
      await replaceValue(form.minimumDownPaymentPercent, '60');
      await replaceValue(form.maximumDownPaymentPercent, '50');
      await form.maximumDownPaymentPercent.blur();
      await expect(form.saveAndContinue).toBeDisabled();
      await replaceValue(form.minimumDownPaymentPercent, '40');
      await expect(form.saveAndContinue).toBeEnabled();
      await form.saveAndContinue.click();
      await expect(financialRulesHeading(page)).toBeVisible();
      break;

    case 'FS-TC-535':
      test.skip(true, 'Blocked: 0% and 100% boundaries await confirmation of rule Q-06.');
      break;

    case 'FS-TC-536':
      await fillFlow001Values(page, form);
      for (const field of [form.minimumDownPaymentPercent, form.maximumDownPaymentPercent]) {
        for (const value of ['abc', '@%!', '1e2']) {
          await expectRejected(field, value, form.saveAndContinue);
        }
      }
      break;

    case 'FS-TC-4044':
      await fillFlow001Values(page, form);
      await form.fixedAmountOption.check();
      await expect(form.percentageOption).not.toBeChecked();
      await expect(form.minimumDownPaymentPercent).toBeHidden();
      await expect(form.minimumDownPaymentAmount).toBeVisible();
      await expect(form.maximumDownPaymentAmount).toBeVisible();
      await expect(form.saveAndContinue).toBeDisabled();
      await replaceValue(form.minimumDownPaymentAmount, '10000');
      await replaceValue(form.maximumDownPaymentAmount, '200000');
      await expect(form.saveAndContinue).toBeEnabled();
      await saveAndReopen(page, form, productCode);
      await expect(form.fixedAmountOption).toBeChecked();
      await expect(form.minimumDownPaymentAmount).toHaveValue('10,000');
      await expect(form.maximumDownPaymentAmount).toHaveValue('200,000');
      await form.percentageOption.check();
      await expect(form.fixedAmountOption).not.toBeChecked();
      break;

    case 'FS-TC-4045':
      await fillFlow001Values(page, form);
      await replaceValue(form.minimumDownPaymentPercent, '25');
      await replaceValue(form.maximumDownPaymentPercent, '50');
      await form.fixedAmountOption.check();
      await replaceValue(form.minimumDownPaymentAmount, '10000');
      await replaceValue(form.maximumDownPaymentAmount, '200000');
      await expect(form.minimumDownPaymentPercent).toBeHidden();
      await expect(form.maximumDownPaymentPercent).toBeHidden();
      await expect(form.minimumDownPaymentAmount).not.toHaveValue('25');
      await expect(form.maximumDownPaymentAmount).not.toHaveValue('50');
      break;

    case 'FS-TC-1259':
      await fillFlow001Values(page, form);
      await form.fixedAmountOption.check();
      await replaceValue(form.minimumDownPaymentAmount, '10000');
      await replaceValue(form.maximumDownPaymentAmount, '200000');
      await expect(form.saveAndContinue).toBeEnabled();
      await replaceValue(form.minimumDownPaymentAmount, '-10000');
      await expect(form.minimumDownPaymentAmount).not.toHaveValue('-10000');
      break;

    case 'FS-TC-4043':
      test.skip(true, 'Blocked: fixed down-payment maximum rule Q-07 is unconfirmed.');
      break;

    case 'FS-TC-4046': {
      await fillFlow001Values(page, form);
      const limits = [
        [productTypes.transactions, form.maxTransactions],
        [productTypes.applications, form.maxApplications],
        [productTypes.sharing, form.maxSharing],
      ] as const;
      for (const [heading, field] of limits) {
        const toggle = form.switchFor(heading);
        await setSwitch(toggle, false);
        await expect(field).toBeHidden();
        await expect(form.saveAndContinue).toBeEnabled();
        await setSwitch(toggle, true);
        await replaceValue(field, '');
        await expect(field).toBeVisible();
        await expect(form.saveAndContinue).toBeDisabled();
        await replaceValue(field, '1');
        await expect(form.saveAndContinue).toBeEnabled();
      }
      break;
    }

    case 'FS-TC-4047':
      await fillFlow001Values(page, form);
      for (const field of [form.maxTransactions, form.maxApplications, form.maxSharing]) {
        await replaceValue(field, '5');
        await expect(form.saveAndContinue).toBeEnabled();
        await saveAndReopen(page, form, productCode);
        await expect(field).toHaveValue('5');
        await replaceValue(field, '1');
        await expect(form.saveAndContinue).toBeEnabled();
        for (const value of ['0', '-1', '1.5', '2.5', 'abc']) {
          await expectRejected(field, value, form.saveAndContinue);
        }
        await replaceValue(field, '5');
        await expect(form.saveAndContinue).toBeEnabled();
      }
      break;

    case 'LS-NEW-015': {
      await fillFlow001Values(page, form);
      const toggle = form.switchFor(productTypes.guarantor);
      await setSwitch(toggle, false);
      await expect(form.minimumGuarantors).toBeHidden();
      await expect(form.maximumGuarantors).toBeHidden();
      await setSwitch(toggle, true);
      await expect(form.minimumGuarantors).toBeVisible();
      await expect(form.maximumGuarantors).toBeVisible();
      await expect(form.guarantorType).toBeVisible();
      await replaceValue(form.minimumGuarantors, '1');
      await replaceValue(form.maximumGuarantors, '2');
      await form.guarantorType.click();
      await expect(page.getByRole('option')).toHaveText([
        'First Degree',
        'Second Degree',
        'Third Degree',
      ]);
      await page.getByRole('option', { name: 'First Degree', exact: true }).click();
      await expect(form.guarantorType).toContainText('First Degree');
      await saveAndReopen(page, form, productCode);
      await expect(form.minimumGuarantors).toHaveValue('1');
      await expect(form.maximumGuarantors).toHaveValue('2');
      await expect(form.guarantorType).toContainText('First Degree');
      break;
    }

    case 'LS-NEW-016':
      await fillFlow001Values(page, form);
      await replaceValue(form.minimumGuarantors, '3');
      await replaceValue(form.maximumGuarantors, '1');
      await expect(form.saveAndContinue).toBeDisabled();
      await replaceValue(form.minimumGuarantors, '1');
      await replaceValue(form.maximumGuarantors, '1');
      await expect(form.saveAndContinue).toBeEnabled();
      await expectRejected(form.minimumGuarantors, '-1', form.saveAndContinue);
      break;

    case 'LS-NEW-017': {
      await fillFlow001Values(page, form);
      const cancellation = form.switchFor(productTypes.cancellation);
      const returnMoney = form.switchFor(productTypes.returnMoney);
      await setSwitch(cancellation, true);
      await setSwitch(returnMoney, true);
      await saveAndReopen(page, form, productCode);
      await expect(cancellation).toHaveAttribute('aria-checked', 'true');
      await expect(returnMoney).toHaveAttribute('aria-checked', 'true');
      await setSwitch(cancellation, false);
      break;
    }

    case 'FS-TC-4054':
      await fillFlow001Values(page, form);
      await replaceValue(form.minimumAmount, '20000');
      await form.saveAndContinue.dblclick();
      await expect(financialRulesHeading(page)).toBeVisible();
      await openLoanStructureInEdit(page, productCode);
      await expect(form.minimumAmount).toHaveValue('20,000');
      break;

    case 'LS-NEW-028':
      await fillFlow001Values(page, form);
      await page.context().setOffline(true);
      try {
        await form.saveAndContinue.click();
        await expect(form.heading).toBeVisible();
        await expect(form.minimumAmount).toHaveValue('10,000');
      } finally {
        await page.context().setOffline(false);
      }
      await form.saveAndContinue.click();
      await expect(financialRulesHeading(page)).toBeVisible();
      await openLoanStructureInEdit(page, productCode);
      await expect(form.minimumAmount).toHaveValue('10,000');
      break;

    case 'FS-TC-186':
      await expect(form.heading).toBeVisible();
      for (const name of [
        'Minimum Amount *',
        'Maximum Amount *',
        'Min Months *',
        'Max Months *',
      ]) {
        await expect(page.getByRole('textbox', { name, exact: true })).toBeVisible();
      }
      await expect(form.tenureType).toBeVisible();
      await expect(form.repaymentFrequency).toBeVisible();
      await expect(form.permittedTenor).toHaveAttribute('placeholder', /.+/);
      await expect(
        page.getByText('Step size for tenure options (e.g., 3 for 3, 6, 9, 12 months)', {
          exact: true,
        }),
      ).toBeVisible();
      await expect(form.revolvingHelpText).toBeVisible();
      break;

    case 'FS-TC-1281': {
      await fillFlow001Values(page, form);
      await form.minimumAmount.focus();
      const visited = new Set<string>();
      for (let i = 0; i < 60; i += 1) {
        const focusedName = await page.evaluate(() => {
          const element = document.activeElement;
          return element instanceof HTMLElement
            ? `${element.tagName}:${element.getAttribute('aria-label') ?? element.textContent?.trim() ?? ''}`
            : '';
        });
        visited.add(focusedName);
        if (focusedName.includes('Save & Continue')) break;
        await page.keyboard.press('Tab');
      }
      expect([...visited].some((name) => name.includes('Save & Continue'))).toBe(true);
      const downPaymentSwitch = form.switchFor(productTypes.downPayment);
      await downPaymentSwitch.focus();
      await page.keyboard.press('Space');
      await expect(form.percentageOption).toBeHidden();
      await page.keyboard.press('Space');
      await expect(form.percentageOption).toBeVisible();
      break;
    }

    case 'FS-TC-210':
      await fillFlow001Values(page, form);
      for (const width of [1920, 1366, 1024, 768]) {
        await page.setViewportSize({ width, height: 900 });
        for (const field of [
          form.minimumAmount,
          form.maximumAmount,
          form.minTenure,
          form.maxTenure,
          form.permittedTenor,
          form.minimumDownPaymentPercent,
          form.maximumDownPaymentPercent,
          form.maxTransactions,
          form.maxApplications,
          form.maxSharing,
          form.minimumGuarantors,
          form.maximumGuarantors,
          form.saveAndContinue,
        ]) {
          await expect(field).toBeVisible();
          const box = await field.boundingBox();
          expect(box).not.toBeNull();
          expect(box!.x).toBeGreaterThanOrEqual(0);
          expect(box!.x + box!.width).toBeLessThanOrEqual(width);
        }
      }
      await form.saveAndContinue.click();
      await expect(financialRulesHeading(page)).toBeVisible();
      break;

    case 'LS-NEW-029':
      await fillFlow001Values(page, form);
      await expect(form.minimumDownPaymentPercent).toBeVisible();
      await expect(form.maximumDownPaymentPercent).toBeVisible();
      await expect(form.fromPrincipal).toBeChecked();
      await expect(
        page.getByText('Minimum percentage of principle required as down payment', { exact: true }),
      ).toBeVisible();
      await form.fromTotalLoan.check();
      await expect(form.fromTotalLoan).toBeChecked();
      await expect(form.fromPrincipal).not.toBeChecked();
      break;

    default:
      throw new Error(`No scenario implementation exists for ${caseId}.`);
  }
}
