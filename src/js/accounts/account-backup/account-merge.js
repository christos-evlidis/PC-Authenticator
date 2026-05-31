import * as crypto from "../account-crypto.js";
import { accountListSanitize } from "../account-records/account-sanitize.js";
import * as storage from "../account-storage.js";

/** Merges pending accounts into a base list and persists merged + active lists. */
export async function accountMerge(accountNumber, options = {}) {
  try {
    let rawBase = options.baseList;
    if (rawBase == null) {
      rawBase = [];
      const encryptedBlob = await storage.accountsEncryptedGet();
      if (crypto.accountEncryptedIs(encryptedBlob)) {
        try {
          rawBase = accountListSanitize(
            crypto.accountDecrypt(encryptedBlob, accountNumber),
          );
        } catch (error) {
          console.warn(
            "[account-backup] decrypt cached backup failed, using []",
            error,
          );
        }
      }
    }
    const base = accountListSanitize(rawBase);
    const incoming = accountListSanitize(
      await storage.accountsPendingGet(),
    );
    const indexById = new Map();
    base.forEach((account, index) => {
      indexById.set(String(account.id), index);
    });
    const toPrepend = [];
    for (const account of incoming) {
      const id = String(account.id);
      if (indexById.has(id)) {
        base[indexById.get(id)] = account;
      } else {
        toPrepend.push(account);
      }
    }
    const merged = [...toPrepend.reverse(), ...base];
    try {
      await storage.accountsMergedSet(merged);
      await storage.accountsFinalSet(merged);
    } catch (error) {
      console.warn("[account-backup] accountMerge persist failed", error);
      throw error;
    }
    return merged;
  } catch (error) {
    console.warn("[account-backup] accountMerge failed", error);
    throw error;
  }
}
