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

/** Patches account fields, re-encrypts the list, uploads backup, and syncs locally. */
export async function accountUpdate(accountNumber, accountId, patch) {
  try {
    const updateId = String(accountId);
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
    const account = decrypted.find((entry) => String(entry.id) === updateId);
    if (!account) {
      console.warn(
        `[account-actions] accountUpdate: account ${updateId} not found in backup`,
      );
    } else {
      if (patch.name != null) {
        account.name = patch.name;
      }
      if (patch.email !== undefined) {
        account.email = patch.email;
      }
      if (patch.username !== undefined) {
        account.username = patch.username;
      }
      if (patch.counter != null) {
        account.counter = patch.counter;
      }
    }
    const encryptedPayload = accountEncrypt(decrypted, accountNumber);
    await accountBackup(accountNumber, encryptedPayload);
    await accountsEncryptedClear();
    await accountsMergedClear();
    await accountsPendingClear();
    return accountSync(accountNumber);
  } catch (error) {
    console.warn("[account-actions] accountUpdate failed", error);
    throw error;
  }
}
