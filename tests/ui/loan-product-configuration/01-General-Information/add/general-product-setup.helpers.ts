import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, test, type Page, type TestInfo } from '@playwright/test';
import { appUrl, baseUrl } from '../../../../../helpers/common/env';

interface SourceCase {
  id: string;
  scenarioId: number;
  title: string;
  expectedResults: string;
  status: 'Automated' | 'Partially Automated' | 'Blocked';
  notes: string;
}

const sourceCases = JSON.parse(
  readFileSync(resolve(__dirname, 'source-cases.json'), 'utf8'),
) as SourceCase[];
const caseById = new Map(sourceCases.map((sourceCase) => [sourceCase.id, sourceCase]));

const productNamePlaceholder = 'e.g., Micro Business Loan, Group Lending Product';
const productIdPlaceholder = 'e.g., MF-001, GL-001';
const productDescriptionPlaceholder = 'Enter detailed product description';
const productTypes = [
  'Business Loan',
  'Car Loan',
  'Education Loan',
  'Equipment Loan',
  'Home Loan',
  'Personal',
];
const currencies = ['EGP - Egyptian Pound', 'USD - US Dollar', 'EUR - Euro'];
const statuses = ['Active', 'Inactive'];

// An open select marks the rest of the page aria-hidden, so role queries cannot find the trigger again.
function combo(page: Page, index: number) {
  return page.locator('[data-slot="select-trigger"]').nth(index);
}

// Required labels render a separate "*" marker, so exact text never matches.
function fieldLabel(page: Page, text: string) {
  const escaped = text.replace(/[.*+?^$()|[\]\\{}]/g, '\\$&');
  return page.getByText(new RegExp(`^${escaped}\\s*\\*?$`));
}

async function selectOption(page: Page, comboIndex: number, optionName: string) {
  await combo(page, comboIndex).click();
  await page.getByRole('option', { name: optionName, exact: true }).click();
  await expect(combo(page, comboIndex)).toContainText(optionName);
}

async function fillOtherRequiredFields(page: Page, omit: 'name' | 'id') {
  if (omit !== 'name') {
    await page.getByPlaceholder(productNamePlaceholder).fill('Micro Business Loan');
  }
  if (omit !== 'id') {
    await page.getByPlaceholder(productIdPlaceholder).fill('MF-001');
  }

  await selectOption(page, 0, 'Business Loan');
  await selectOption(page, 1, 'EGP - Egyptian Pound');
}

async function expectFieldValidation(page: Page, field: ReturnType<Page['getByPlaceholder']>) {
  const invalid = (await field.getAttribute('aria-invalid')) === 'true';
  const alertText = (await page.getByRole('alert').allTextContents()).some((text) => text.trim().length > 0);
  const cannotContinue = await page.getByRole('button', { name: 'Save & Continue' }).isDisabled();
  expect(invalid || alertText || cannotContinue).toBe(true);
}

async function pasteText(page: Page, testInfo: TestInfo, field: ReturnType<Page['getByPlaceholder']>, value: string) {
  test.skip(
    testInfo.project.name !== 'chromium',
    'Clipboard permission and keyboard-paste behavior are exercised in Chromium only.',
  );

  await page.context().grantPermissions(['clipboard-read', 'clipboard-write'], {
    origin: new URL(baseUrl()).origin,
  });
  // Writing the clipboard is required to exercise the real Ctrl+V interaction.
  await page.evaluate(async (text) => navigator.clipboard.writeText(text), value);
  await field.focus();
  await page.keyboard.press(process.platform === 'darwin' ? 'Meta+V' : 'Control+V');
}

