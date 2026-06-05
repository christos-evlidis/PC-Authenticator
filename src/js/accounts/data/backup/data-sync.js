import { dataCryptoDecrypt } from "../crypto/data-crypto-decrypt.js";
import { dataCryptoIsEncrypted } from "../crypto/data-crypto-type.js";
import { dataSanitizeList } from "../records/data-sanitize.js";
import { dataStorageClearEncrypted } from "../storage/data-storage-encrypted.js";
import { dataStorageGetEncrypted } from "../storage/data-storage-encrypted.js";
import { dataStorageGetFinal } from "../storage/data-storage-final.js";
import { dataStorageSetFinal } from "../storage/data-storage-final.js";
import { dataStorageClearMerged } from "../storage/data-storage-merged.js";
import { dataStorageClearPending } from "../storage/data-storage-pending.js";
import { dataStorageGetPending } from "../storage/data-storage-pending.js";
import { dataMerge } from "./data-merge.js";
import { dataRestore } from "./data-restore.js";

/** Restores from cloud, merges pending adds, writes the active list, and clears temp keys. */
export async function dataSync(accountNumber) {
  try {
    const result = await dataRestore(accountNumber);
    if (result.accounts == null) {
      const existing = dataSanitizeList(
        await dataStorageGetFinal(),
      );
      await dataStorageClearEncrypted();
      await dataStorageClearMerged();
      await dataStorageClearPending();
      if (existing.length) {
        console.debug(
          `[data-backup] dataSync: empty restore; keeping ${existing.length} local account(s)`,
        );
        return existing;
      }
      await dataStorageSetFinal([]);
      return [];
    }
    let plainAccounts = [];
    if (
      typeof result.accounts === "string" &&
      dataCryptoIsEncrypted(result.accounts)
    ) {
      const encryptedBlob = await dataStorageGetEncrypted();
      if (dataCryptoIsEncrypted(encryptedBlob)) {
        try {
          plainAccounts = dataSanitizeList(
            dataCryptoDecrypt(encryptedBlob, accountNumber),
          );
        } catch (error) {
          console.warn(
            "[data-backup] decrypt cached backup failed, using []",
            error,
          );
        }
      }
    } else {
      plainAccounts = dataSanitizeList(result.accounts);
    }
    const pending = dataSanitizeList(
      await dataStorageGetPending(),
    );
    if (pending.length) {
      plainAccounts = await dataMerge(accountNumber, {
        baseList: plainAccounts,
      });
    } else {
      await dataStorageSetFinal(plainAccounts);
    }
    try {
      await dataStorageClearEncrypted();
      await dataStorageClearMerged();
      await dataStorageClearPending();
    } catch (error) {
      console.warn(
        "[data-backup] dataSync clear temp keys failed",
        error,
      );
      throw error;
    }
    return plainAccounts;
  } catch (error) {
    console.warn("[data-backup] dataSync failed", error);
    throw error;
  }
}
