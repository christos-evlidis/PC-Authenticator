import * as api from "../account-api.js";
import * as crypto from "../account-crypto.js";
import * as storage from "../account-storage.js";

/** Fetches cloud backup and caches the encrypted blob locally when applicable. */
export async function accountRestore(accountNumber) {
  let result = { accounts: null };
  try {
    result = await api.accountApiRestore(accountNumber);
  } catch (error) {
    console.warn("[account-backup] accountRestore fetch failed", error);
  }
  try {
    if (
      typeof result.accounts === "string" &&
      crypto.accountEncryptedIs(result.accounts)
    ) {
      await storage.accountsEncryptedSet(result.accounts);
    } else {
      await storage.accountsEncryptedClear();
      await storage.accountsMergedClear();
    }
  } catch (error) {
    console.warn("[account-backup] accountRestore cache update failed", error);
    throw error;
  }
  return result;
}
