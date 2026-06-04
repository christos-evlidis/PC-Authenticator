import { dataRemoteRestore } from "../data-api.js";
import { dataEncryptedIs } from "../data-crypto.js";
import { dataEncryptedClear } from "../data-storage.js";
import { dataEncryptedSet } from "../data-storage.js";
import { dataMergedClear } from "../data-storage.js";

/** Fetches cloud backup and caches the encrypted blob locally when applicable. */
export async function dataRestore(accountNumber) {
  let result = { accounts: null };
  try {
    result = await dataRemoteRestore(accountNumber);
  } catch (error) {
    console.warn("[data-backup] dataRestore fetch failed", error);
  }
  try {
    if (
      typeof result.accounts === "string" &&
      dataEncryptedIs(result.accounts)
    ) {
      await dataEncryptedSet(result.accounts);
    } else {
      await dataEncryptedClear();
      await dataMergedClear();
    }
  } catch (error) {
    console.warn("[data-backup] dataRestore cache update failed", error);
    throw error;
  }
  return result;
}
