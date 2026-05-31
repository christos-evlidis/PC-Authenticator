import * as api from "../account-api.js";
import { accountRestore } from "../account-backup/account-restore.js";
import { accountSync } from "../account-backup/account-sync.js";
import * as crypto from "../account-crypto.js";
import { accountListSanitize } from "../account-records/account-sanitize.js";
import * as storage from "../account-storage.js";

/** Deletes an account from backup and refreshes the local active list. */
export async function accountDelete(accountNumber, accountId) {
  try {
    const deleteId = String(accountId);
    await accountRestore(accountNumber);
    let decrypted = [];
    const encryptedBlob = await storage.accountsEncryptedGet();
    if (crypto.accountEncryptedIs(encryptedBlob)) {
      try {
        decrypted = accountListSanitize(
          crypto.accountDecrypt(encryptedBlob, accountNumber),
        );
      } catch (error) {
        console.warn(
          "[account-actions] decrypt cached backup failed, using []",
          error,
        );
      }
    }
    const filtered = decrypted.filter(
      (account) => String(account.id) !== deleteId,
    );
    const encryptedPayload = crypto.accountEncrypt(filtered, accountNumber);
    await api.accountApiBackup(accountNumber, encryptedPayload);
    await storage.accountsEncryptedClear();
    await storage.accountsMergedClear();
    await storage.accountsPendingClear();
    return accountSync(accountNumber);
  } catch (error) {
    console.warn("[account-actions] accountDelete failed", error);
    throw error;
  }
}
