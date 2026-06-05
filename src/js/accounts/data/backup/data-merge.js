import { dataCryptoDecrypt } from "../crypto/data-crypto-decrypt.js";
import { dataCryptoIsEncrypted } from "../crypto/data-crypto-type.js";
import { dataSanitizeList } from "../records/data-sanitize.js";
import { dataStorageGetEncrypted } from "../storage/data-storage-encrypted.js";
import { dataStorageSetFinal } from "../storage/data-storage-final.js";
import { dataStorageSetMerged } from "../storage/data-storage-merged.js";
import { dataStorageGetPending } from "../storage/data-storage-pending.js";

/** Merges pending accounts into a base list and persists merged + active lists. */
export async function dataMerge(accountNumber, options = {}) {
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
      console.warn("[data-backup] dataMerge persist failed", error);
      throw error;
    }
    return merged;
  } catch (error) {
    console.warn("[data-backup] dataMerge failed", error);
    throw error;
  }
}
