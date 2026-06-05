import { dataBackupUpload } from "../backup/data-backup.js";
import { dataBackupMerge } from "../backup/data-merge.js";
import { dataBackupRestore } from "../backup/data-restore.js";
import { dataBackupSync } from "../backup/data-sync.js";
import { dataParseManual } from "../parser/data-parser-manual.js";
import { dataParseQr } from "../parser/data-parser-qr.js";
import { dataBuildFinal } from "../records/data-build.js";
import { dataStorageClearEncrypted } from "../storage/data-storage-encrypted.js";
import { dataStorageClearMerged } from "../storage/data-storage-merged.js";
import { dataStorageAppendPending } from "../storage/data-storage-pending.js";
import { dataStorageClearPending } from "../storage/data-storage-pending.js";

/** Adds an account from manual setup, merges with cloud backup, and syncs. */
export async function dataAddManual(accountNumber, formData) {
  try {
    const parsed = dataParseManual(formData);
    const account = dataBuildFinal(parsed);
    await dataStorageAppendPending(account);
    await dataBackupRestore(accountNumber);
    await dataBackupMerge(accountNumber);
    await dataStorageClearEncrypted();
    await dataStorageClearPending();
    await dataBackupUpload(accountNumber);
    await dataStorageClearMerged();
    await dataBackupSync(accountNumber);
    return account;
  } catch (error) {
    console.warn("[data-actions] dataAddManual failed", error);
    throw error;
  }
}

/** Adds an account from a scanned otpauth URI, merges with cloud backup, and syncs. */
export async function dataAddQr(accountNumber, otpauthUri) {
  try {
    const parsed = dataParseQr(otpauthUri);
    const account = dataBuildFinal(parsed);
    await dataStorageAppendPending(account);
    await dataBackupRestore(accountNumber);
    await dataBackupMerge(accountNumber);
    await dataStorageClearEncrypted();
    await dataStorageClearPending();
    await dataBackupUpload(accountNumber);
    await dataStorageClearMerged();
    await dataBackupSync(accountNumber);
    return account;
  } catch (error) {
    console.warn("[data-actions] dataAddQr failed", error);
    throw error;
  }
}
