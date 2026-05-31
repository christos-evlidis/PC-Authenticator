import { accountBackup } from "../account-backup/account-backup.js";
import { accountMerge } from "../account-backup/account-merge.js";
import { accountRestore } from "../account-backup/account-restore.js";
import { accountSync } from "../account-backup/account-sync.js";
import { accountManualParse } from "../account-otp/account-parse.js";
import { accountQrParse } from "../account-otp/account-parse.js";
import { accountFinalBuild } from "../account-records/account-build.js";
import { accountsPendingAppend } from "../account-storage.js";
import * as storage from "../account-storage.js";

/** Adds an account from manual setup, merges with cloud backup, and syncs. */
export async function accountManualAdd(accountNumber, formData) {
  try {
    const parsed = accountManualParse(formData);
    const account = accountFinalBuild(parsed);
    await accountsPendingAppend(account);
    await accountRestore(accountNumber);
    await accountMerge(accountNumber);
    await storage.accountsEncryptedClear();
    await storage.accountsPendingClear();
    await accountBackup(accountNumber);
    await storage.accountsMergedClear();
    await accountSync(accountNumber);
    return account;
  } catch (error) {
    console.warn("[account-actions] accountManualAdd failed", error);
    throw error;
  }
}

/** Adds an account from a scanned otpauth URI, merges with cloud backup, and syncs. */
export async function accountQrAdd(accountNumber, otpauthUri) {
  try {
    const parsed = accountQrParse(otpauthUri);
    const account = accountFinalBuild(parsed);
    await accountsPendingAppend(account);
    await accountRestore(accountNumber);
    await accountMerge(accountNumber);
    await storage.accountsEncryptedClear();
    await storage.accountsPendingClear();
    await accountBackup(accountNumber);
    await storage.accountsMergedClear();
    await accountSync(accountNumber);
    return account;
  } catch (error) {
    console.warn("[account-actions] accountQrAdd failed", error);
    throw error;
  }
}
