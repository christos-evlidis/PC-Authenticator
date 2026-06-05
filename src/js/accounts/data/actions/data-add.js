import { dataBackup } from "../backup/data-backup.js";
import { dataMerge } from "../backup/data-merge.js";
import { dataRestore } from "../backup/data-restore.js";
import { dataSync } from "../backup/data-sync.js";
import { dataParserManual } from "../parser/data-parser-manual.js";
import { dataParserQr } from "../parser/data-parser-qr.js";
import { dataBuildFinal } from "../records/data-build.js";
import { dataStorageClearEncrypted } from "../storage/data-storage-encrypted.js";
import { dataStorageClearMerged } from "../storage/data-storage-merged.js";
import { dataStorageAppendPending } from "../storage/data-storage-pending.js";
import { dataStorageClearPending } from "../storage/data-storage-pending.js";

/** Adds an account from manual setup, merges with cloud backup, and syncs. */
async function dataAddManual(authNumber, formData) {
  try {
    const parsed = dataParserManual(formData);
    const account = dataBuildFinal(parsed);
    await dataStorageAppendPending(account);
    await dataRestore(authNumber);
    await dataMerge(authNumber);
    await dataStorageClearEncrypted();
    await dataStorageClearPending();
    await dataBackup(authNumber);
    await dataStorageClearMerged();
    await dataSync(authNumber);
    return account;
  } catch (error) {
    console.warn("[data-actions] dataAddManual failed", error);
    throw error;
  }
}

/** Adds an account from a scanned otpauth URI, merges with cloud backup, and syncs. */
async function dataAddQr(authNumber, otpauthUri) {
  try {
    const parsed = dataParserQr(otpauthUri);
    const account = dataBuildFinal(parsed);
    await dataStorageAppendPending(account);
    await dataRestore(authNumber);
    await dataMerge(authNumber);
    await dataStorageClearEncrypted();
    await dataStorageClearPending();
    await dataBackup(authNumber);
    await dataStorageClearMerged();
    await dataSync(authNumber);
    return account;
  } catch (error) {
    console.warn("[data-actions] dataAddQr failed", error);
    throw error;
  }
}

export { dataAddManual };
export { dataAddQr };
