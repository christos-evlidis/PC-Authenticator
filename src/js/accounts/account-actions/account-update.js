import * as api from "../account-api.js";
import { accountRestore } from "../account-backup/account-restore.js";
import { accountSync } from "../account-backup/account-sync.js";
import * as crypto from "../account-crypto.js";
import { accountListSanitize } from "../account-records/account-sanitize.js";
import * as storage from "../account-storage.js";

/** Patches account fields, re-encrypts the list, uploads backup, and syncs locally. */
export async function accountUpdate(accountNumber, accountId, patch) {
  try {
    const updateId = String(accountId);
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
    const encryptedPayload = crypto.accountEncrypt(decrypted, accountNumber);
    await api.accountApiBackup(accountNumber, encryptedPayload);
    await storage.accountsEncryptedClear();
    await storage.accountsMergedClear();
    await storage.accountsPendingClear();
    return accountSync(accountNumber);
  } catch (error) {
    console.warn("[account-actions] accountUpdate failed", error);
    throw error;
  }
}