export async function runGeneralProductSetupCase(
  page: Page,
  testInfo: TestInfo,
  caseId: string,
) {
  const sourceCase = caseById.get(caseId);
  if (!sourceCase) {
    throw new Error(`No AIO source-case metadata was found for ${caseId}.`);
  }

  // Base URL and session come from playwright.config.ts and fixtures/global-setup.ts.

  if ([140, 151].includes(sourceCase.scenarioId)) {
    test.skip(
      true,
      'Blocked: this duplicate check needs an existing product fixture and a verified cleanup strategy.',
    );
  }
  if ([159, 173, 177].includes(sourceCase.scenarioId)) {
    test.skip(
      true,
      'Blocked: AIO marks refresh persistence as conditional, and no saved-draft setup/cleanup contract is documented.',
    );
  }

  await page.goto(appUrl('/loan-product-config/add'));
  await expect(page.getByRole('heading', { name: 'General Information', exact: true })).toBeVisible();

  const productName = page.getByPlaceholder(productNamePlaceholder);
  const productId = page.getByPlaceholder(productIdPlaceholder);
  const productDescription = page.getByPlaceholder(productDescriptionPlaceholder);
  const nextButton = page.getByRole('button', { name: 'Save & Continue' });

  switch (sourceCase.scenarioId) {
    case 131:
      for (const name of ['Micro Business Loan', 'Group Lending Product']) {
        await productName.fill(name);
        await expect(productName).toHaveValue(name);
        await expect(productName).not.toHaveAttribute('aria-invalid', 'true');
      }
      break;
    case 132:
      await expect(productName).toHaveAttribute('placeholder', productNamePlaceholder);
      break;
    case 133: {
      const requiredMarker = page.getByText('*', { exact: true }).nth(0);
      await expect(requiredMarker).toBeVisible();
      await expect(requiredMarker).toHaveCSS('color', 'oklch(0.637 0.237 25.331)');
      if (caseId === 'FS-TC-299') {
        await fillOtherRequiredFields(page, 'name');
        await expect(nextButton).toBeDisabled();
      }
      break;
    }
    case 134:
      await fieldLabel(page, 'Product Name').click();
      await expect(productName).toBeFocused();
      break;
    case 135:
      await fillOtherRequiredFields(page, 'name');
      await productName.fill('N'.repeat(201));
      await productName.press('Tab');
      await expectFieldValidation(page, productName);
      break;
    case 136:
      await fillOtherRequiredFields(page, 'name');
      await expect(productName).toHaveValue('');
      await expect(nextButton).toBeDisabled();
      break;
    case 137:
      await fillOtherRequiredFields(page, 'name');
      await productName.fill('Loan @😄');
      await productName.press('Tab');
      await expectFieldValidation(page, productName);
      break;
    case 138:
      await fillOtherRequiredFields(page, 'name');
      await productName.fill('   ');
      await productId.click();
      await expect(nextButton).toBeDisabled();
      break;
    case 139: {
      const pastedName = 'Micro Business Loan';
      await pasteText(page, testInfo, productName, pastedName);
      await expect(productName).toHaveValue(pastedName);
      await expect(productName).not.toHaveAttribute('aria-invalid', 'true');
      break;
    }
    case 140:
      throw new Error('Duplicate Product Name cases must be skipped before reaching this branch.');
    case 141: {
      await page.setViewportSize({ width: 375, height: 812 });
      for (const field of [productName, productId, productDescription]) {
        const box = await field.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(375);
      }
      await productName.fill('Micro Business Loan');
      await expect(productName).toHaveValue('Micro Business Loan');
      const hasHorizontalOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      );
      expect(hasHorizontalOverflow).toBe(false);
      break;
    }
    case 142:
      for (const code of ['MF001', 'GL001']) {
        await productId.fill(code);
        await expect(productId).toHaveValue(code);
        await expect(productId).not.toHaveAttribute('aria-invalid', 'true');
      }
      break;
    case 143:
      // PO decision 16-Oct-2026: the correct placeholder is "e.g., MF-001, GL-001" (AIO text said MF001, GL001).
      await expect(page.getByRole('textbox', { name: 'Product Code / ID' })).toHaveAttribute(
        'placeholder',
        productIdPlaceholder,
      );
      break;
    case 144: {
      const requiredMarker = page.getByText('*', { exact: true }).nth(1);
      await expect(requiredMarker).toBeVisible();
      await expect(requiredMarker).toHaveCSS('color', 'oklch(0.637 0.237 25.331)');
      break;
    }
    case 145:
      await fieldLabel(page, 'Product Code / ID').click();
      await expect(productId).toBeFocused();
      break;
    case 146:
      for (const code of ['MF-001', 'GL-001']) {
        await productId.fill(code);
        await expect(productId).toHaveValue(code);
        await expect(productId).not.toHaveAttribute('aria-invalid', 'true');
      }
      break;
    case 147:
    case 152:
      await fillOtherRequiredFields(page, 'id');
      await expect(productId).toHaveValue('');
      await expect(nextButton).toBeDisabled();
      break;
    case 148:
      await fillOtherRequiredFields(page, 'id');
      await productId.fill('INVALID');
      await productId.press('Tab');
      await expectFieldValidation(page, productId);
      break;
    case 149:
      await productId.fill('X'.repeat(21));
      await expect(productId).toHaveValue('X'.repeat(20));
      break;
    case 150:
      await fillOtherRequiredFields(page, 'id');
      await productId.fill('MF@001#');
      await productId.press('Tab');
      await expectFieldValidation(page, productId);
      break;
    case 151:
      throw new Error('Duplicate Product ID cases must be skipped before reaching this branch.');
    case 153:
      await productId.pressSequentially('MF-001quick-input');
      await productId.press(process.platform === 'darwin' ? 'Meta+A' : 'Control+A');
      await productId.press('Backspace');
      await expect(productId).toHaveValue('');
      await productId.fill('GL-001');
      await expect(productId).toHaveValue('GL-001');
      break;
    case 154:
      await expect(fieldLabel(page, 'Product Type')).toBeVisible();
      break;
    case 155:
      await expect(combo(page, 0)).toBeEnabled();
      await combo(page, 0).click();
      await expect(page.getByRole('listbox')).toBeVisible();
      break;
    case 156:
    case 158:
      await combo(page, 0).click();
      await expect(page.getByRole('listbox')).toBeVisible();
      await expect(page.getByRole('option')).toHaveText(productTypes);
      break;
    case 157:
      // PO decision 16-Oct-2026: Product Type has no default and shows its placeholder (AIO text said Business Loan).
      await expect(combo(page, 0)).toHaveText('Select a product type');
      await expect(combo(page, 0)).toHaveAttribute('data-placeholder', '');
      break;
    case 165:
      await selectOption(page, 1, 'EGP - Egyptian Pound');
      break;
    case 166:
      await combo(page, 1).click();
      await expect(page.getByRole('listbox')).toBeVisible();
      await expect(page.getByRole('option')).toHaveText(currencies);
      break;
    case 167:
      await selectOption(page, 1, 'EGP - Egyptian Pound');
      await expect(combo(page, 1)).toContainText('EGP - Egyptian Pound');
      break;
    case 168:
      await combo(page, 1).click();
      await expect(page.getByRole('listbox')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.getByRole('listbox')).toBeHidden();
      await combo(page, 1).click();
      await expect(page.getByRole('listbox')).toBeVisible();
      await fieldLabel(page, 'Product Name').click({ force: true });
      await expect(page.getByRole('listbox')).toBeHidden();
      break;
    case 169:
      await combo(page, 1).click();
      await expect(page.getByRole('listbox')).toBeVisible();
      await combo(page, 1).click({ force: true });
      await expect(page.getByRole('listbox')).toBeHidden();
      break;
    case 170:
      await combo(page, 1).click();
      for (const currency of currencies) {
        const option = page.getByRole('option', { name: currency, exact: true });
        await option.scrollIntoViewIfNeeded();
        await expect(option).toBeVisible();
      }
      break;
    case 171:
      await expect(combo(page, 2)).toContainText('Active');
      break;
    case 172:
      await combo(page, 2).click();
      await expect(page.getByRole('listbox')).toBeVisible();
      await expect(page.getByRole('option')).toHaveText(statuses);
      break;
    case 174:
      await combo(page, 2).click();
      await expect(page.getByRole('listbox')).toBeVisible();
      await combo(page, 2).click({ force: true });
      await expect(page.getByRole('listbox')).toBeHidden();
      break;
    case 175:
      await productDescription.fill('Loan product for small business borrowers.');
      await expect(productDescription).toHaveValue('Loan product for small business borrowers.');
      break;
    case 176:
      await expect(productDescription).toHaveAttribute(
        'placeholder',
        productDescriptionPlaceholder,
      );
      break;
    case 178: {
      await productDescription.fill('short');
      const initialBox = await productDescription.boundingBox();
      await productDescription.fill('D'.repeat(800));
      const expandedBox = await productDescription.boundingBox();
      expect(initialBox).not.toBeNull();
      expect(expandedBox).not.toBeNull();
      expect(expandedBox!.height).toBeGreaterThan(initialBox!.height);
      await expect(productDescription).toHaveValue('D'.repeat(800));
      break;
    }
    case 179:
      await productDescription.fill('D'.repeat(1001));
      await expect(productDescription).toHaveValue('D'.repeat(1000));
      await expect(page.getByText('1000/1000 characters', { exact: true })).toBeVisible();
      break;
    case 180: {
      const pastedDescription = 'P'.repeat(1200);
      await pasteText(page, testInfo, productDescription, pastedDescription);
      await expect(productDescription).toHaveValue('P'.repeat(1000));
      await expect(page.getByText('1000/1000 characters', { exact: true })).toBeVisible();
      break;
    }
    case 181: {
      const multilingualText = 'Loan description — قرض صغير 😄 #1';
      await productDescription.fill(multilingualText);
      await expect(productDescription).toHaveValue(multilingualText);
      break;
    }
    default:
      throw new Error(`No automation routine is defined for ${caseId}.`);
  }
}
