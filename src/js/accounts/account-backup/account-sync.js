import * as crypto from "../account-crypto.js";
import { accountMerge } from "./account-merge.js";
import { accountRestore } from "./account-restore.js";
import { accountListSanitize } from "../account-records/account-sanitize.js";
import * as storage from "../account-storage.js";

/** Restores from cloud, merges pending adds, writes the active list, and clears temp keys. */
export async function accountSync(accountNumber) {
  try {
    const result = await accountRestore(accountNumber);
    if (result.accounts == null) {
      const existing = accountListSanitize(
        await storage.accountsFinalGet(),
      );
      await storage.accountsEncryptedClear();
      await storage.accountsMergedClear();
      await storage.accountsPendingClear();
      if (existing.length) {
        console.debug(
          `[account-backup] accountSync: empty restore; keeping ${existing.length} local account(s)`,
        );
        return existing;
      }
      await storage.accountsFinalSet([]);
      return [];
    }
    let plainAccounts = [];
    if (
      typeof result.accounts === "string" &&
      crypto.accountEncryptedIs(result.accounts)
    ) {
      const encryptedBlob = await storage.accountsEncryptedGet();
      if (crypto.accountEncryptedIs(encryptedBlob)) {
        try {
          plainAccounts = accountListSanitize(
            crypto.accountDecrypt(encryptedBlob, accountNumber),
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
      await storage.accountsPendingGet(),
    );
    if (pending.length) {
      plainAccounts = await accountMerge(accountNumber, {
        baseList: plainAccounts,
      });
    } else {
      await storage.accountsFinalSet(plainAccounts);
    }
    try {
      await storage.accountsEncryptedClear();
      await storage.accountsMergedClear();
      await storage.accountsPendingClear();
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
