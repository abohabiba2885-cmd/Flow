import { chromium, FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { logIn } from '../helpers/common/auth';
import { baseUrl, DEFAULT_STORAGE_STATE } from '../helpers/common/env';

/**
 * Provides the authenticated session that every project reuses through storageState.
 * - PLAYWRIGHT_STORAGE_STATE set: reuse that pre-recorded session (the step-suite workflow migrated from Flow).
 * - Otherwise: log in once with FLOWSKY_EMAIL / FLOWSKY_PASSWORD and write .auth/user.json.
 * Login steps: helpers/common/auth.ts.
 */
export default async function globalSetup(config: FullConfig): Promise<void> {
  const preRecorded = process.env.PLAYWRIGHT_STORAGE_STATE;
  if (preRecorded) {
    if (!fs.existsSync(path.resolve(preRecorded))) {
      throw new Error('PLAYWRIGHT_STORAGE_STATE points to a file that does not exist. Record it again or unset it to log in with credentials.');
    }
    return;
  }

  const baseURL = (config.projects[0].use.baseURL as string) || baseUrl();
  const email = process.env.FLOWSKY_EMAIL;
  const password = process.env.FLOWSKY_PASSWORD;
  if (!email || !password) {
    throw new Error('FLOWSKY_EMAIL and FLOWSKY_PASSWORD must be set (see .env.example), or PLAYWRIGHT_STORAGE_STATE must point to a recorded session. Tests are BLOCKED without an authenticated user.');
  }
  const authFile = DEFAULT_STORAGE_STATE;
  fs.mkdirSync(path.dirname(authFile), { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ baseURL });
  await logIn(page, email, password);
  await page.context().storageState({ path: authFile });
  await browser.close();
}
