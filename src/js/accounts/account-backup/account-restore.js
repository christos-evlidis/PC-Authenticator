import { accountRestore as accountRestoreRemote } from "../account-api.js";
import { accountEncryptedIs } from "../account-crypto.js";
import { accountsEncryptedClear } from "../account-storage.js";
import { accountsEncryptedSet } from "../account-storage.js";
import { accountsMergedClear } from "../account-storage.js";

/** Fetches cloud backup and caches the encrypted blob locally when applicable. */
export async function accountRestore(accountNumber) {
  let result = { accounts: null };
  try {
    result = await accountRestoreRemote(accountNumber);
  } catch (error) {
    console.warn("[account-backup] accountRestore fetch failed", error);
  }
  try {
    if (
      typeof result.accounts === "string" &&
      accountEncryptedIs(result.accounts)
    ) {
      await accountsEncryptedSet(result.accounts);
    } else {
      await accountsEncryptedClear();
      await accountsMergedClear();
    }
  } catch (error) {
    console.warn("[account-backup] accountRestore cache update failed", error);
    throw error;
  }
  return result;
}
