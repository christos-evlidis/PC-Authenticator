import { dataDecrypt } from "../data-crypto.js";
import { dataEncryptedIs } from "../data-crypto.js";
import { dataListSanitize } from "../records/data-sanitize.js";
import { dataEncryptedGet } from "../data-storage.js";
import { dataFinalSet } from "../data-storage.js";
import { dataMergedSet } from "../data-storage.js";
import { dataPendingGet } from "../data-storage.js";

/** Merges pending accounts into a base list and persists merged + active lists. */
export async function dataMerge(accountNumber, options = {}) {
  try {
    let rawBase = options.baseList;
    if (rawBase == null) {
      rawBase = [];
      const encryptedBlob = await dataEncryptedGet();
      if (dataEncryptedIs(encryptedBlob)) {
        try {
          rawBase = dataListSanitize(
            dataDecrypt(encryptedBlob, accountNumber),
          );
        } catch (error) {
          console.warn(
            "[data-backup] decrypt cached backup failed, using []",
            error,
          );
        }
      }
    }
    const base = dataListSanitize(rawBase);
    const incoming = dataListSanitize(
      await dataPendingGet(),
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
      await dataMergedSet(merged);
      await dataFinalSet(merged);
    } catch (error) {
      console.warn("[data-backup] dataMerge persist failed", error);
      throw error;
    }
    return merged;
  } catch (error) {
    console.warn("[data-backup] dataMerge failed", error);
    throw error;
  }
}
