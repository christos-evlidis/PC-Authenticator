import { dataCryptoDecrypt } from "../data-crypto.js";
import { dataCryptoIsEncrypted } from "../data-crypto.js";
import { dataSanitizeList } from "../records/data-sanitize.js";
import { dataStorageClearEncrypted } from "../data-storage.js";
import { dataStorageGetEncrypted } from "../data-storage.js";
import { dataStorageGetFinal } from "../data-storage.js";
import { dataStorageSetFinal } from "../data-storage.js";
import { dataStorageClearMerged } from "../data-storage.js";
import { dataStorageClearPending } from "../data-storage.js";
import { dataStorageGetPending } from "../data-storage.js";
import { dataBackupMerge } from "./data-merge.js";
import { dataBackupRestore } from "./data-restore.js";

/** Restores from cloud, merges pending adds, writes the active list, and clears temp keys. */
export async function dataBackupSync(accountNumber) {
  try {
    const result = await dataBackupRestore(accountNumber);
    if (result.accounts == null) {
      const existing = dataSanitizeList(
        await dataStorageGetFinal(),
      );
      await dataStorageClearEncrypted();
      await dataStorageClearMerged();
      await dataStorageClearPending();
      if (existing.length) {
        console.debug(
          `[data-backup] dataBackupSync: empty restore; keeping ${existing.length} local account(s)`,
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
      plainAccounts = await dataBackupMerge(accountNumber, {
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
        "[data-backup] dataBackupSync clear temp keys failed",
        error,
      );
      throw error;
    }
    return plainAccounts;
  } catch (error) {
    console.warn("[data-backup] dataBackupSync failed", error);
    throw error;
  }
}
