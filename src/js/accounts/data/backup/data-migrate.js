import { dataApiRestore } from "../data-api.js";
import { dataCryptoDecrypt } from "../crypto/data-crypto-decrypt.js";
import { dataCryptoIsEncrypted } from "../crypto/data-crypto-type.js";
import { dataMergeLists } from "../records/data-merge-lists.js";
import { dataSanitizeList } from "../records/data-sanitize.js";
import { dataStorageClearEncrypted } from "../storage/data-storage-encrypted.js";
import { dataStorageSetEncrypted } from "../storage/data-storage-encrypted.js";
import { dataStorageClearLegacy } from "../storage/data-storage-migrate.js";
import { dataStorageMigrateLegacy } from "../storage/data-storage-migrate.js";
import { dataStorageSetFinal } from "../storage/data-storage-final.js";
import { dataStorageClearMerged } from "../storage/data-storage-merged.js";
import { dataStorageSetMerged } from "../storage/data-storage-merged.js";
import { dataBackupUpload } from "./data-backup.js";

/** Migrates legacy local keys, merges cloud backup, uploads, and re-syncs. */
export async function dataBackupMigrate(accountNumber) {
  try {
    let merged = await dataStorageMigrateLegacy(accountNumber);

    let restoreResult = { ok: false, accounts: null };
    try {
      restoreResult = await dataApiRestore(accountNumber);
    } catch (error) {
      console.warn("[data-backup] dataBackupMigrate cloud restore failed", error);
    }

    if (restoreResult.ok && restoreResult.accounts != null) {
      let cloudPlain = [];
      if (
        typeof restoreResult.accounts === "string" &&
        dataCryptoIsEncrypted(restoreResult.accounts)
      ) {
        await dataStorageSetEncrypted(restoreResult.accounts);
        try {
          cloudPlain = dataSanitizeList(
            dataCryptoDecrypt(restoreResult.accounts, accountNumber),
          );
        } catch (error) {
          console.warn("[data-backup] dataBackupMigrate decrypt failed", error);
        }
        await dataStorageClearEncrypted();
      } else {
        cloudPlain = dataSanitizeList(restoreResult.accounts);
      }

      merged = dataMergeLists(merged, cloudPlain);
      await dataStorageSetFinal(merged);
    }

    await dataStorageSetMerged(merged);
    try {
      await dataBackupUpload(accountNumber);
    } catch (error) {
      console.warn("[data-backup] dataBackupMigrate upload failed", error);
      await dataStorageClearMerged();
      return merged;
    }
    await dataStorageClearMerged();

    await dataStorageClearLegacy();
    const { dataBackupSync } = await import("./data-sync.js");
    return dataBackupSync(accountNumber, { skipMigration: true });
  } catch (error) {
    console.warn("[data-backup] dataBackupMigrate failed", error);
    throw error;
  }
}
