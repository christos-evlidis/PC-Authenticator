import { accountBackup } from "../account-api.js";
import { accountRestore } from "../account-backup/account-restore.js";
import { accountSync } from "../account-backup/account-sync.js";
import { accountDecrypt } from "../account-crypto.js";
import { accountEncryptedIs } from "../account-crypto.js";
import { accountEncrypt } from "../account-crypto.js";
import { accountListSanitize } from "../account-records/account-sanitize.js";
import { accountsEncryptedClear } from "../account-storage.js";
import { accountsEncryptedGet } from "../account-storage.js";
import { accountsMergedClear } from "../account-storage.js";
import { accountsPendingClear } from "../account-storage.js";

/** Deletes an account from backup and refreshes the local active list. */
export async function accountDelete(accountNumber, accountId) {
  try {
    const deleteId = String(accountId);
    await accountRestore(accountNumber);
    let decrypted = [];
    const encryptedBlob = await accountsEncryptedGet();
    if (accountEncryptedIs(encryptedBlob)) {
      try {
        decrypted = accountListSanitize(
          accountDecrypt(encryptedBlob, accountNumber),
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
    const encryptedPayload = accountEncrypt(filtered, accountNumber);
    await accountBackup(accountNumber, encryptedPayload);
    await accountsEncryptedClear();
    await accountsMergedClear();
    await accountsPendingClear();
    return accountSync(accountNumber);
  } catch (error) {
    console.warn("[account-actions] accountDelete failed", error);
    throw error;
  }
}
