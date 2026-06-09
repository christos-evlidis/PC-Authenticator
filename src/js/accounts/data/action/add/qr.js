import { dataHandleBackup } from "../../handle/backup.js";
import { dataHandleMerge } from "../../handle/merge.js";
import { dataHandleRestore } from "../../handle/restore.js";
import { dataParseQr } from "../../parse/qr.js";
import { dataRecordBuildFinal } from "../../record/build/final.js";
import { dataStoragePendingAppend } from "../../storage/pending/append.js";
import { dataStoragePendingClear } from "../../storage/pending/clear.js";
import { dataStorageMergedClear } from "../../storage/merged/clear.js";
import { dataStorageRestoredClear } from "../../storage/restored/clear.js";

/** Adds an account from a scanned otpauth URI, merges with cloud dataBackup, and syncs. */
async function dataActionAddQr(authNumber, otpauthUri) {
  try {
    const parsed = dataParseQr(otpauthUri);
    const account = dataRecordBuildFinal(parsed);
    await dataStoragePendingAppend(account);
    await dataHandleRestore(authNumber);
    await dataHandleMerge(authNumber);
    await dataHandleBackup(authNumber);
    await dataStorageRestoredClear();
    await dataStoragePendingClear();
    await dataStorageMergedClear();
    return account;
  } catch (error) {
    console.warn("[data-action] dataActionAddQr failed", error);
    throw error;
  }
}

export { dataActionAddQr };
