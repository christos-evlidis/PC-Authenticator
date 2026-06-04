import { accountDecrypt } from "../account-crypto.js";
import { accountEncryptedIs } from "../account-crypto.js";
import { accountListSanitize } from "../account-records/account-sanitize.js";
import { accountsEncryptedClear } from "../account-storage.js";
import { accountsEncryptedGet } from "../account-storage.js";
import { accountsFinalGet } from "../account-storage.js";
import { accountsFinalSet } from "../account-storage.js";
import { accountsMergedClear } from "../account-storage.js";
import { accountsPendingClear } from "../account-storage.js";
import { accountsPendingGet } from "../account-storage.js";
import { accountMerge } from "./account-merge.js";
import { accountRestore } from "./account-restore.js";

/** Restores from cloud, merges pending adds, writes the active list, and clears temp keys. */
export async function accountSync(accountNumber) {
  try {
    const result = await accountRestore(accountNumber);
    if (result.accounts == null) {
      const existing = accountListSanitize(
        await accountsFinalGet(),
      );
      await accountsEncryptedClear();
      await accountsMergedClear();
      await accountsPendingClear();
      if (existing.length) {
        console.debug(
          `[account-backup] accountSync: empty restore; keeping ${existing.length} local account(s)`,
        );
        return existing;
      }
      await accountsFinalSet([]);
      return [];
    }
    let plainAccounts = [];
    if (
      typeof result.accounts === "string" &&
      accountEncryptedIs(result.accounts)
    ) {
      const encryptedBlob = await accountsEncryptedGet();
      if (accountEncryptedIs(encryptedBlob)) {
        try {
          plainAccounts = accountListSanitize(
            accountDecrypt(encryptedBlob, accountNumber),
          );
        } catch (error) {
          console.warn(
            "[account-backup] decrypt cached backup failed, using []",
            error,
          );
        }
      }
    } else {
      plainAccounts = accountListSanitize(result.accounts);
    }
    const pending = accountListSanitize(
      await accountsPendingGet(),
    );
    if (pending.length) {
      plainAccounts = await accountMerge(accountNumber, {
        baseList: plainAccounts,
      });
    } else {
      await accountsFinalSet(plainAccounts);
    }
    try {
      await accountsEncryptedClear();
      await accountsMergedClear();
      await accountsPendingClear();
    } catch (error) {
      console.warn(
        "[account-backup] accountSync clear temp keys failed",
        error,
      );
      throw error;
    }
    return plainAccounts;
  } catch (error) {
    console.warn("[account-backup] accountSync failed", error);
    throw error;
  }
}
