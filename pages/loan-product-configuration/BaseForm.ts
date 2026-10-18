import { expect, Locator, Page } from '@playwright/test';

/**
 * Shared form helpers. Labels and texts come from the 16-Oct-2026 screen recording of staging.
 * The form renders labels as text followed by a red "*" for required fields; label-to-input association
 * (for/id) is not confirmed, so helpers first try getByLabel() and fall back to "the first control after the label text".
 * VERIFY on first run and replace with getByTestId() if the application exposes test ids.
 */
export class BaseForm {
  constructor(readonly page: Page) {}

  private labelText(label: string): Locator {
    const esc = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return this.page.getByText(new RegExp(`^\\s*${esc}\\s*\\*?\\s*$`, 'i')).first();
  }

  /** Text input / textarea associated with a visible label. */
  input(label: string): Locator {
    // getByLabel also matches aria-labelledby containers, e.g. the Financial Rules "Interest Rate" tab panel.
    const byLabel = this.page.getByLabel(label, { exact: false }).and(this.page.locator('input, textarea'));
    const byFollowing = this.labelText(label).locator('xpath=following::*[self::input or self::textarea][1]');
    return byLabel.or(byFollowing).first();
  }

  /** Dropdown trigger (native select or custom combobox) that follows a label. */
  dropdown(label: string): Locator {
    return this.labelText(label)
      .locator('xpath=following::*[self::select or @role="combobox" or self::button][1]')
      .first();
  }

  async fill(label: string, value: string | number): Promise<void> {
    const field = this.input(label);
    await field.click();
    await field.fill('');
    await field.fill(String(value));
    await field.blur();
  }

  async clear(label: string): Promise<void> {
    const field = this.input(label);
    // Formatted amount inputs restore their value after fill(''), so delete the text like a user would.
    await field.click();
    await field.press('ControlOrMeta+A');
    await field.press('Backspace');
    await field.blur();
  }

  async select(label: string, option: string): Promise<void> {
    const trigger = this.dropdown(label);
    const tag = await trigger.evaluate((el) => el.tagName.toLowerCase());
    if (tag === 'select') {
      await trigger.selectOption({ label: option });
      return;
    }
    await trigger.click();
    await this.page.getByRole('option', { name: option, exact: true }).or(this.page.getByText(option, { exact: true })).last().click();
  }

  /** Returns the option texts of a dropdown (opens and closes it). */
  async options(label: string): Promise<string[]> {
    const trigger = this.dropdown(label);
    const tag = await trigger.evaluate((el) => el.tagName.toLowerCase());
    if (tag === 'select') {
      return (await trigger.locator('option').allInnerTexts()).map((t) => t.trim()).filter(Boolean);
    }
    await trigger.click();
    // Options load asynchronously; the list shows "No ... available" until the reference data arrives.
    await expect(this.page.getByRole('option').first()).not.toHaveText(/^\s*(No .* available|Loading.*)\s*$/i);
    const texts = (await this.page.getByRole('option').allInnerTexts()).map((t) => t.trim()).filter(Boolean);
    await this.page.keyboard.press('Escape');
    return texts;
  }

  /** Toggle switch on the same row/card as a section title (e.g. "Down Payment Options", "Late Fee"). */
  toggle(sectionTitle: string): Locator {
    const card = this.page
      .locator('div')
      .filter({ has: this.page.getByText(sectionTitle, { exact: true }) })
      .filter({ has: this.page.locator('[role="switch"], button[aria-checked], input[type="checkbox"]') })
      .last();
    return card.locator('[role="switch"], button[aria-checked], input[type="checkbox"]').first();
  }

  async setToggle(sectionTitle: string, on: boolean): Promise<void> {
    const sw = this.toggle(sectionTitle);
    const state = await this.isOn(sw);
    if (state !== on) await sw.click();
    await expect.poll(() => this.isOn(sw)).toBe(on);
  }

  async isOn(sw: Locator): Promise<boolean> {
    const aria = await sw.getAttribute('aria-checked');
    if (aria !== null) return aria === 'true';
    return sw.isChecked();
  }

  radio(label: string): Locator {
    return this.page.getByRole('radio', { name: label }).or(this.page.getByLabel(label, { exact: true })).first();
  }

  async choose(label: string): Promise<void> {
    await this.radio(label).check({ force: true });
  }

  /** Inline validation text, e.g. "At least one disbursement method is required". */
  message(text: string | RegExp): Locator {
    return this.page.getByText(text).first();
  }

  requiredMarker(label: string): Locator {
    return this.labelText(label).locator('xpath=(self::*|following::*)[normalize-space(.)="*"][1]');
  }
}
