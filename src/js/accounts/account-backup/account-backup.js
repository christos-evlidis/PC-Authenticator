import { accountBackup as accountBackupRemote } from "../account-api.js";
import { accountEncrypt } from "../account-crypto.js";
import { accountListSanitize } from "../account-records/account-sanitize.js";
import { accountsMergedGet } from "../account-storage.js";

/** Encrypts the merged list and uploads it as the cloud backup. */
export async function accountBackup(accountNumber) {
  try {
    const merged = accountListSanitize(
      await accountsMergedGet(),
    );
    const encryptedPayload = accountEncrypt(merged, accountNumber);
    await accountBackupRemote(accountNumber, encryptedPayload);
  } catch (error) {
    console.warn("[account-backup] accountBackup failed", error);
    throw error;
  }
}
