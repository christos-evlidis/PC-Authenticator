import { dataCryptoDecrypt } from "../data-crypto.js";
import { dataCryptoIsEncrypted } from "../data-crypto.js";
import { dataSanitizeList } from "../records/data-sanitize.js";
import { dataStorageGetEncrypted } from "../data-storage.js";
import { dataStorageSetFinal } from "../data-storage.js";
import { dataStorageSetMerged } from "../data-storage.js";
import { dataStorageGetPending } from "../data-storage.js";

/** Merges pending accounts into a base list and persists merged + active lists. */
export async function dataBackupMerge(accountNumber, options = {}) {
  try {
    let rawBase = options.baseList;
    if (rawBase == null) {
      rawBase = [];
      const encryptedBlob = await dataStorageGetEncrypted();
      if (dataCryptoIsEncrypted(encryptedBlob)) {
        try {
          rawBase = dataSanitizeList(
            dataCryptoDecrypt(encryptedBlob, accountNumber),
          );
        } catch (error) {
          console.warn(
            "[data-backup] decrypt cached backup failed, using []",
            error,
          );
        }
      }
    }
    const base = dataSanitizeList(rawBase);
    const incoming = dataSanitizeList(
      await dataStorageGetPending(),
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
      await dataStorageSetMerged(merged);
      await dataStorageSetFinal(merged);
    } catch (error) {
      console.warn("[data-backup] dataBackupMerge persist failed", error);
      throw error;
    }
    return merged;
  } catch (error) {
    console.warn("[data-backup] dataBackupMerge failed", error);
    throw error;
  }
}
