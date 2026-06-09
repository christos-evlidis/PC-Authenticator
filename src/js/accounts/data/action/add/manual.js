import { dataHandleBackup } from "../../handle/backup.js";
import { dataHandleMerge } from "../../handle/merge.js";
import { dataHandleRestore } from "../../handle/restore.js";
import { dataParseManual } from "../../parse/manual.js";
import { dataRecordBuildFinal } from "../../record/build/final.js";
import { dataStoragePendingAppend } from "../../storage/pending/append.js";
import { dataStoragePendingClear } from "../../storage/pending/clear.js";
import { dataStorageMergedClear } from "../../storage/merged/clear.js";
import { dataStorageRestoredClear } from "../../storage/restored/clear.js";

/** Adds an account from manual setup, merges with cloud dataBackup, and syncs. */
async function dataActionAddManual(authNumber, formData) {
  try {
    const parsed = dataParseManual(formData);
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
    console.warn("[data-action] dataActionAddManual failed", error);
    throw error;
  }
}

export { dataActionAddManual };
