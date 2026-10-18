import { Locator } from '@playwright/test';

/**
 * Puts text into a field the way a paste does. Numeric inputs reject fill('abc'),
 * so fall back to insertText (the 16-Oct video used pasted text to trigger the age validation).
 */
export async function pasteText(field: Locator, text: string): Promise<void> {
  await field.click();
  try {
    await field.fill(text);
  } catch {
    await field.press('ControlOrMeta+A');
    await field.page().keyboard.insertText(text);
  }
  await field.blur();
}
